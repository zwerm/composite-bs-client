const AbstractTimezoneLeaf = require('./AbstractTimezoneLeaf');

/**
 * `Leaf` that simply uses a static timezone
 * that can be changed with getters & setters.
 *
 * @extends {AbstractTimezoneLeaf}
 */
class StaticTimezoneLeaf extends AbstractTimezoneLeaf {
    /**
     *
     * @param {?string} timezone
     */
    constructor(timezone) {
        super();

        /**
         *
         * @type {?string}
         * @private
         */
        this._timezone = timezone;
    }

    // region getters & setters
    /**
     * @inheritDoc
     *
     * @return {?string}
     */
    get timezone() {
        return this._timezone;
    }

    /**
     *
     * @param {?string} timezone
     */
    set timezone(timezone) {
        this._timezone = timezone;
    }

    // endregion
}

module.exports = StaticTimezoneLeaf;
