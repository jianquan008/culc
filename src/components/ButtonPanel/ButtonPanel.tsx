import React from 'react';
import { Button } from '../Button/Button';
import { OPERATORS, FUNCTIONS } from '../../constants/calculator';
import './ButtonPanel.css';

interface ButtonPanelProps {
  onNumberClick: (digit: string) => void;
  onOperatorClick: (operator: string) => void;
  onFunctionClick: (func: string) => void;
  onDecimalClick: () => void;
}

export const ButtonPanel: React.FC<ButtonPanelProps> = ({
  onNumberClick,
  onOperatorClick,
  onFunctionClick,
  onDecimalClick
}) => {
  return (
    <div className="button-panel">
      <Button value="AC" type="function" onClick={onFunctionClick} />
      <Button value="C" type="function" onClick={onFunctionClick} />
      <Button value="" type="function" onClick={() => {}} />
      <Button value={OPERATORS.DIVIDE} type="operator" onClick={onOperatorClick} />
      
      <Button value="7" type="number" onClick={onNumberClick} />
      <Button value="8" type="number" onClick={onNumberClick} />
      <Button value="9" type="number" onClick={onNumberClick} />
      <Button value={OPERATORS.MULTIPLY} type="operator" onClick={onOperatorClick} />
      
      <Button value="4" type="number" onClick={onNumberClick} />
      <Button value="5" type="number" onClick={onNumberClick} />
      <Button value="6" type="number" onClick={onNumberClick} />
      <Button value={OPERATORS.SUBTRACT} type="operator" onClick={onOperatorClick} />
      
      <Button value="1" type="number" onClick={onNumberClick} />
      <Button value="2" type="number" onClick={onNumberClick} />
      <Button value="3" type="number" onClick={onNumberClick} />
      <Button value={OPERATORS.ADD} type="operator" onClick={onOperatorClick} />
      
      <Button value="0" type="number" onClick={onNumberClick} />
      <Button value="." type="number" onClick={onDecimalClick} />
      <Button value="" type="function" onClick={() => {}} />
      <Button value={FUNCTIONS.EQUALS} type="equals" onClick={onFunctionClick} />
    </div>
  );
};
