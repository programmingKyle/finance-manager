const addProjectButton_el = document.getElementById('addProjectButton');
const projectBackButton_el = document.getElementById('projectBackButton');

let currentProjectID;

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
                
        const result = await api.projectHandler({request: 'Add', name: projectNameInput_el.value, currency: currencyInput_el.value, type: projectTypeSelected});
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

        projectButton_el.addEventListener('click', () => {
            currentProjectID = element.id;
            changeView('project', element.name, element.currency);
            getLogContent();
        });

        projectListContainer_el.append(projectButton_el);
    });
}

projectBackButton_el.addEventListener('click', () => {
    changeView('home');
});
