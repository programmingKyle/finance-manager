const activeCombGraph_el = document.getElementById('activeCombGraph');
const ctxSalesExpenses = activeCombGraph_el.getContext('2d');

let combGraph;

function getMonths() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months;
}

function generateRandomData(length) {
    const data = [];
    for (let i = 0; i < length; i++) {
        data.push(Math.floor(Math.random() * 1000));
    }
    return data;
}  

function createSalesExpensesComparisonGraph() {
    const monthLabels = getMonths();
    const randomSalesData = generateRandomData(monthLabels.length);
    const randomExpensesData = generateRandomData(monthLabels.length);
    
    return new Chart(ctxSalesExpenses, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Sales',
          data: randomSalesData,
          borderColor: '#17BF41',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Expenses',
          data: randomExpensesData,
          borderColor: '#A93131',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderWidth: 2,
          fill: false,
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display:  false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              beginAtZero: true,
              color: '#7C90DB',
            },
            scaleLabel: {
              display: true,
              labelString: 'Amount',
              color: '#7C90DB',
            }
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: true,
              color: '#7C90DB',
            },
            scaleLabel: {
              display: true,
              labelString: 'Month',
              color: '#333',
            }
          },
        },
      },
    });
}

async function populateActiveCompGraph(){
  const graphData = await getCompGraphData();
  return createSalesExpensesComparisonGraph();
}

// Used for home view which is a total across all projects
async function getCompGraphData(){
  const projectIDs = graphProjects.map(project => project.id);
  // This will be used to return the month as well as that months total sales
  const graphData = {};

  for (const id of projectIDs){
    const projectSales = await api.getGraphData({request: 'ProjectInteractions', projectID: id, type: 'sale'})
    const projectExpenses = await api.getGraphData({request: 'ProjectInteractions', projectID: id, type: 'expense'})
    const salesValues = await calculateMonthlyValues(projectSales);
    const expensesValues = await calculateMonthlyValues(projectExpenses);
    
    salesValues.forEach(sale => {
      const { date, monthTotal } = sale;
      if (!graphData[date]){
        graphData[date] = { sales: monthTotal, totalExpenses: 0};
      } else {
        graphData[date].sales += monthTotal;
      }
    });

    expensesValues.forEach(expense => {
      const { date, monthTotal } = expense;
      if (!graphData[date]){
        graphData[date] = { totalSales: 0, totalExpenses: monthTotal };
      } else {
        if (!graphData[date].totalExpenses) {
          graphData[date].totalExpenses = monthTotal;
        } else {
          graphData[date].totalExpenses += monthTotal;
        }
      }
    });
  }

  console.log(graphData);
}

async function calculateMonthlyValues(values) {
  const totals = {};
  values.forEach(element => {
    const { month, total } = element;
    if (!totals[month]) {
      totals[month] = 0;
    }
    if (total > 0) {
      totals[month] += total;
    } else if (total < 0) {
      totals[month] -= total;
    }
  });

  const result = pastMonths.map(month => ({
    date: month,
    monthTotal: totals[month] || 0
  }));
  return result;
}

