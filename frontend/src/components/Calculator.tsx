import React, { useState } from 'react';
import axios from 'axios';

const Calculator: React.FC = () => {
  const [currentOperand, setCurrentOperand] = useState('');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState<string | undefined>();

  const appendNumber = (number: string) => {
    if (number === '.' && currentOperand.includes('.')) return;
    setCurrentOperand(currentOperand + number);
  };

  const chooseOperation = (op: string) => {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('');
  };

  const compute = async () => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current) || !operation) return; // Kiểm tra operation
  
    try {
      const response = await axios.post('http://localhost:8000/calculate', {
        num1: prev,
        num2: current,
        operation: operation 
      });
      setCurrentOperand(response.data.result.toString());
      setOperation(undefined);
      setPreviousOperand('');
    } catch (error) {
      console.error("Error:", error); // Ghi lại lỗi
      setCurrentOperand('Error');
    }
  };
  

  const clear = () => {
    setCurrentOperand('');
    setPreviousOperand('');
    setOperation(undefined);
  };

  const deleteNumber = () => {
    setCurrentOperand(currentOperand.slice(0, -1));
  };

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button onClick={clear} className="span-two">AC</button>
      <button onClick={deleteNumber}>DEL</button>
      {['+', '-', '*', '/'].map((op) => (
        <button key={op} onClick={() => chooseOperation(op)}>{op}</button>
      ))}
      {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'].map((num) => (
        <button key={num} onClick={() => appendNumber(num.toString())}>{num}</button>
      ))}
      <button onClick={compute} className="span-two">=</button>
    </div>
  );
};

export default Calculator;