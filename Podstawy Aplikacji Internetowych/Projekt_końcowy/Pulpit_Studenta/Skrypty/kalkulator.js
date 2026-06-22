let calcHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

function append(val) {
    document.getElementById('calc-display').value += val;
}

function clearCalc() {
    document.getElementById('calc-display').value = '';
}

function updateHistory(result) {
    calcHistory.unshift(result);
    if (calcHistory.length > 10) calcHistory.pop();
    localStorage.setItem('calcHistory', JSON.stringify(calcHistory));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('calc-history');
    list.innerHTML = calcHistory.map(item => `<li class="list-group-item bg-transparent py-1">${item}</li>`).join('');
}

function calculate() {
    const display = document.getElementById('calc-display');
    try {
        const result = eval(display.value);
        updateHistory(`${display.value} = ${result}`);
        display.value = result;
    } catch {
        display.value = 'Błąd';
    }
}

function calcSqrt() {
    const display = document.getElementById('calc-display');
    const result = Math.sqrt(parseFloat(display.value) || 0);
    updateHistory(`√(${display.value}) = ${result}`);
    display.value = result;
}

document.addEventListener('DOMContentLoaded', renderHistory);