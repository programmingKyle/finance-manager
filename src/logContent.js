const logContent_el = document.getElementById('logContent');

let recentLog;

async function getLogContent(){
    recentLog = await api.logHandler({request: 'view', projectID: currentProjectID});
}
