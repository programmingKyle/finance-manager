let projectListDiv_el;
let currencies;

async function populateOptions(){
    projectListContainer_el.innerHTML = '';
    currencies = await api.getCurrencies();
    await populateGraphOptions();
    await graphOptionItems();
}

async function populateGraphOptions(){
    const graphDiv_el = document.createElement('div');
    graphDiv_el.classList.add('graph-options-grid');

    const title_el = document.createElement('h4');
    title_el.textContent = 'Home View Graphs';

    const currencySelect_el = document.createElement('select');

    currencies.forEach(element => {
        console.log(element.currency);
        const selectItem_el = document.createElement('option');
        selectItem_el.textContent = element.currency;
        selectItem_el.value = element.currency;

        currencySelect_el.append(selectItem_el);
    });

    projectListDiv_el = document.createElement('div');
    projectListDiv_el.classList.add('graph-options-item');

    graphDiv_el.append(title_el, currencySelect_el, projectListDiv_el);

    projectListContainer_el.append(graphDiv_el);
}

async function graphOptionItems(){
    
    const itemDiv_el = document.createElement('div');
    itemDiv_el.classList.add('graph-options-item');

    const itemToggleIcon_el = document.createElement('h5');
    itemToggleIcon_el.classList.add('fas', 'fa-check');

    const itemLabel_el = document.createElement('h5');
    itemLabel_el.textContent = 'Test Project';

    itemDiv_el.append(itemToggleIcon_el, itemLabel_el);

    projectListDiv_el.append(itemDiv_el);
    projectListDiv_el.append(itemDiv_el);
}