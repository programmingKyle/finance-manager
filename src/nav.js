const activeNavButton_el = document.getElementById('activeNavButton');
const simNavButton_el = document.getElementById('simNavButton');
const selectNavText_el = document.getElementById('selectNavText');
const projectListContainer_el = document.getElementById('projectListContainer');
const optionNavButton_el = document.getElementById('optionNavButton');

let navSelected = 'active';

const navElements = [activeNavButton_el, simNavButton_el, optionNavButton_el];

activeNavButton_el.addEventListener('click', async () => {
    selectNavText_el.textContent = 'Active';
    navSelected = 'active';
    await populateProjectList();
    toggleNav(activeNavButton_el);
});

simNavButton_el.addEventListener('click', async () => {
    selectNavText_el.textContent = 'Simulated';
    navSelected = 'simulated';
    await populateProjectList();
    toggleNav(simNavButton_el);
});

optionNavButton_el.addEventListener('click', async () => {
    selectNavText_el.textContent = 'Options';
    navSelected = 'options';
    await populateOptions();
    toggleNav(optionNavButton_el);
});

function toggleNav(activeTab){
    toggleAddButton();
    activeTab.classList.add('active');
    navElements.forEach(element => {
        if (element !== activeTab){
            element.classList.remove('active');
        }
    });
}

function toggleAddButton(){
    if (navSelected === 'options'){
        addProjectButton_el.style.visibility = 'hidden';
    } else {
        addProjectButton_el.style.visibility = 'visible';
    }
}