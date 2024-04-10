const descriptionInput_el = document.getElementById('descriptionInput');
const typeInput_el = document.getElementById('typeInput');
const inputDollar_el = document.getElementById('inputDollar');
const inputDecimal_el = document.getElementById('inputDecimal');
const inputSubmit_el = document.getElementById('inputSubmit');

// Going to need currencyText_el

inputDecimal_el.addEventListener('input', () => {
    maxCharacterInput(inputDecimal_el, 2);
})