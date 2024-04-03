function loadOverlayContent(url, contentSelector, listenerFunction) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            const selectedContent = tempContainer.querySelector(contentSelector);
            if (!selectedContent) {
                throw new Error('Specified content not found in the fetched HTML');
            }
            document.getElementById('overlayContainer').innerHTML = selectedContent.outerHTML;
            if (listenerFunction){
                listenerFunction();
            }
        })
        .catch(error => {
            console.error('Error loading overlay content:', error);
        });
}
