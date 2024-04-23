const logContent_el = document.getElementById('logContent');

let recentLog;
let selectedLog;

async function getLogContent(){
    recentLog = await api.logHandler({request: 'view', projectID: currentProjectID});
    await populateLogs();
}

async function populateLogs(){
    logContent_el.innerHTML = '';
    recentLog.forEach(element => {
        const itemDiv_el = document.createElement('div');
        itemDiv_el.classList.add('item');

        const itemTitle_el = document.createElement('h6');
        itemTitle_el.textContent = element.description;

        const itemDate_el = document.createElement('h6');
        itemDate_el.textContent = element.date.split(' ')[0];

        const itemValue_el = document.createElement('h6');
        itemValue_el.textContent = element.value;

        if (element.value > 0){
            itemValue_el.style.color = '#3C9539';
        } else if (element.value < 0 ){
            itemValue_el.style.color = '#DA3131';
        }

        enableViewOverlay(itemDiv_el, element);

        itemDiv_el.append(itemTitle_el, itemDate_el, itemValue_el);

        logContent_el.append(itemDiv_el);
    });
}

function enableViewOverlay(item, data){
    item.addEventListener('click', () => {
        selectedLog = data;
        overlayContainer_el.style.display = 'flex';
        loadOverlayContent('overlays.html', '#viewLogContainer', viewLogListeners);
    })
}

async function viewLogListeners(){
    const viewLogCloseButton_el = document.getElementById('viewLogCloseButton');
    const viewLogTitle_el = document.getElementById('viewLogTitle');
    const viewLogDate_el = document.getElementById('viewLogDate');
    const viewLogValue_el = document.getElementById('viewLogValue');
    const editLogButton_el = document.getElementById('editLogButton');
    const deleteLogButton_el = document.getElementById('deleteLogButton');

    viewLogTitle_el.textContent = selectedLog.description;
    viewLogDate_el.textContent = selectedLog.date;
    viewLogValue_el.textContent = selectedLog.value;

    if (selectedLog.value > 0){
        viewLogValue_el.style.color = '#3C9539';
    } else if (selectedLog.value < 0 ){
        viewLogValue_el.style.color = '#DA3131';
    }

    enableEditLogOverlay(editLogButton_el);

    viewLogCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });
}

function enableEditLogOverlay(button){
    button.addEventListener('click', () => {
        loadOverlayContent('overlays.html', '#editLogContainer', editLogListeners);
    });
}

function editLogListeners(){
    const editLogBackButton_el = document.getElementById('editLogBackButton');
    const editLogCloseButton_el = document.getElementById('editLogCloseButton');
    const editTitleInput_el = document.getElementById('editTitleInput');
    const editDollarInput_el = document.getElementById('editDollarInput');
    const editDecimalInput_el = document.getElementById('editDecimalInput');
    const confirmEditLogButton_el = document.getElementById('confirmEditLogButton');

    const required = [editTitleInput_el, editDollarInput_el, editDecimalInput_el];

    console.log(selectedLog);

    editTitleInput_el.value = selectedLog.description;
    editDollarInput_el.value = selectedLog.value.split('.')[0];
    editDecimalInput_el.value = selectedLog.value.split('.')[1];

    editLogCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });

    editLogBackButton_el.addEventListener('click', () => {
        loadOverlayContent('overlays.html', '#viewLogContainer', viewLogListeners);
    });

    onlyNumbers(editDollarInput_el);
    onlyNumbers(editDecimalInput_el);
    maxCharacterInput(editDecimalInput_el, 2);

    confirmEditLogButton_el.addEventListener('click', async () => {
        let editError = false;
        required.forEach(element => {
            if (element.value === ''){
                editError = true;
                errorHandling(element);
            }
        });
        if (!editError){
            const newValue = `${editDollarInput_el.value}.${editDecimalInput_el.value}`;
            const result = await api.logHandler({request: 'edit', id: selectedLog.id, newDescription: editTitleInput_el.value, newValue})
            if (result){
                overlayContainer_el.style.display = 'none';
                await getLogContent();
            }    
        }
    });
}
