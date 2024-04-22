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

        viewLogListener(itemDiv_el, element);

        itemDiv_el.append(itemTitle_el, itemDate_el, itemValue_el);

        logContent_el.append(itemDiv_el);
    });
}

function viewLogListener(log, data){
    log.addEventListener('click', () => {
        console.log(data);
    })
}