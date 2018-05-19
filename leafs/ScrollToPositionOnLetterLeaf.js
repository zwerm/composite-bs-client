const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that scrolls the top of an `HTMLElement` to a position specified in pixels.
 */
class ScrollToPositionOnLetterLeaf extends BSClientLeaf {
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
     * Scrolls this `Leaf`s `scrollElement` to the given `position`.
     *
     * @param {number} position the position in pixels to scroll the elements top to.
     *
     * @protected
     */
    _scrollToPosition(position) {
        this._scrollElement.scrollTo({
            top: position,
            behavior: this._scrollBehaviour
        });
    }
}

module.exports = ScrollToPositionOnLetterLeaf;
