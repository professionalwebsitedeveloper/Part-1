import { useState, useEffect } from 'react'
import './App.css'

function Button({ label, onClick, className = '' }) {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
}


function Display({ value, expression }) {
  return (
    <div className="display">{expression || value}</div>
  );
}


function ButtonGrid({ buttons, onNumberClick, onOperationClick, onEqualsClick, onClearClick, onDecimalClick }) {
  return (
    <div className="buttons">
      {buttons.map((button, index) => {
        let onClick;
        if (button.type === 'number') {
          onClick = () => onNumberClick(button.label);
        } else if (button.type === 'operation') {
          onClick = () => onOperationClick(button.label);
        } else if (button.type === 'equals') {
          onClick = onEqualsClick;
        } else if (button.type === 'clear') {
          onClick = onClearClick;
        } else if (button.type === 'decimal') {
          onClick = onDecimalClick;
        }
        return (
          <Button
            key={index}
            label={button.label}
            onClick={onClick}
            className={button.className}
          />
        );
      })}
    </div>
  );
}

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [expression, setExpression] = useState('');
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  
  const buttonConfig = [
    { label: '7', type: 'number' },
    { label: '8', type: 'number' },
    { label: '9', type: 'number' },
    { label: '/', type: 'operation', className: 'operator' },
    { label: '4', type: 'number' },
    { label: '5', type: 'number' },
    { label: '6', type: 'number' },
    { label: 'x', type: 'operation', className: 'operator' },
    { label: '1', type: 'number' },
    { label: '2', type: 'number' },
    { label: '3', type: 'number' },
    { label: '-', type: 'operation', className: 'operator' },
    { label: '0', type: 'number', className: 'zero' },
    { label: '.', type: 'decimal' },
    { label: '+', type: 'operation', className: 'operator' },
    { label: '=', type: 'equals', className: 'equals' },
    { label: 'C', type: 'clear', className: 'clear' },
  ];

  useEffect(() => {
    if (expression && !expression.endsWith(' ') && !expression.endsWith('=')) {
      try {
        const evalExpression = expression.replace(/x/g, '*');
        const result = new Function('return ' + evalExpression)();
        if (!isNaN(result) && isFinite(result)) {
          setDisplay(result.toString());
        }
      } catch (error) {
        setDisplay('Error');
      }
    }
  }, [expression]);

  const handleNumber = (num) => {
    if (waitingForNewNumber) {
      setDisplay(num);
      setExpression(prev => prev + num);
      setWaitingForNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setExpression(prev => prev + num);
    }
  };

  const handleOperation = (op) => {
    if (op === 'x') {
      const lastChar = expression.slice(-1);
      if (['+', '-', 'x', '/'].includes(lastChar)) {
        setExpression(prev => prev.slice(0, -1) + ' x ');
      } else {
        setExpression(prev => prev + ' x ');
      }
    } else {
      const lastChar = expression.slice(-1);
      if (['+', '-', 'x', '/'].includes(lastChar)) {
        setExpression(prev => prev.slice(0, -1) + ' ' + op + ' ');
      } else {
        setExpression(prev => prev + ' ' + op + ' ');
      }
    }
    setWaitingForNewNumber(true);
  };

  const handleEquals = () => {
    if (expression) {
      try {
        const evalExpression = expression.replace(/x/g, '*');
        const result = new Function('return ' + evalExpression)();
        if (!isNaN(result) && isFinite(result)) {
          setDisplay(result.toString());
          setExpression(expression + ' = ' + result);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        setDisplay('Error');
      }
    }
    setWaitingForNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setExpression('');
    setWaitingForNewNumber(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      if (waitingForNewNumber) {
        setDisplay('0.');
        setExpression(prev => prev + '0.');
        setWaitingForNewNumber(false);
      } else {
        setDisplay(display + '.');
        setExpression(prev => prev + '.');
      }
    }
  };

  return (
    <div className="calculator">
      <Display value={display} expression={expression} />
      <ButtonGrid
        buttons={buttonConfig}
        onNumberClick={handleNumber}
        onOperationClick={handleOperation}
        onEqualsClick={handleEquals}
        onClearClick={handleClear}
        onDecimalClick={handleDecimal}
      />
    </div>
  );
}

export default App;