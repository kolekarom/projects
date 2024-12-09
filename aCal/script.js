let displayValue = '0';

function updateDisplay() {
  document.getElementById('result').innerText = displayValue;
}

function clearDisplay() {
  displayValue = '0';
  updateDisplay();
}

function appendNumber(number) {
  if (displayValue === '0') {
    displayValue = number.toString();
  } else {
    displayValue += number;
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (operator === '+/-') {
    displayValue = (parseFloat(displayValue) * -1).toString();
  } else if (operator === '%' && !isNaN(displayValue)) {
    displayValue = (parseFloat(displayValue) / 100).toString();
  } else {
    displayValue += ` ${operator} `;
  }
  updateDisplay();
}

function calculate() {
  try {
    displayValue = eval(displayValue.replace('×', '*').replace('÷', '/')).toString();
  } catch {
    displayValue = 'Error';
  }
  updateDisplay();
}
