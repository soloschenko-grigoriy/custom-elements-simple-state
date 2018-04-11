class XForm extends HTMLElement {
    constructor(){
        super();
    }

    /**
     * This callback is called by browser automatically when element attached to DOM
     * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
     */
    connectedCallback(){
        this.render()
    }

    /**
     * This is a reducer for our state
     * Inspired by Redux https://redux.js.org/
     * 
     * @param {Mixed Array} state 
     * @param {Object} action 
     * 
     * @returns {Mixed Array} state
     */
    reducer(state = [], action){
        switch(action.type){
            case 'ADD':
                return [...state, action.value];
            case 'REMOVE':
                return state.slice(0, action.value).concat(state.slice(action.value + 1));
            default:
                return state
        }
    }

    /**
     * General Event Listeners
     */
    addListeners(){
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.input.addEventListener('keydown', this.clearErrors.bind(this));
    }

    /**
     * When our form was submitted
     * 
     * @param {Event} e 
     */
    onSubmit(e){
        e.preventDefault();

        this.clearErrors();

        const value = this.input.value
        if(!value){
            this.classList.add('hasError');

            return;
        }

        this.input.value = '';

        this.createItem(value);
    }

    /**
     * Created UI element for item and updates the state
     * 
     * @param {String} value 
     */
    createItem(value){
        const li = document.createElement('li');
        
        li.innerHTML = `
            <span></span>
            <a href="#">Delete</a>
        `;

        // oh my!! it's XSS prevention!
        li.querySelector('span').innerText = value;

        this.list.appendChild(li);

        // Update state
        this.state = this.reducer(this.state, { type: 'ADD', value: value });

        li.querySelector('a').addEventListener('click', () => this.removeItem(li, this.state.length - 1));

        console.log('Current state: ', this.state);
    }

    /**
     * Removes UI element for item and updates the state
     * 
     * @param {HTMLElement} li 
     * @param {Number} index
     */
    removeItem(li, index){
        li.parentNode.removeChild(li);

        // Update state
        this.state = this.reducer(this.state, { type: 'REMOVE', value: index });

        console.log('Current state: ', this.state);
    }

    /**
     * Clean all errors
     */
    clearErrors(){
        this.classList.remove('hasError')
    }

    /**
     * Well... finally render the element and make general preparations
     */
    render(){
        this.innerHTML = `
            <form novalidate>
                <p>
                    <input type="email" placeholder="Enter email address">
                    <small>Type email address and hin enter</small>
                </p>
                
                <ul></ul>
            </form>
        `;

        // Defining a meaningful properties + caching
        this.form = this.querySelector('form');
        this.input = this.querySelector('input');
        this.list = this.querySelector('ul');

        this.addListeners();
    }
}

customElements.define('x-form', XForm);