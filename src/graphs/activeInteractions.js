const activeInteractionsGraph_el = document.getElementById('activeInteractionsGraph');
const ctxInteractions = activeInteractionsGraph_el.getContext('2d');

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

document.addEventListener('DOMContentLoaded', () => {
    createActiveInteractionsGraph();
});
