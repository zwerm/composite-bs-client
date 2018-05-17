const AbstractLocationLeaf = require('./AbstractLocationLeaf');

/**
 * `Leaf` that gets location via the geolocation browser API.
 *
 * @extends {AbstractLocationLeaf}
 */
class BrowserLocationLeaf extends AbstractLocationLeaf {
    constructor() {
        super();

        /**
         *
         * @type {?string|number}
         * @private
         */
        this._lat = null;
        /**
         *
         * @type {?string|number}
         * @private
         */
        this._lng = null;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        }
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

module.exports = BrowserLocationLeaf;
