const addProjectButton_el = document.getElementById('addProjectButton');
const projectEditButton_el = document.getElementById('projectEditButton');
const projectBackButton_el = document.getElementById('projectBackButton');

let currentProjectID;
let projectData;

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
    const currencyInput_el = document.getElementById('currencyInput');
    const confirmAddProjectButton_el = document.getElementById('confirmAddProjectButton');

    maxCharacterInput(currencyInput_el, 4);

    addProjectCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    confirmAddProjectButton_el.addEventListener('click', async () => {
        if (projectNameInput_el.value === '' || currencyInput_el.value === ''){
            if (projectNameInput_el.value === '') {
                errorHandling(projectNameInput_el);
            }
            if (currencyInput_el.value === '') {
                errorHandling(currencyInput_el);
            }
            return;
        }
                
        const result = await api.projectHandler({request: 'Add', name: projectNameInput_el.value, currency: currencyInput_el.value, type: navSelected});
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
    const results = await api.projectHandler({request: 'View', type: navSelected});
    const sortedResults = results.sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));
    sortedResults.forEach(element => {
        const projectButton_el = document.createElement('button');
        projectButton_el.textContent = element.name;

        projectButton_el.addEventListener('click', async () => {
            currentProjectID = element.id;
            projectData = element;
            changeView('project', element.name, element.currency);
            getLogContent();
            await populateProjectViewGraphs();
        });

        projectListContainer_el.append(projectButton_el);
    });
}

projectBackButton_el.addEventListener('click', async () => {
    changeView('home');
    populateProjectList();
    await populateHomeViewGraphs();
});

projectEditButton_el.addEventListener('click', () => {
    overlayContainer_el.style.display = 'flex';
    loadOverlayContent('overlays.html', '#editProjectContainer', editProjectListeners);
});

async function editProjectListeners(){
    const editProjectCloseButton_el = document.getElementById('editProjectCloseButton');
    const editProjectNameInput_el = document.getElementById('editProjectNameInput');
    const editCurrencyInput_el = document.getElementById('editCurrencyInput');
    const confirmEditProjectButton_el = document.getElementById('confirmEditProjectButton');
    const deleteProjectButton_el = document.getElementById('deleteProjectButton');

    editProjectNameInput_el.value = projectData.name;
    editCurrencyInput_el.value = projectData.currency;

    maxCharacterInput(editCurrencyInput_el, 4);

    editProjectCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    confirmEditProjectButton_el.addEventListener('click', async () => {
        if (editProjectNameInput_el.value === '' || editCurrencyInput_el.value === ''){
            if (editProjectNameInput_el.value === ''){
                errorHandling(editProjectNameInput_el);
            }
            if (editCurrencyInput_el.value === ''){
                errorHandling(editCurrencyInput_el);
            }
            return;
        }

        const editSuccess = await api.projectHandler({request: 'Edit', id: projectData.id, newName: editProjectNameInput_el.value, newCurrency: editCurrencyInput_el.value});
        if (editSuccess){
            projectData.name = editProjectNameInput_el.value;
            projectData.currency = editCurrencyInput_el.value;
            changeView('project', projectData.name, projectData.currency);
            overlayContainer_el.style.display = 'none';
        }
    });

    deleteProjectButton_el.addEventListener('click', () => {
        loadOverlayContent('overlays.html', '#deleteProjectContainer', deleteProjectListeners);
    });
}

function deleteProjectListeners(){
    const deleteProjectCloseButton_el = document.getElementById('deleteProjectCloseButton');
    const confirmDeleteInput_el = document.getElementById('confirmDeleteInput');
    const confirmDeleteButton_el = document.getElementById('confirmDeleteButton');

    deleteProjectCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    confirmDeleteButton_el.addEventListener('click', async () => {
        if (confirmDeleteInput_el.value === '' || confirmDeleteInput_el.value !== 'DELETE'){
            errorHandling(confirmDeleteInput_el);
            return;
        }
        const deleteResult = await api.projectHandler({request: 'Delete', id: currentProjectID});
        if (deleteResult){
            overlayContainer_el.style.display = 'none';
            changeView('home');
            populateProjectList();
            await populateHomeViewGraphs();
        }
    });
}