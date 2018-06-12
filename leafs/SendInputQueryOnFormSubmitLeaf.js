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

        // just to be safe
        this.formElement.removeEventListener('submit', this._handleFormElementSubmitted);
        this.formElement.addEventListener('submit', this._handleFormElementSubmitted);
    }

    /**
     * @inheritDoc
     *
     * Removes the `'submit'` event listener from the `HTMLFormElement`.
     *
     * @override
     */
    deregister() {
        super.deregister();

        this.formElement.removeEventListener('submit', this._handleFormElementSubmitted);
    }

    // endregion

    /**
     * Handles when the `HTMLFormElement` is submitted.
     * <br\>
     * Checks if the `CompositeBSClient` is connected,
     * and calls {@link #_sendElementValueAsQuery `_sendElementValueAsQuery`} if it is.
     *
     * @param {Event} submitEvent
     *
     * @return {boolean}
     * @protected
     *
     * @see #_sendElementValueAsQuery SendInputQueryOnFormSubmitLeaf._sendElementValueAsQuery method
     */
    _handleFormElementSubmitted(submitEvent) {
        submitEvent.preventDefault();

        if (this.bsClient.isConnected) {
            this._sendElementValueAsQuery();
        } // make sure the client is actually connected

        return false;
    }

    /**
     * Sends the value of the {@link #inputElement `inputElement`} as a query message
     * to the BotSocket server, via the `CompositeBSClient`.
     *
     * @protected
     *
     * @see CompositeBSClient#sendQuery CompositeBSClient.sendQuery method
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
