const projectCompGraph_el = document.getElementById('projectCompGraph');
const projectSalesExpenses = projectCompGraph_el.getContext('2d');

let projectCombGraph;
let projectGraphData;

function createProjectSaleExpensesGraph(data) {
  const monthLabels = data.map(data => data.date);
  const randomSalesData = data.map(data => data.sales);
  const randomExpensesData = data.map(data => data.totalExpenses);
    
    return new Chart(projectSalesExpenses, {
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

async function populateProjectCompGraph(){
  projectGraphData = await getProjectCompData();
  return createProjectSaleExpensesGraph(projectGraphData);
}

async function getProjectCompData(){
  const graphData = {};

  const projectSales = await api.getGraphData({ request: 'ProjectInteractions', projectID: currentProjectID, type: 'sale' });
  const projectExpenses = await api.getGraphData({ request: 'ProjectInteractions', projectID: currentProjectID, type: 'expense' });
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

  const graphDataArray = Object.entries(graphData).map(([date, { sales, totalExpenses }]) => ({ date, sales, totalExpenses }));
  
  return graphDataArray;
}