const activeNavButton_el = document.getElementById('activeNavButton');
const simNavButton_el = document.getElementById('simNavButton');
const selectNavText_el = document.getElementById('selectNavText');
const projectListContainer_el = document.getElementById('projectListContainer');

activeNavButton_el.addEventListener('click', () => {
    selectNavText_el.textContent = 'Active';
    if (simNavButton_el.classList.contains('active')){
        simNavButton_el.classList.remove('active');
    }
    activeNavButton_el.classList.add('active');
});

simNavButton_el.addEventListener('click', () => {
    selectNavText_el.textContent = 'Simulated';
    if (activeNavButton_el.classList.contains('active')){
        activeNavButton_el.classList.remove('active');
    }
    simNavButton_el.classList.add('active');
});
