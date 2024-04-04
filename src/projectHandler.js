const addProjectButton_el = document.getElementById('addProjectButton');

addProjectButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#addProjectContainer', addProjectListeners);
});

function addProjectListeners(){
    const addProjectCloseButton_el = document.getElementById('addProjectCloseButton');
    const projectNameInput_el = document.getElementById('projectNameInput');
    const confirmAddProjectButton_el = document.getElementById('confirmAddProjectButton');

    addProjectCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });
}
