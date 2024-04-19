const graphSelect1_el = document.getElementById('graphSelect1');
const graphSelect2_el = document.getElementById('graphSelect2');
const graphSelect3_el = document.getElementById('graphSelect3');
const graphSelect4_el = document.getElementById('graphSelect4');

const graphSelects = [graphSelect1_el, graphSelect2_el, graphSelect3_el, graphSelect4_el];

// Used for populating select options
function populateGraphSelect(select){
    const optionLabels = ['Annual', 'Bi-Annual', 'Quarterly', 'Monthly', 'Weekly'];

    optionLabels.forEach(element => {
        const option = document.createElement('option');
        option.textContent = element;
        option.value = element;
        select.append(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    graphSelects.forEach(element => {
        populateGraphSelect(element);        
    });
});

// Home View Comparison Graph
graphSelect1_el.addEventListener('change', () => {
    console.log(graphSelect1_el.value);
});

// Home View Number of Transactions Graph
graphSelect2_el.addEventListener('change', () => {
    console.log(graphSelect2_el.value);
});

// Prject View Comparison Graph
graphSelect1_el.addEventListener('change', () => {
    console.log(graphSelect1_el.value);
});

// Project View Profit Growth Graph
graphSelect1_el.addEventListener('change', () => {
    console.log(graphSelect1_el.value);
});

let resizeTimer;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    if (combGraph){
        combGraph.destroy();
    }
    if (interactionsGraph){
        interactionsGraph.destroy();
    }
    if (projectCombGraph){
        projectCombGraph.destroy();
    }
    if (projectGrowthGraph){
        projectGrowthGraph.destroy();
    }
    resizeTimer = setTimeout(async () => {
        interactionsGraph = await populateActiveInteractions();
        combGraph = await populateActiveCompGraph();
        projectCombGraph = createProjectSaleExpensesGraph();
        projectGrowthGraph = createProjectGrowthGraph();
    }, 500);
});
