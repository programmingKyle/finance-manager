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
        console.log(input.value.length);
        if (input.value.length > length){
            input.value = input.value.slice(0, length);
            errorHandling(input);
        }
    });
}