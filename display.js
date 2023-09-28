class Display {
    constructor() {
        this.displayElem = document.querySelector('.display');
        this.state = ['open', 'number'];
    }

    action = ['+', '-', '/', '*', '^', '√', '%', 'x % y', 'x ^ y'];
    
    inputNumber(e) {
        if (this.getDisplay().length > 56) {
            return;
        }
        
        if (this.getDisplay() === '0'
            && this.action.includes(e.target.innerText)
            && e.target.innerText !== '√') {
            this.setDisplay(this.getDisplay() + e.target.innerText);
            return;
        }
        
        if (this.action.includes(this.getDisplay().slice(-1))
            && e.target.innerText === '.'
            || this.getDisplay().slice(-1) === '('
            && e.target.innerText === '.') {
            this.setDisplay(this.getDisplay() + '0' + e.target.innerText);
            return;
        }
        
        if (this.getDisplay() === '0'
            && e.target.innerText !== '.'
            && e.target.innerText !== '=') {
            this.setDisplay(e.target.innerText);
            return;
        }
        
        if (/[a-z]/.test(this.getDisplay())) {
            this.setDisplay(e.target.innerText);
            return;
        }
        
        this.setDisplay(this.getDisplay() + e.target.innerText);
    }

    stateHandlers = {
        'open': ['(', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '√'],
        'close': [')', '+', '-', '*', '/', 'x ^ y', 'x % y', '√'],
        'number': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '+', '*', '/', 'x ^ y', 'x % y', '√', ')'],
        'operation': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '(', '-', '√']
    };
    
    stateMap = {
        '(': ['open'],
        '-': ['open', 'operation'],
        '+': ['open', 'operation'],
        '*': ['open', 'operation'],
        '/': ['open', 'operation'],
        'x ^ y': ['open', 'operation'],
        'x % y': ['open', 'operation'],
        '√': ['open', 'operation'],
        '0': ['number'],
        '1': ['number'],
        '2': ['number'],
        '3': ['number'],
        '4': ['number'],
        '5': ['number'],
        '6': ['number'],
        '7': ['number'],
        '8': ['number'],
        '9': ['number'],
        '.': ['number'],
        ')': ['close'],
    };

    findError(e) {
        const displayText = this.getDisplay();

        if (e.target.innerText === 'AC' || e.target.innerText === 'C') {
            return;
        }

        if (!this.getState().map(element => this.stateHandlers[element].includes(e.target.innerText)).includes(true)
            && e.target.innerText !== '=') {
            this.setDisplay('Error');
            return;
        }

        if (e.target.innerText === '='
            && /a-z/.test(displayText)) {
            this.setDisplay('Error');
            return;
        }

        if (e.target.innerText === '='
            && this.getState() !== Array.from(...'close')
            && this.getState() !== Array.from(...'number')) {
            this.setDisplay('Error');
            return;
        }

        if (e.target.innerText === '='
            && /\(/.test(displayText)) {
            if (displayText.match(/\(/g).length !== displayText.match(/\)/g).length) this.setDisplay('Error');
            return;
        }

        if (e.target.innerText === '=') {
            this.setState('number');
            return;
        }

        this.setState(this.stateMap[e.target.innerText]);
    }

    inputButtonExpression(e) {
        switch (e.target.innerText) {
        case 'x % y':
            this.setDisplay(this.getDisplay().substring(0, this.getDisplay().length - 5) + '%');
            break;
        case 'x ^ y':
            this.setDisplay(this.getDisplay().substring(0, this.getDisplay().length - 5) + '^');
            break;
        default:
            break;
        }
    }

    inputSpecialSign(e) {
        switch (e.target.innerText) {
        case 'AC':
            this.clearAll();
            break;
        case 'C':
            this.clearLastSign();
            break;
        case '=':
            this.setDisplay(this.getDisplay().substring(0, this.getDisplay().length - 1));
            break;
        default:
            break;
        }
    }

    clearAll() {
        this.setDisplay('0');
    }

    clearLastSign() {
        this.setDisplay(this.getDisplay().substring(0, this.getDisplay().length - 1));
        
        if (this.getDisplay() === '0' || this.getDisplay().length === 1) {
            this.setDisplay('0');
        } else {
            this.setDisplay(this.getDisplay().substring(0, this.getDisplay().length - 1));
            
            if (this.getDisplay().length === 0) {
                this.setDisplay('0');
            }
        }
    }

    setDisplay(text) {
        this.displayElem.innerText = text;
    }

    getDisplay() {
        return this.displayElem.innerText;
    }

    setState(state) {
        return this.state = state;
    }
 
    getState() {
        return this.state;
    }
}