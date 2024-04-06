const activeCombGraph_el = document.getElementById('activeCombGraph');
const ctxSalesExpenses = activeCombGraph_el.getContext('2d');

// Function to get an array of month labels (e.g., ['January', 'February', ...])
function getMonths() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months;
}
  
// Function to generate an array of random data with specified length
function generateRandomData(length) {
    const data = [];
    for (let i = 0; i < length; i++) {
        // Generate random value between 0 and 1000 (adjust range as needed)
        data.push(Math.floor(Math.random() * 1000));
    }
    return data;
}  

function createSalesExpensesComparisonGraph() {
    const monthLabels = getMonths(); // Assuming you have a function to get month labels
    const randomSalesData = generateRandomData(monthLabels.length);
    const randomExpensesData = generateRandomData(monthLabels.length); // Assuming you have a function to generate random data
    
    return new Chart(ctxSalesExpenses, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Sales',
          data: randomSalesData,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 128, 0, 0.2)', // Light green fill
          borderWidth: 2,
          fill: false, // Don't fill area under line
        },
        {
          label: 'Expenses',
          data: randomExpensesData,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red fill
          borderWidth: 2,
          fill: false, // Don't fill area under line
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
              color: 'rgba(0, 0, 0, 0.1)', // Light gray gridlines
            },
            ticks: {
              beginAtZero: true,
              color: '#7C90DB', // Darken tick labels
            },
            scaleLabel: {
              display: true,
              labelString: 'Amount',
              color: '#7C90DB', // Darken scale label
            }
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: true,
              color: '#7C90DB', // Darken tick labels
            },
            scaleLabel: {
              display: true,
              labelString: 'Month',
              color: '#333', // Darken scale label
            }
          },
        },
      },
    });
}
  
document.addEventListener('DOMContentLoaded', () => {
    createSalesExpensesComparisonGraph();
});