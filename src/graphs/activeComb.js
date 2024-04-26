const activeCombGraph_el = document.getElementById('activeCombGraph');
const ctxSalesExpenses = activeCombGraph_el.getContext('2d');

let combGraph;
let pastCombDates;

function createSalesExpensesComparisonGraph(data) {
  const monthLabels = data.map(data => data.date);
  const randomSalesData = data.map(data => data.sales);
  const randomExpensesData = data.map(data => data.totalExpenses);
    
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
  return createSalesExpensesComparisonGraph(graphData);
}

// Used for home view which is a total across all projects
async function getCompGraphData(){
  const projectIDs = graphProjects.map(project => project.id);
  pastCombDates = await getPastDates(graphSelect1_el.value);
  const number = await numberSelect(graphSelect1_el);
  const graphData = {};

  for (const id of projectIDs) {
    const projectSales = await api.getGraphData({ request: 'ProjectInteractions', projectID: id, type: 'sale', select: graphSelect1_el.value, number });
    const projectExpenses = await api.getGraphData({ request: 'ProjectInteractions', projectID: id, type: 'expense', select: graphSelect1_el.value, number });
    const salesValues = await calculateMonthlyValues(projectSales);
    const expensesValues = await calculateMonthlyValues(projectExpenses);
  
    salesValues.forEach(sale => {
      const { date, monthTotal } = sale;
      if (!graphData[date]) {
        graphData[date] = { sales: monthTotal, totalExpenses: 0 };
      } else {
        graphData[date].sales += monthTotal;
      }
    });
  
    expensesValues.forEach(expense => {
      const { date, monthTotal } = expense;
      if (!graphData[date]) {
        graphData[date] = { sales: 0, totalExpenses: monthTotal };
      } else {
        graphData[date].totalExpenses += monthTotal;
      }
    });
  }
  
  const graphDataArray = Object.entries(graphData).map(([date, { sales, totalExpenses }]) => ({ date, sales, totalExpenses }));
  
  return graphDataArray;
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

  const result = pastCombDates.map(month => ({
    date: month,
    monthTotal: totals[month] || 0
  }));
  return result;
}

