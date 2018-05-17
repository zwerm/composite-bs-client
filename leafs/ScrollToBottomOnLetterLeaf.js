const Leaf = require('./Leaf');

/**
 * `Leaf` that scrolls to the bottom of
 * an element when a letter is rendered.
 */
class ScrollToBottomOnLetterLeaf extends Leaf {
    /**
     *
     * @param {HTMLElement} scrollElement
     * @param {ScrollBehavior} [scrollBehaviour='smooth']
     */
    constructor(scrollElement, scrollBehaviour = 'smooth') {
        super();

        /**
         *
         * @type {HTMLElement}
         * @private
         */
        this._scrollElement = scrollElement;
        /**
         *
         * @type {ScrollBehavior}
         * @private
         */
        this._scrollBehaviour = scrollBehaviour;
    }

    // region getters & setters
    // region scrollElement (get & set)
    /**
     *
     * @return {HTMLElement}
     */
    get scrollElement() {
        return this._scrollElement;
    }

    /**
     *
     * @param {HTMLElement} scrollElement
     */
    set scrollElement(scrollElement) {
        this._scrollElement = scrollElement;
    }

    // endregion
    // region scrollBehaviour (get & set)
    /**
     *
     * @return {ScrollBehavior}
     */
    get scrollBehaviour() {
        return this._scrollBehaviour;
    }

    /**
     *
     * @param {ScrollBehavior} scrollBehaviour
     */
    set scrollBehaviour(scrollBehaviour) {
        this._scrollBehaviour = scrollBehaviour;
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.Letter} letter
     */
    renderLetter(letter) {
        this._scrollToBottom();
    }

    /**
     * Scrolls to the bottom of this `Leaf`s scroll element.
     *
     * @private
     */
    _scrollToBottom() {
        this._scrollElement.scrollTo({
            top: this._scrollElement.scrollHeight,
            behavior: this._scrollBehaviour
        });
    }
}

module.exports = ScrollToBottomOnLetterLeaf;
