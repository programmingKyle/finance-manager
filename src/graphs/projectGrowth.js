const projectGrowthGraph_el = document.getElementById('projectGrowthGraph');
const projectGrowth = projectGrowthGraph_el.getContext('2d');

let projectGrowthGraph;

function createProjectGrowthGraph(data, previousProfit) {
    const monthLabels = data.dateValues;
    let growthData = data.profitValues;
    growthData = growthData.map(value => value += previousProfit);
    
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
    const previousProfit = await getProjectPreviousProfits();
    const graphData = await getProjectGrowthData();
    return createProjectGrowthGraph(graphData, previousProfit);
}

async function getProjectPreviousProfits(){
    const number = await numberSelect(graphSelect4_el);
    const previousSales = await api.getGraphData({request: 'PreviousProfits', projectID: currentProjectID, type: 'sale', select: graphSelect4_el.value, number: number});
    const previousExpenses = await api.getGraphData({request: 'PreviousProfits', projectID: currentProjectID, type: 'expense', select: graphSelect4_el.value, number: number});
    const total = previousSales + previousExpenses;
    return total;
}

async function getProjectGrowthData(){
    const pastDates = await getPastDates(graphSelect4_el.value);
    const number = await numberSelect(graphSelect4_el);
    const graphData = {};

    const projectSales = await api.getGraphData({ request: 'ProjectInteractions', projectID: currentProjectID, type: 'sale', select: graphSelect4_el.value, number: number });
    const projectExpenses = await api.getGraphData({ request: 'ProjectInteractions', projectID: currentProjectID, type: 'expense', select: graphSelect4_el.value, number: number });
    const salesValues = await calculateMonthlyValues(projectSales, pastDates);
    const expensesValues = await calculateMonthlyValues(projectExpenses, pastDates);
  
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
    
    const dateValues = [];
    const profitValues = [];
    
    let previous = 0;

    for (const date in graphData) {
        const entry = graphData[date];
        const profit = entry.sales - entry.totalExpenses;
        previous += profit;
        dateValues.push(date);
        profitValues.push(previous);
    }

    return {dateValues, profitValues}
}
