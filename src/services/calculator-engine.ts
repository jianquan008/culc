import Decimal from 'decimal.js';
import { CalculationResult, Token, CalculatorError } from '../types/calculator';
import { OPERATORS, OPERATOR_PRECEDENCE } from '../constants/calculator';

export class CalculatorEngine {
  calculate(expression: string): CalculationResult {
    try {
      const tokens = this.tokenize(expression);
      if (!this.validateExpression(tokens)) {
        return this.createErrorResult(CalculatorError.INVALID_EXPRESSION);
      }
      
      const result = this.evaluate(tokens);
      return {
        value: result,
        formatted: this.formatResult(result),
        isError: false
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('division by zero')) {
        return this.createErrorResult(CalculatorError.DIVISION_BY_ZERO);
      }
      return this.createErrorResult(CalculatorError.INVALID_EXPRESSION);
    }
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let current = '';
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      
      if (this.isDigit(char) || char === '.') {
        current += char;
      } else if (this.isOperator(char)) {
        if (current) {
          tokens.push({ type: 'number', value: parseFloat(current) });
          current = '';
        }
        // 标准化运算符
        let normalizedOperator = char;
        if (char === '*') normalizedOperator = OPERATORS.MULTIPLY;
        if (char === '/') normalizedOperator = OPERATORS.DIVIDE;
        
        tokens.push({ 
          type: 'operator', 
          value: normalizedOperator, 
          precedence: OPERATOR_PRECEDENCE[normalizedOperator as keyof typeof OPERATOR_PRECEDENCE] 
        });
      }
    }
    
    if (current) {
      tokens.push({ type: 'number', value: parseFloat(current) });
    }
    
    return tokens;
  }

  private evaluate(tokens: Token[]): number {
    const values: Decimal[] = [];
    const operators: Token[] = [];
    
    for (const token of tokens) {
      if (token.type === 'number') {
        values.push(new Decimal(token.value as number));
      } else if (token.type === 'operator') {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].precedence! >= token.precedence!
        ) {
          this.executeOperation(values, operators.pop()!);
        }
        operators.push(token);
      }
    }
    
    while (operators.length > 0) {
      this.executeOperation(values, operators.pop()!);
    }
    
    return values[0].toNumber();
  }

  private executeOperation(values: Decimal[], operator: Token): void {
    const b = values.pop()!;
    const a = values.pop()!;
    
    switch (operator.value) {
      case OPERATORS.ADD:
        values.push(a.plus(b));
        break;
      case OPERATORS.SUBTRACT:
        values.push(a.minus(b));
        break;
      case OPERATORS.MULTIPLY:
        values.push(a.times(b));
        break;
      case OPERATORS.DIVIDE:
        if (b.isZero()) {
          throw new Error('division by zero');
        }
        values.push(a.dividedBy(b));
        break;
    }
  }

  formatResult(value: number): string {
    if (Math.abs(value) >= 1e12 || (Math.abs(value) < 1e-6 && value !== 0)) {
      return value.toExponential(6);
    }
    return new Decimal(value).toFixed();
  }

  private validateExpression(tokens: Token[]): boolean {
    if (tokens.length === 0) return false;
    
    let expectOperand = true;
    for (const token of tokens) {
      if (expectOperand && token.type !== 'number') return false;
      if (!expectOperand && token.type !== 'operator') return false;
      expectOperand = !expectOperand;
    }
    
    return !expectOperand;
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isOperator(char: string): boolean {
    return Object.values(OPERATORS).includes(char as any) || char === '*' || char === '/';
  }

  private createErrorResult(error: CalculatorError): CalculationResult {
    return {
      value: 0,
      formatted: 'Error',
      isError: true,
      errorMessage: this.getErrorMessage(error)
    };
  }

  private getErrorMessage(error: CalculatorError): string {
    switch (error) {
      case CalculatorError.DIVISION_BY_ZERO:
        return 'Cannot divide by zero';
      case CalculatorError.NUMBER_OVERFLOW:
        return 'Number too large';
      default:
        return 'Invalid operation';
    }
  }
}
