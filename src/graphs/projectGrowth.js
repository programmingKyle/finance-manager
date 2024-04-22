const projectGrowthGraph_el = document.getElementById('projectGrowthGraph');
const projectGrowth = projectGrowthGraph_el.getContext('2d');

let projectGrowthGraph;

function createProjectGrowthGraph(data) {
    const monthLabels = data.dateValues;
    const growthData = data.profitValues;
    
    return new Chart(projectGrowth, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Growth',
                data: growthData,
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

async function populateProjectGrowthGraph(){
    // This will be used to get profits outside of teh currency time selection
    const previousProfit = await getProjectPreviousProfits();
    const graphData = await getProjectGrowthData();
    return createProjectGrowthGraph(graphData);
}

async function getProjectPreviousProfits(){
    const previousSales = await api.getGraphData({request: 'PreviousProfits', projectID: currentProjectID, type: 'sale'});
    const previousExpenses = await api.getGraphData({request: 'PreviousProfits', projectID: currentProjectID, type: 'expense'});

    console.log(previousSales);
    console.log(previousExpenses);
}

async function getProjectGrowthData(){
    const dateValues = [];
    const profitValues = [];
    
    let previous = 0;

    projectGraphData.forEach(entry => {
        const profit = entry.sales - entry.totalExpenses;
        previous += profit;
        dateValues.push(entry.date);
        profitValues.push(previous);
    });

    return {dateValues, profitValues}
}
