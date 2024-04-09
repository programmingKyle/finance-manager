const homeView_el = document.getElementById('homeView');
const projectView_el = document.getElementById('projectView');
const projectTitleText_el = document.getElementById('projectTitleText');

function changeView(view, name){
    if (view === 'project'){
        projectTitleText_el.textContent = name;
        homeView_el.style.display = 'none';
        projectView_el.style.display = 'grid';
    } else if (view === 'home'){
        homeView_el.style.display = 'grid';
        projectView_el.style.display = 'none';
    }
}