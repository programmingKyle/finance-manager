const activeInteractionsGraph_el = document.getElementById('activeInteractionsGraph');
const ctxInteractions = activeInteractionsGraph_el.getContext('2d');

let interactionsGraph;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createActiveInteractionsGraph() {
  const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const activeInteractionsData = [];

  // Generate random number of interactions for each month
  for (let i = 0; i < 12; i++) {
    activeInteractionsData.push(getRandomInt(5, 25)); // Generate random value and add to data array
  }

  return new Chart(ctxInteractions, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [{
        label: 'Active Interactions',
        data: activeInteractionsData,
        backgroundColor: '#1976D2',
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
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
            labelString: 'Interactions',
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

async function populateActiveInteractions(){
  interactionsGraph = createActiveInteractionsGraph();
  const interactionsData = await getActiveInteractions();
  console.log(interactionsData);
}

async function getActiveInteractions(){
  // This will get the projects that have homeGraph enabled
  const projects = await api.getGraphData({request: 'GetProjects', currency: selectedCurrency.currency});
  const projectIDs = projects.map(project => project.id);
  const pastMonths = await getPastMonths();
  const interactionCounts = {};

  for (const id of projectIDs){
    const interactions = await api.getGraphData({request: 'ProjectsInteractions', projectID: id});
    interactions.forEach(interaction => {
      const {month, interactionCount} = interaction;
      // Checks if the interactionsCount object already has a property to the current month
      // If the month hasn't been encountered yet it will start the count at 0
      if (!interactionCounts[month]){
        interactionCounts[month] = 0;
      }
      interactionCounts[month] += interactionCount;
    });
  }
  const result = pastMonths.map(month => ({
    date: month,
    interactionCount: interactionCounts[month] || 0
  }));
  return result;
}

async function getPastMonths() {
  const pastMonths = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    pastMonths.push(formattedMonth);
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return pastMonths;
}