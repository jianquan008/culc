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
      <Button value="AC" type="function" onClick={onFunctionClick} shortcut="Escape" />
      <Button value="C" type="function" onClick={onFunctionClick} />
      <Button value="" type="function" onClick={() => {}} />
      <Button value={OPERATORS.DIVIDE} type="operator" onClick={onOperatorClick} shortcut="/" />
      
      <Button value="7" type="number" onClick={onNumberClick} shortcut="7" />
      <Button value="8" type="number" onClick={onNumberClick} shortcut="8" />
      <Button value="9" type="number" onClick={onNumberClick} shortcut="9" />
      <Button value={OPERATORS.MULTIPLY} type="operator" onClick={onOperatorClick} shortcut="*" />
      
      <Button value="4" type="number" onClick={onNumberClick} shortcut="4" />
      <Button value="5" type="number" onClick={onNumberClick} shortcut="5" />
      <Button value="6" type="number" onClick={onNumberClick} shortcut="6" />
      <Button value={OPERATORS.SUBTRACT} type="operator" onClick={onOperatorClick} shortcut="-" />
      
      <Button value="1" type="number" onClick={onNumberClick} shortcut="1" />
      <Button value="2" type="number" onClick={onNumberClick} shortcut="2" />
      <Button value="3" type="number" onClick={onNumberClick} shortcut="3" />
      <Button value={OPERATORS.ADD} type="operator" onClick={onOperatorClick} shortcut="+" />
      
      <Button value="0" type="number" onClick={onNumberClick} shortcut="0" />
      <Button value="." type="number" onClick={onDecimalClick} shortcut="." />
      <Button value="" type="function" onClick={() => {}} />
      <Button value={FUNCTIONS.EQUALS} type="equals" onClick={onFunctionClick} shortcut="Enter" />
    </div>
  );
};
