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

function maxCharacterInput(input, length){
    input.addEventListener('input', () => {
        if (input.value.length > length){
            input.value = input.value.slice(0, length);
            errorHandling(input);
        }
    });
}

function onlyNumbers(input){
    input.addEventListener('input', (event) => {
        const filteredValue = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = filteredValue;
    })
}