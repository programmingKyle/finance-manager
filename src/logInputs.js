const descriptionInput_el = document.getElementById('descriptionInput');
const typeInput_el = document.getElementById('typeInput');
const inputDollar_el = document.getElementById('inputDollar');
const inputDecimal_el = document.getElementById('inputDecimal');
const inputSubmit_el = document.getElementById('inputSubmit');

// Going to need currencyText_el

inputDecimal_el.addEventListener('input', () => {
    maxCharacterInput(inputDecimal_el, 2);
});

inputSubmit_el.addEventListener('click', () => {
    if (descriptionInput_el.value === '' || inputDollar_el.value === '' || inputDecimal_el.value === ''){
        if (descriptionInput_el.value === ''){
            errorHandling(descriptionInput_el);
        }
        if (inputDollar_el.value === ''){
            errorHandling(inputDollar_el);
        }
        if (inputDecimal_el.value === ''){
            errorHandling(inputDecimal_el);
        }
        return;
    }
    const formatValue = () => {
        const isNegative = typeInput_el.value === 'expense' ? '-' : '';
        const value = `${isNegative}${inputDollar_el.value}.${inputDecimal_el.value}`;
        return value;
    }
    const log = {
        projectID: currentProjectID,
        description: descriptionInput_el.value,
        type: typeInput_el.value,
        value: formatValue(),
    };
    api.logHandler({request: 'log', log});
});