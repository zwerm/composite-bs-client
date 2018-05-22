// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion

const BSClientLeaf = require('../BSClientLeaf');

/**
 * Abstract `Leaf` that handles managing & providing a `location` as and
 * when required during the usual operations of a `CompositeBSClient`.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {BSClientLeaf}
 * @abstract
 */
class AbstractLocationLeaf extends BSClientLeaf {
    // region getters & setters
    /**
     * Gets the latitude of the BotSocket client.
     *
     * @return {?string|number}
     * @abstract
     */
    get lat() {
        throw new AbstractMethodCalledError();
    }

    /**
     * Gets the longitude of the BotSocket client.
     *
     * @return {?string|number}
     * @abstract
     */
    get lng() {
        throw new AbstractMethodCalledError();
    }

    // endregion

    /**
     *
     * @return {?StaMP.Protocol.Messages.LatLng}
     * @protected
     */
    _buildLatLngObject() {
        if (this._lat === null || this._lng === null) {
            return null;
        }

        return {
            lat: this._lat,
            lng: this._lng
        };
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.QueryMessage} query
     *
     * @return {StaMP.Protocol.QueryMessage}
     * @override
     */
    supplementStaMPQuery(query) {
        const lastResult = arguments[arguments.length - 1];
        const latLng = { location: this._buildLatLngObject() };

        return Object.assign(
            {},
            query,
            lastResult,
            {
                data: Object.assign(
                    {},
                    query.data,
                    lastResult ? lastResult.data : null,
                    latLng.location ? latLng : null
                )
            }
        );
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.EventMessage} event
     *
     * @return {StaMP.Protocol.EventMessage}
     * @override
     */
    supplementStaMPEvent(event) {
        const lastResult = arguments[arguments.length - 1];
        const latLng = { location: this._buildLatLngObject() };

        return Object.assign(
            {},
            event,
            lastResult,
            {
                data: Object.assign(
                    {},
                    event.data,
                    lastResult ? lastResult.data : null,
                    latLng.location ? latLng : null
                )
            }
        );
    }
}

module.exports = AbstractLocationLeaf;
