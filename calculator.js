class Calculator {
    constructor() {
        this.displayElemToCalculate = document.querySelector('.display');
        this.expressionElements = '';
        this.RPNExpression = [];
        this.operations = [];
        this.operationsElement = '';
        this.RPNElement = '';
        this.numbersForCalculations = [];
    }

    regex = {
        REGEX_FOR_WHITESPACES: /([^\d|.])/g,
        REGEX_FOR_NEGATIVE_NUMBER: /(\(|^)(\s+)(-)/g,
        REGEX_FOR_TWO_OPERATORS_IN_A_ROW: /(\+|-|\*|\/|√|\^|%)(\s+-\s)(\d+)/g,
        REGEX_FOR_SQUARE_ROOT: /(\d)(\s)(√)(-)/g,
        REGEX_FOR_DEGREE_AND_SQUARE_ROOT: /(\^\s+)(\d\s)?(√\s)(\d)?/g,
    };
    
    tokens = {
        ')': {
            type: 'bracket',
            priority: -1,
        },
        '(': {
            type: 'bracket',
            priority: 1,
        },
        '+': {
            type: 'operator',
            priority: 2,
            parameters: 2,
            calc: (a, b) => (+a + +b).toFixed(1)
        },
        "-": {
            type: 'operator',
            priority: 2,
            parameters: 2,
            calc: (a, b) => (a - b).toFixed(1)
        },
        "*": {
            type: 'operator',
            priority: 3,
            parameters: 2,
            calc: (a, b) => a * b
        },
        "/": {
            type: 'operator',
            priority: 3,
            parameters: 2,
            calc: (a, b) => a / b
        },
        "%": {
            type: 'operator',
            priority: 3,
            parameters: 2,
            calc: (a, b) => a % b
        },
        "√": {
            type: 'operator',
            priority: 4,
            parameters: 1,
            calc: (b) => Math.sqrt(b)
        },
        "^": {
            type: 'operator',
            priority: 4,
            parameters: 2,
            calc: (a, b) => Math.pow(a, b)
        },
    };
    
    getResult() {
        this.getExpressionElements();
        this.getRPN();
        this.calculate();
    }

    getExpressionElements() {
        this.expressionElements = this.displayElemToCalculate.innerText.replace(this.regex.REGEX_FOR_WHITESPACES, ' $1 ')
            .replace(this.regex.REGEX_FOR_NEGATIVE_NUMBER, '$1 -1 *')
            .replace(this.regex.REGEX_FOR_TWO_OPERATORS_IN_A_ROW, '$1 -$3 ')
            .replace(this.regex.REGEX_FOR_SQUARE_ROOT, '√ $1')
            .replace(this.regex.REGEX_FOR_DEGREE_AND_SQUARE_ROOT, '$1( $2$3$4 )')
            .split(' ').filter(element => element);
    }

    getRPN() {
        this.expressionElements.forEach(element => {
            if (/\d/.test(element)) {
                this.RPNExpression.push(element);
                return;
            }
            
            switch(this.tokens[element].type) {
            case 'bracket':
                if (element === '(') {
                    this.operations.push(element);
                } else {
                    this.operationsElement = this.operations.pop();
                    
                    while(this.tokens[this.operationsElement].priority > 1) {
                        this.RPNExpression.push(this.operationsElement);
                        
                        if (this.operations.length !== 0) {
                            this.operationsElement = this.operations.pop();
                        } else {
                            break;
                        }
                    }
                }
                break;
            case 'operator':
                if (this.operations.length === 0) {
                    this.operations.push(element);
                    return;
                }
                    
                this.operationsElement = this.operations.pop();
                    
                if (this.tokens[this.operationsElement].priority < this.tokens[element].priority) {
                    this.operations.push(this.operationsElement);
                    this.operations.push(element);
                    return;
                } 
                    
                while (this.tokens[this.operationsElement].priority >= this.tokens[element].priority) {
                    this.RPNExpression.push(this.operationsElement);

                    if (this.operations.length !== 0) {
                        this.operationsElement = this.operations.pop();
                    } else {
                        this.operationsElement = '';
                        break;
                    }
                }
                    
                if (this.operationsElement) this.operations.push(this.operationsElement);
                    
                this.operations.push(element);
                break;
            default:
                break;
            }
        });

        while(this.operations.length > 0) {
            this.operationsElement = this.operations.pop();
            this.RPNExpression.push(this.operationsElement);
        }
    }

    calculate() {
        while(this.RPNExpression.length !== 0) {
            this.RPNElement = this.RPNExpression.shift();
            
            if (/\d/.test(this.RPNElement)) {
                this.numbersForCalculations.push(this.RPNElement);
            } else {
                const secondNumber = this.numbersForCalculations.pop();
                
                if(this.tokens[this.RPNElement].parameters === 2) {
                    const firstNumber = this.numbersForCalculations.pop();
                        
                    if (this.RPNElement === '/' && secondNumber === '0') {
                        return this.displayElemToCalculate.innerText = 'Error';
                    }

                    let result = this.tokens[this.RPNElement].calc(firstNumber, secondNumber);
                    
                    if (result.slice(-2) === '.0') result = Math.trunc(result);
                    
                    this.numbersForCalculations.push(result);
                } else {
                    if(this.RPNElement === '√' && secondNumber < 0) {
                        return this.displayElemToCalculate = 'Error';
                    }
                    
                    const result = this.tokens[this.RPNElement].calc(secondNumber);
                    
                    this.numbersForCalculations.push(result);
                }
            }
        }

        
        this.displayElemToCalculate.innerText = this.numbersForCalculations.pop();
    }
}