// script.js
const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

let currentInput = '';
let operator = null;
let firstOperand = null;
let secondOperand = false;

keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.classList[0];
    const keyContent = key.textContent;
    const displayedNum = display.value;

    if (action === 'number') {
      if (secondOperand) {
        display.value = keyContent;
        secondOperand = false;
      } else {
        display.value = displayedNum === '0' ? keyContent : displayedNum + keyContent;
      }
    }

    if (action === 'decimal') {
      if (!displayedNum.includes('.')) {
        display.value = displayedNum + '.';
      }
    }

    if (action === 'operator') {
      const value = key.dataset.operator;

      if (operator && secondOperand) {
        operator = value;
        return;
      }

      if (!firstOperand) {
        firstOperand = parseFloat(displayedNum);
      } else if (operator) {
        const result = calculate(firstOperand, parseFloat(displayedNum), operator);
        display.value = result;
        firstOperand = result;
      }

      operator = value;
      secondOperand = true;
    }

    if (action === 'equal') {
      if (operator && !secondOperand) {
        const result = calculate(firstOperand, parseFloat(displayedNum), operator);
        display.value = result;
        firstOperand = null;
        operator = null;
        secondOperand = false;
      }
    }

    if (action === 'clear') {
      display.value = '';
      firstOperand = null;
      operator = null;
      secondOperand = false;
    }
  }
});

function calculate(first, second, op) {
  if (op === '+') return first + second;
  if (op === '-') return first - second;
  if (op === '*') return first * second;
  if (op === '/') return second === 0 ? 'Error' : first / second;
  return second;
}