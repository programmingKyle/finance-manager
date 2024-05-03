const graphSelect1_el = document.getElementById('graphSelect1');
const graphSelect2_el = document.getElementById('graphSelect2');
const graphSelect3_el = document.getElementById('graphSelect3');
const graphSelect4_el = document.getElementById('graphSelect4');

const graphSelects = [graphSelect1_el, graphSelect2_el, graphSelect3_el, graphSelect4_el];

let graphSettings;

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

async function graphOptionSelect(){
    graphSelect1_el.value = graphSettings.homeComp;
    graphSelect2_el.value = graphSettings.homeInter;
    graphSelect3_el.value = graphSettings.projectComp;
    graphSelect4_el.value = graphSettings.projectGrowth;
}

document.addEventListener('DOMContentLoaded', async () => {
    graphSettings = await api.graphSettingsHandler({request: 'Get'});
    graphSelects.forEach(element => {
        populateGraphSelect(element);        
    });
    await graphOptionSelect();
});

async function updateGraphSettings(graphSelect, timeOption){
    const graphSettingsResult = await api.graphSettingsHandler({request: 'Update', graphSelect, timeOption});
    return graphSettingsResult;
}

// Home View Comparison Graph
graphSelect1_el.addEventListener('change', async () => {
    await updateGraphSettings('homeComp', graphSelect1_el.value);
    if (combGraph){
        combGraph.destroy();
    }
    combGraph = await populateActiveCompGraph();
});

// Home View Number of Transactions Graph
graphSelect2_el.addEventListener('change', async () => {
    await updateGraphSettings('homeInter', graphSelect2_el.value);
    if (interactionsGraph){
        interactionsGraph.destroy();
    }
    interactionsGraph = await populateActiveInteractions();
});

// Prject View Comparison Graph
graphSelect3_el.addEventListener('change', async () => {
    await updateGraphSettings('projectComp', graphSelect3_el.value);
    if (projectCombGraph){
        projectCombGraph.destroy();
    }
    projectCombGraph = await populateProjectCompGraph();
});

// Project View Profit Growth Graph
graphSelect4_el.addEventListener('change', async () => {
    await updateGraphSettings('projectGrowth', graphSelect4_el.value);
    if (projectGrowthGraph){
        projectGrowthGraph.destroy();
    }
    projectGrowthGraph = await populateProjectGrowthGraph();
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

function getTimeLabels(data, select){
    const labels = data.map(data => {
        if (select.value !== 'Annual'){
            const split = data.date.split('-');
            return `${split[1]}-${split[2]}`;
        } else {
            return data.date;
        }
    })
    return labels;
}