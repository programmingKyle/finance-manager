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
  await getCompGraphData();
  return createSalesExpensesComparisonGraph();
}

// Used for home view which is a total across all projects
async function getCompGraphData(){
  console.log(graphProjects);
  const projectIDs = graphProjects.map(project => project.id);
  const pastMonths = await getPastMonths();
  // This will be used to return the month as well as that months total sales
  const saleTotals = {};
  const expenseTotals = {};

  for (const id of projectIDs){
    const projectSales = await api.getGraphData({request: 'ProjectInteractions', projectID: id, type: 'sale'})
    const projectExpenses = await api.getGraphData({request: 'ProjectInteractions', projectID: id, type: 'expense'})
    console.log(projectSales);
    console.log(projectExpenses);
  }
}