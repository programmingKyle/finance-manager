const overlayContainer_el = document.getElementById('overlayContainer');

let updateControlDiv_el;
let downloadingText_el;
let pleaseWaitText_el;

autoUpdater.autoUpdaterCallback((status) => {
    if (status === 'Update Available'){
        overlayContainer_el.style.display = 'flex';
        loadOverlayContent('overlays.html', '#updateContainer', autoUpdaterListeners);
    }
    if (status === 'Update Downloaded'){
        downloadingText_el.textContent = 'Download Complete';
        pleaseWaitText_el.style.display = 'none';
        updateControlDiv_el.style.display = 'grid';
    }
});

// This function is used for the Auto Update overlay
function autoUpdaterListeners(){
    startUpdateButton_el = document.getElementById('startUpdateButton');
    quitUpdateButton_el = document.getElementById('quitUpdateButton');
    updateControlDiv_el = document.getElementById('updateControlDiv');
    downloadingText_el = document.getElementById('downloadingText');
    pleaseWaitText_el = document.getElementById('pleaseWaitText');


    startUpdateButton_el.addEventListener('click', () => {
        autoUpdater.restartAndUpdate();
    });
    
    quitUpdateButton_el.addEventListener('click', () => {
        autoUpdater.closeApp();
    });
}