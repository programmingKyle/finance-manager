const graphSelect1_el = document.getElementById('graphSelect1');
const graphSelect2_el = document.getElementById('graphSelect2');
const graphSelect3_el = document.getElementById('graphSelect3');
const graphSelect4_el = document.getElementById('graphSelect4');

const graphSelects = [graphSelect1_el, graphSelect2_el, graphSelect3_el, graphSelect4_el];

// Used for populating select options
function populateGraphSelect(select){
    const optionLabels = ['Annual', 'Month', 'Week'];

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
graphSelect2_el.addEventListener('change', async () => {
    if (interactionsGraph){
        interactionsGraph.destroy();
    }
    interactionsGraph = await populateActiveInteractions();
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
        if (!currentProjectID) {
            interactionsGraph = await populateActiveInteractions();
            combGraph = await populateActiveCompGraph();    
        } else {
            projectCombGraph = await populateProjectCompGraph();
            projectGrowthGraph = await populateProjectGrowthGraph();    
        }
    }, 500);
});

async function populateHomeViewGraphs(){
    if (interactionsGraph){
        interactionsGraph.destroy();
    }
    if (combGraph){
        combGraph.destroy();
    }
    interactionsGraph = await populateActiveInteractions();
    combGraph = await populateActiveCompGraph();
}

async function populateProjectViewGraphs(){
    if (!currentProjectID) return
    if (projectCombGraph){
        projectCombGraph.destroy();
    }
    if (projectGrowthGraph){
        projectGrowthGraph.destroy();
    }
    projectCombGraph = await populateProjectCompGraph();
    projectGrowthGraph = await populateProjectGrowthGraph();
}

// Used for when using the time drop down. This will select the number of date entries needed
async function numberSelect(input){
    if (input.value === 'Annual'){
        return 12;
    } else if (input.value === 'Month'){
        return 30;
    } else if (input.value === 'Week'){
        return 7;
    }
}

