const logContent_el = document.getElementById('logContent');

let recentLog;

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

        toggleViewOverlay(itemDiv_el, element);

        itemDiv_el.append(itemTitle_el, itemDate_el, itemValue_el);

        logContent_el.append(itemDiv_el);
    });
}

function toggleViewOverlay(item, data){
    item.addEventListener('click', () => {
        overlayContainer_el.style.display = 'flex';
        loadOverlayContent('overlays.html', '#viewLogContainer', () => viewLogListeners(data));
    })
}

async function viewLogListeners(data){
    const viewLogCloseButton_el = document.getElementById('viewLogCloseButton');
    const viewLogTitle_el = document.getElementById('viewLogTitle');
    const viewLogDate_el = document.getElementById('viewLogDate');
    const viewLogValue_el = document.getElementById('viewLogValue');
    const editLogButton_el = document.getElementById('editLogButton');
    const deleteLogButton_el = document.getElementById('deleteLogButton');

    console.log(data);

    viewLogCloseButton_el.addEventListener('click', () => {
        overlayContainer_el.style.display = 'none';
    });
}