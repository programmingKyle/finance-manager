const homeView_el = document.getElementById('homeView');
const projectView_el = document.getElementById('projectView');
const projectTitleText_el = document.getElementById('projectTitleText');
const currencyText_el = document.getElementById('currencyText');

function changeView(view, name, currency){
    if (view === 'project'){
        currencyText_el.textContent = currency;
        projectTitleText_el.textContent = name;
        homeView_el.style.display = 'none';
        projectView_el.style.display = 'grid';
    } else if (view === 'home'){
        homeView_el.style.display = 'grid';
        projectView_el.style.display = 'none';
    }
}