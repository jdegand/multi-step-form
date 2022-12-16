const form = document.getElementById('form');
const formSteps = [...form.getElementsByClassName('step')];
const prevBtns = form.querySelectorAll('[data-prev]');
const nextBtns = form.querySelectorAll('[data-next]');
const numbers = document.getElementsByClassName('step-number')
const toggle = document.getElementById('toggle')
const yearlyPrices = form.querySelectorAll('.yearly');
const discounts = form.querySelectorAll('.yearly-2');
const monthlyPrices = form.querySelectorAll('.monthly');

let step = 0;

toggle.addEventListener('change', ()=> {
    const monthlyText = form.querySelector('.step-2-toggle-monthly-text');
    const yearlyText = form.querySelector('.step-2-toggle-yearly-text');
    const yearlySavings = form.querySelectorAll('.yearly-savings');

    if(toggle.checked){
        monthlyPrices.forEach(el => el.classList.add('hide'))
        yearlyPrices.forEach(el => el.classList.add('active'))
        discounts.forEach(el => el.classList.add('active'))
        yearlyText.classList.add('marine')
        monthlyText.classList.remove('marine')
        yearlySavings.forEach(el => el.classList.add('active'))
    } else {
        monthlyPrices.forEach(el => el.classList.remove('hide'))
        yearlyPrices.forEach(el => el.classList.remove('active'))
        discounts.forEach(el => el.classList.remove('active'))
        yearlyText.classList.remove('marine')
        monthlyText.classList.add('marine')
        yearlySavings.forEach(el => el.classList.remove('active'))
    }
})

const costMap = {
    "arcade": 9,
    "advanced": 12,
    "pro": 15,
    "online service": 1,
    "larger storage":  2,
    "customizable profile": 2 
}

prevBtns.forEach(button => {
    button.addEventListener('click', ()=> {
        if(step > 0 && step < 4){
            step -= 1;
            updateProgress();
            updateSteps();
            updateSummary();
        }
    })
})

nextBtns.forEach(button => {
    button.addEventListener('click', ()=> {
        const inputs = [...formSteps[step].querySelectorAll("input")]
        const allValid = inputs.every(input => input.reportValidity())
        if(step < 4 && allValid){
            step += 1;
            updateProgress();
            updateSteps();
            updateSummary();
        }
    })
})

function updateSteps(){
    formSteps.forEach(step => step.classList.remove('active'))
    formSteps[step].classList.add('active')
}

function updateProgress(){
    [...numbers].forEach(circle => {
        circle.classList.remove('fill')
    })

    numbers[step].classList.add('fill')
}

function updateSummary(){
   const plans = Array.from(document.getElementsByName('plan'));
   const addOns = Array.from(document.getElementsByName('addon'));
   const toggle = document.getElementById('toggle');

    deleteAllNodes('#step-4-table');
    addPlanToTable();
    addToTable();
    if(step === 3){
        addTotalRow();
    }
}

function change(){
    return step = 1;
}

form.addEventListener('submit', success);

function deleteAllNodes(str){
    let el = document.querySelector(str);
        
    //e.firstElementChild can be used.
    let child = el.lastElementChild; 
        while (child) {
            el.removeChild(child);
            child = el.lastElementChild;
        }
}

function success(e){
    e.preventDefault();
    deleteAllNodes(".form-container");
    const image = document.createElement('img');
    image.src = './assets/images/icon-thank-you.svg';
    image.alt = '';

    const heading = document.createElement('h1');
    heading.textContent = 'Thank you!';

    const paragraph = document.createElement('p');
    paragraph.textContent = "Thanks for confirming your subscription! We hope you have fun using our platform. If you ever need support, please feel free to email us at support@loremgaming.com.";

    const div = document.createElement('div');
    div.append(image, heading, paragraph);
    div.classList.add('thank-you-div');
    const formContainer = document.querySelector('.form-container');
    formContainer.append(div);
}

function addPlanToTable(){
    const table = document.getElementById('step-4-table');
    const plans = Array.from(document.getElementsByName('plan'));

    if(plans?.filter(el => el.checked).length){
        let planName = plans?.filter(el => el.checked)[0].value;
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        const cell2 = document.createElement('td');
        const div = document.createElement('div');
        const div2 = document.createElement('div');

        div.innerText = `${toggle.checked ? `${plans?.filter(el => el.checked)[0]?.value} (yearly) ` : `${plans?.filter(el => el.checked)[0]?.value} (monthly) `}`;
        div2.innerText = 'change';
        div2.classList.add('change');
        div2.addEventListener('click', ()=> {
            change()
            updateSteps()
        })
        cell.classList.add('titlecase');
        cell.classList.add('marine');
        cell.append(div, div2); 
        cell2.innerText = `${toggle.checked ? `$${costMap[planName]}0/yr` : `$${costMap[planName]}/mo`}`;
        cell2.setAttribute('class', 'plan-cost');
        cell2.setAttribute('data-plan', `${toggle.checked ? `${costMap[planName]}0` : `${costMap[planName]}`}`)
        row.append(cell, cell2);
        row.classList.add('magnolia');
        table.append(row);
    }
}

function addToTable(){
    const table = document.getElementById('step-4-table');
    const addOns = Array.from(document.getElementsByName('addon'));
    const selectedAddOns = addOns?.filter(el => el.checked);

    for(let i = 0; i < selectedAddOns.length; i++){
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        const cell2 = document.createElement('td');
        cell.innerText = selectedAddOns[i].value;
        cell.classList.add('titlecase');
        cell2.innerText = `+$${toggle.checked ? `${costMap[selectedAddOns[i].value]}0/yr`: `${costMap[selectedAddOns[i].value]}/mo`}`;
        cell2.setAttribute('class', 'addon-cost');
        cell2.setAttribute('data-addon', `${toggle.checked ? `${costMap[selectedAddOns[i].value]}0` : `${costMap[selectedAddOns[i].value]}`}`)
        
        row.append(cell, cell2);
        row.classList.add('magnolia');
        table.appendChild(row);
    }
}

function addTotalRow(){
    // this function has to be last function called in updateSummary
    // need to grab the elements added from prior functions to make total

    const planCost = parseInt(document.querySelector('.plan-cost')?.dataset.plan);

    const allAddOns = document.querySelectorAll('.addon-cost');
    const addOnsTotal = Array.from(allAddOns).reduce((acc, curr) => acc + parseInt(curr.dataset.addon), 0);
    
    const total =  planCost + addOnsTotal;

    const table = document.getElementById('step-4-table');
    const finalRow = document.createElement('tr');
    const cell3 = document.createElement('td');
    const cell4 = document.createElement('td');
    cell3.innerText = `${toggle.checked ? 'Total (yearly)' : 'Total (monthly)'}`;
    cell4.innerText = `${toggle.checked ? `$${total}/yr` : `$${total}/mo`}`;
    cell4.classList.add('purplish');
    finalRow.append(cell3, cell4);
    table.appendChild(finalRow);
}
