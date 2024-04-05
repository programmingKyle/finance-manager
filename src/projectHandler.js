const addProjectButton_el = document.getElementById('addProjectButton');

document.addEventListener('DOMContentLoaded', async () => {
    await populateProjectList();
});

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

    confirmAddProjectButton_el.addEventListener('click', async () => {
        if (projectNameInput_el.value === ''){
            errorHandling(projectNameInput_el);
            return;
        }
        const result = await api.projectHandler({request: 'Add', name: projectNameInput_el.value, type: projectTypeSelected});
        if (result === 'duplicate'){
            errorHandling(projectNameInput_el);
            return;
        }
        overlayContainer_el.style.display = 'none';
        await populateProjectList();
    });
}

async function populateProjectList(){
    projectListContainer_el.innerHTML = '';
    const results = await api.projectHandler({request: 'View', type: projectTypeSelected});
    const sortedResults = results.sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));
    sortedResults.forEach(element => {
        const projectButton_el = document.createElement('button');
        projectButton_el.textContent = element.name;

        projectListContainer_el.append(projectButton_el);
    });
}