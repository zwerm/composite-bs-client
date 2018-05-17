const AbstractLocationLeaf = require('./AbstractLocationLeaf');

/**
 * `Leaf` that simply uses a static lat & lng
 * that can be changed with getters & setters.
 *
 * @extends {AbstractLocationLeaf}
 */
class StaticLocationLeaf extends AbstractLocationLeaf {
    /**
     *
     * @param {?string|number} lat
     * @param {?string|number} lng
     */
    constructor(lat, lng) {
        super();

        /**
         *
         * @type {?string|number}
         * @private
         */
        this._lat = lat;
        /**
         *
         * @type {?string|number}
         * @private
         */
        this._lng = lng;
    }

    // region getters & setters
    // region lat (get & set)
    /**
     * @inheritDoc
     *
     * @return {?string|number}
     * @override
     */
    get lat() {
        return this._lat;
    }

    /**
     *
     * @param {?string|number} lat
     */
    set lat(lat) {
        this._lat = lat;
    }

    // endregion
    // region lng (get & set)
    /**
     * @inheritDoc
     *
     * @return {?string|number}
     * @overried
     */
    get lng() {
        return this._lng;
    }

    /**
     *
     * @param {?string|number} lng
     */
    set lng(lng) {
        this._lng = lng;
    }

    // endregion
    // endregion
}

module.exports = StaticLocationLeaf;
