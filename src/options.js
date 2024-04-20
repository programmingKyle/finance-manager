let projectListDiv_el;
let currencies;
let selectedCurrency;

document.addEventListener('DOMContentLoaded', async () => {
    await getSelectedCurrency();
    await populateHomeViewGraphs();
});

async function getSelectedCurrency(){
    selectedCurrency = await api.currencyOptionsHandler({request: 'View'});
}

async function populateOptions(){
    projectListContainer_el.innerHTML = '';
    currencies = await api.getCurrencies();
    await populateGraphOptions();
}

async function populateGraphOptions(){
    const graphDiv_el = document.createElement('div');
    graphDiv_el.classList.add('graph-options-grid');

    const title_el = document.createElement('h4');
    title_el.textContent = 'Home View Graphs';

    const currencySelect_el = document.createElement('select');
    currencies.forEach(element => {
        const selectItem_el = document.createElement('option');
        selectItem_el.textContent = element.currency;
        selectItem_el.value = element.currency;

        currencySelect_el.append(selectItem_el);
    });
    currencySelect_el.value = selectedCurrency.currency;
    currencySelectListener(currencySelect_el);

    projectListDiv_el = document.createElement('div');
    projectListDiv_el.classList.add('graph-options-item');

    graphDiv_el.append(title_el, currencySelect_el, projectListDiv_el);

    projectListContainer_el.append(graphDiv_el);
}


// Used to see when the select drop down has changed and to repopulate a project list
async function currencySelectListener(select){
    await graphOptionItems(select.value);
    select.addEventListener('change', async () => {
        projectListDiv_el.innerHTML = '';
        await graphOptionItems(select.value);
        await api.currencyOptionsHandler({request: 'Save', currency: select.value});
    });
}

async function graphOptionItems(currency){
    const result = await api.projectListFromCurrency({currency});

    result.forEach(element => {
        const itemDiv_el = document.createElement('div');
        itemDiv_el.style.gridColumn = 'span 2';
        itemDiv_el.classList.add('graph-options-item');

        const itemToggleIcon_el = document.createElement('h6');
        const itemLabel_el = document.createElement('h5');
        itemLabel_el.textContent = element.name;
        if (element.homeGraph === 1){
            // If home graph is enabled
            itemToggleIcon_el.classList.add('fas', 'fa-check', 'active');
            itemLabel_el.classList.add('active');
        } else {
            itemToggleIcon_el.classList.add('fa-regular', 'fa-circle');
        }

        itemDiv_el.append(itemToggleIcon_el, itemLabel_el);

        itemDiv_el.addEventListener('click', () => {
            toggleProjectItem(itemToggleIcon_el, itemLabel_el, element)
        });

        projectListDiv_el.append(itemDiv_el);
    });
}

async function toggleProjectItem(icon, label, data){
    data.homeGraph === 1 ? data.homeGraph = 0 : data.homeGraph = 1;
    const result = await api.projectHandler({request: 'HomeGraph', id: data.id, isHomeGraphed: data.homeGraph});
    if (result){
        if (data.homeGraph === 1){
            icon.classList.add('fas', 'fa-check', 'active');
            icon.classList.remove('fa-regular', 'fa-circle');
            label.classList.add('active');    
        } else {
            icon.classList.remove('fas', 'fa-check', 'active');
            icon.classList.add('fa-regular', 'fa-circle');
            label.classList.remove('active');
        }
    } else {
        data.homeGraph === 1 ? data.homeGraph = 0 : data.homeGraph = 1;
        return;
    }
}