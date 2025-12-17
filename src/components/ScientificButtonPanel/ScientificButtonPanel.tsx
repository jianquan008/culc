import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  executeScientificFunction, 
  insertConstant, 
  memoryStore, 
  memoryRecall, 
  memoryAdd, 
  memorySubtract, 
  memoryClear 
} from '../../store/slices/calculatorSlice';
import { Button } from '../Button/Button';
import './ScientificButtonPanel.css';

export const ScientificButtonPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { display } = useSelector((state: RootState) => state.calculator);

  const handleFunctionClick = (func: string) => {
    const currentValue = parseFloat(display);
    dispatch(executeScientificFunction({ func, value: currentValue }));
  };

  const handleConstantClick = (constant: string) => {
    dispatch(insertConstant(constant));
  };

  const handleMemoryClick = (operation: string) => {
    const currentValue = parseFloat(display);
    switch (operation) {
      case 'MS':
        dispatch(memoryStore({ value: currentValue }));
        break;
      case 'MR':
        dispatch(memoryRecall({}));
        break;
      case 'M+':
        dispatch(memoryAdd({ value: currentValue }));
        break;
      case 'M-':
        dispatch(memorySubtract({ value: currentValue }));
        break;
      case 'MC':
        dispatch(memoryClear({}));
        break;
    }
  };

  return (
    <div className="scientific-button-panel">
      {/* Memory Functions */}
      <div className="function-row">
        <Button value="MC" type="function" onClick={() => handleMemoryClick('MC')} />
        <Button value="MR" type="function" onClick={() => handleMemoryClick('MR')} />
        <Button value="M+" type="function" onClick={() => handleMemoryClick('M+')} />
        <Button value="M-" type="function" onClick={() => handleMemoryClick('M-')} />
        <Button value="MS" type="function" onClick={() => handleMemoryClick('MS')} />
      </div>

      {/* Trigonometric Functions */}
      <div className="function-row">
        <Button value="sin" type="function" onClick={() => handleFunctionClick('sin')} />
        <Button value="cos" type="function" onClick={() => handleFunctionClick('cos')} />
        <Button value="tan" type="function" onClick={() => handleFunctionClick('tan')} />
        <Button value="ln" type="function" onClick={() => handleFunctionClick('ln')} />
        <Button value="log" type="function" onClick={() => handleFunctionClick('log')} />
      </div>

      {/* Inverse Trigonometric Functions */}
      <div className="function-row">
        <Button value="sin⁻¹" type="function" onClick={() => handleFunctionClick('asin')} />
        <Button value="cos⁻¹" type="function" onClick={() => handleFunctionClick('acos')} />
        <Button value="tan⁻¹" type="function" onClick={() => handleFunctionClick('atan')} />
        <Button value="eˣ" type="function" onClick={() => handleFunctionClick('exp')} />
        <Button value="10ˣ" type="function" onClick={() => handleFunctionClick('pow10')} />
      </div>

      {/* Constants and Powers */}
      <div className="function-row">
        <Button value="π" type="function" onClick={() => handleConstantClick('PI')} />
        <Button value="e" type="function" onClick={() => handleConstantClick('E')} />
        <Button value="x²" type="function" onClick={() => handleFunctionClick('square')} />
        <Button value="√x" type="function" onClick={() => handleFunctionClick('sqrt')} />
        <Button value="x!" type="function" onClick={() => handleFunctionClick('factorial')} />
      </div>

      {/* Additional Functions */}
      <div className="function-row">
        <Button value="1/x" type="function" onClick={() => handleFunctionClick('reciprocal')} />
        <Button value="|x|" type="function" onClick={() => handleFunctionClick('absolute')} />
        <Button value="%" type="function" onClick={() => handleFunctionClick('percentage')} />
        <Button value="xʸ" type="function" onClick={() => handleFunctionClick('power')} />
        <Button value="³√x" type="function" onClick={() => handleFunctionClick('cbrt')} />
      </div>
    </div>
  );
};
