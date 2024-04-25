const descriptionInput_el = document.getElementById('descriptionInput');
const typeInput_el = document.getElementById('typeInput');
const inputDollar_el = document.getElementById('inputDollar');
const inputDecimal_el = document.getElementById('inputDecimal');
const inputSubmit_el = document.getElementById('inputSubmit');
const logSuccessText_el = document.getElementById('logSuccessText');

onlyNumbers(inputDollar_el);
onlyNumbers(inputDecimal_el);

const inputList = [descriptionInput_el, inputDollar_el, inputDecimal_el];

inputDecimal_el.addEventListener('input', () => {
    maxCharacterInput(inputDecimal_el, 2);
});

inputSubmit_el.addEventListener('click', async () => {
    let inputEmpty = false;
    inputList.forEach(element => {
        if (element.value === ''){
            inputEmpty = true;
            errorHandling(element);
        }
    });
    if (!inputEmpty){
        const formatValue = () => {
            const isNegative = typeInput_el.value === 'expense' ? '-' : '';
            const decimalValue = inputDecimal_el.value;
            const formatDecimal = decimalValue.length < 2 ? `${decimalValue}0` : decimalValue;
            const value = `${isNegative}${inputDollar_el.value}.${formatDecimal}`;
            return value;
        }
        const log = {
            projectID: currentProjectID,
            description: descriptionInput_el.value,
            type: typeInput_el.value,
            value: formatValue(),
        };
        const isSuccessful = api.logHandler({request: 'log', log});
        if (isSuccessful){
            clearInputs(inputList);
            logDisplay(inputSubmit_el, logSuccessText_el, 'Log Successful');
            getLogContent();
            await populateProjectViewGraphs();
        } else {
            logDisplay(inputSubmit_el, logSuccessText_el, 'Log Failed');
        }    
    }
});

function clearInputs(inputs){
    inputs.forEach(element => {
        element.value = '';
    });
}

function logDisplay(button, text, message){
    button.style.display = 'none';
    text.style.display = 'grid';
    text.textContent = message;
    setTimeout(() => {
        button.style.display = 'grid';
        text.style.display = 'none';
    }, 2000);
}