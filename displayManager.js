class DisplayManager {
    constructor() {
        this.initializeClasses();
        this.manageInputNumber();
        this.manageInputSpecialSign();
        this.manageInputButtonExpression();
        this.manageFindError();
        this.manageGetResult();
    }
    
    initializeClasses() {
        this.display = new Display();
        this.calculator = new Calculator();
    }

    manageInputNumber() {
        const keyboard = Array.from(document.querySelectorAll('button'));
        
        keyboard.map((button) => {
            button.addEventListener(
                'click',
                this.display.inputNumber.bind(this.display)
            );
        });
    }
    
    manageFindError() {
        const keyboard = Array.from(document.querySelectorAll('button'));
        
        keyboard.map((button) => {
            button.addEventListener(
                'click',
                this.display.findError.bind(this.display)
            );
        });
    }
    
    manageInputSpecialSign() {
        const specialSignButtons = Array.from(document.querySelectorAll('button.spec_sign'));
        
        specialSignButtons.map((button) => {
            button.addEventListener(
                'click',
                this.display.inputSpecialSign.bind(this.display)
            );
        });
    }
    
    manageInputButtonExpression() {
        const buttonExpression = Array.from(document.querySelectorAll(('button.button__expression')));
        
        buttonExpression.map((button) => {
            button.addEventListener(
                'click',
                this.display.inputButtonExpression.bind(this.display)
            );
        });
    }
    
    manageGetResult() {
        const result = document.querySelector('button.result');
        
        result.addEventListener(
            'click',
            this.calculator.getResult.bind(this.calculator)
        );
    }
}

const displayManager = new DisplayManager();