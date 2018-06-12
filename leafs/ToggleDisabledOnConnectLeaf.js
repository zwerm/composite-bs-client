const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that toggles the `disabled` attribute of an `HTMLElement` when
 * the `CompositeBSClient` connects & disconnects to & from the server.
 *
 * @extends {BSClientLeaf}
 */
class ToggleDisabledOnConnectLeaf extends BSClientLeaf {
    /**
     *
     * @param {HTMLElement} htmlElement
     */
    constructor(htmlElement) {
        super();

        /**
         *
         * @type {HTMLElement}
         * @private
         */
        this._htmlElement = htmlElement;
    }

    // region getters & setters
    // region htmlElement (get & set)
    /**
     * Gets the `HTMLElement` that this `Leaf` is manipulating.
     *
     * @return {HTMLElement}
     */
    get htmlElement() {
        return this._htmlElement;
    }

    /**
     * Sets the `HTMLElement` that this `Leaf` is manipulating.
     *
     * @param {HTMLElement} htmlElement
     */
    set htmlElement(htmlElement) {
        this._htmlElement = htmlElement;
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     */
    postConnect() {
        this.htmlElement['disabled'] = false;
    }

    /**
     * @inheritDoc
     *
     * @param {number} disconnectCode
     * @override
     */
    postDisconnect(disconnectCode) {
        this.htmlElement['disabled'] = true;
    }
}

module.exports = ToggleDisabledOnConnectLeaf;
