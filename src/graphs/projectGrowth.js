const projectGrowthGraph_el = document.getElementById('projectGrowthGraph');
const projectGrowth = projectGrowthGraph_el.getContext('2d');

let projectGrowthGraph;

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

function createProjectGrowthGraph() {
  const monthLabels = getMonths();
  const randomGrowthData = generateRandomData(monthLabels.length);
  
  return new Chart(projectGrowth, {
      type: 'line',
      data: {
          labels: monthLabels,
          datasets: [{
              label: 'Growth',
              data: randomGrowthData,
              borderColor: '#17BF41',
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              borderWidth: 2,
              fill: false,
          }],
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

document.addEventListener('DOMContentLoaded', () => {
    projectGrowthGraph = createProjectGrowthGraph();
});