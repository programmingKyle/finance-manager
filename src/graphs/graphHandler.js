const topGraphSelect_el = document.getElementById('topGraphSelect');
const bottomGraphSelect_el = document.getElementById('bottomGraphSelect');

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
    populateGraphSelect(topGraphSelect_el);
    populateGraphSelect(bottomGraphSelect_el);
});

topGraphSelect_el.addEventListener('change', () => {
    console.log(topGraphSelect_el.value);
});

bottomGraphSelect_el.addEventListener('change', () => {
    console.log(bottomGraphSelect_el.value);
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
    resizeTimer = setTimeout(() => {
        interactionsGraph = createActiveInteractionsGraph();
        combGraph = createSalesExpensesComparisonGraph();    
    }, 500);
});