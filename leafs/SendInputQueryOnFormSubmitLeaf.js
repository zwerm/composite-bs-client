const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that sends the value of an `HTMLInputElement`
 * when an `HTMLFormElement` is submitted.
 *
 * @extends {BSClientLeaf}
 */
class SendInputQueryOnFormSubmitLeaf extends BSClientLeaf {
    /**
     *
     * @param {HTMLFormElement} formElement
     * @param {HTMLInputElement} inputElement
     */
    constructor(formElement, inputElement) {
        super();

        /**
         *
         * @type {HTMLFormElement}
         * @private
         */
        this._formElement = formElement;
        /**
         *
         * @type {HTMLInputElement}
         * @private
         */
        this._inputElement = inputElement;

        // I miss @autobind & decorators :'(
        this._handleFormElementSubmitted = this._handleFormElementSubmitted.bind(this);
    }

    // region getters & setters
    // region formElement (get & set)
    /**
     * Gets the `HTMLFormElement` that this `Leaf`
     * is to listen for the submission of.
     *
     * @return {HTMLFormElement}
     */
    get formElement() {
        return this._formElement;
    }

    /**
     * Sets the `HTMLFormElement` that this `Leaf`
     * is to listen for the submission of.
     *
     * @param {HTMLFormElement} formElement
     */
    set formElement(formElement) {
        if (this._formElement === formElement) {
            return; // don't do anything if it's the same element
        }

        this._formElement.removeEventListener('submit', this._handleFormElementSubmitted);
        this._formElement = formElement;
        this._formElement.addEventListener('submit', this._handleFormElementSubmitted);
    }

    // endregion
    // region inputElement (get & set)
    /**
     * Gets the `HTMLInputElement` whose value this `Leaf`
     * is to send as a query when the form is submitted.
     *
     * @return {HTMLInputElement}
     */
    get inputElement() {
        return this._inputElement;
    }

    /**
     * Sets the `HTMLInputElement` whose value this `Leaf`
     * is to send as a query when the form is submitted.
     *
     * @param {HTMLInputElement} inputElement
     */
    set inputElement(inputElement) {
        this._inputElement = inputElement;
    }

    // endregion
    // endregion
    // region register and deregister
    /**
     * @inheritDoc
     *
     * Adds the `'submit'` event listener to the `HTMLFormElement`.
     *
     * @param {CompositeBSClient} compositeBSClient
     * @override
     */
    register(compositeBSClient) {
        super.register(compositeBSClient);

        this._formElement.addEventListener('submit', this._handleFormElementSubmitted);
    }

    /**
     * @inheritDoc
     *
     * Removes the `'submit'` event listener from the `HTMLFormElement`.
     *
     * @param {CompositeBSClient} compositeBSClient
     * @override
     */
    deregister(compositeBSClient) {
        super.register(compositeBSClient);

        this._formElement.removeEventListener('submit', this._handleFormElementSubmitted);
    }

    // endregion

    /**
     * Handles when the `HTMLFormElement` is submitted.
     *
     * Gets the current value of the `HTMLInputElement`,
     * sends it as a query to the BotSocketServer,
     * and then clears the `HTMLInputElement`'s value.
     *
     * @param {Event} event
     *
     * @return {boolean}
     * @private
     */
    _handleFormElementSubmitted(event) {
        event.preventDefault();

        /** @type {string} */
        const text = (this.inputElement.value).trim();

        if (text) {
            this.bsClient.sendQuery(text);
        }

        this.inputElement.value = '';

        return false;
    }

    /**
     * Sends the value of the {@link SendInputQueryOnFormSubmitLeaf#inputElement inputElement} as a query message
     * to the BotSocket server, via the `CompositeBSClient`.
     *
     * @protected
     */
    _sendElementValueAsQuery() {
        const text = (this.inputElement.value).trim();

        if (text) {
            this.bsClient.sendQuery(text);
        }

        this.inputElement.value = '';
    }
}

module.exports = SendInputQueryOnFormSubmitLeaf;
