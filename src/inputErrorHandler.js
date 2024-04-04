function errorHandling(element){
    element.classList.add('error');
    errorTimeout(element);
}

function errorTimeout(element){
    setTimeout(() => {
        if (element.classList.contains('error')){
            element.classList.remove('error');
        }
    }, 1000);
}
