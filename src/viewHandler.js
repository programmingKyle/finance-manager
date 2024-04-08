const homeView_el = document.getElementById('homeView');
const projectView_el = document.getElementById('projectView');

function changeView(view){
    if (view === 'project'){
        homeView_el.style.display = 'none';
        projectView_el.style.display = 'grid';
    } else if (view === 'home'){
        homeView_el.style.display = 'grid';
        projectView_el.style.display = 'none';
    }
}