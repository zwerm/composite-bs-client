const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that sends an event message when the `CompositeBSClient`
 * handshakes with the server.
 *
 * If the `resendOnReconnect` parameter is `true`, the event will
 * be send after every handshake with the server, regardless of
 * if the handshake was a result of a server disconnection.
 *
 * Otherwise, the event will only be called by the handshake caused
 * by the initial connection, and by any manual handshake calls afterwards.
 *
 * @extends {BSClientLeaf}
 */
class SendEventOnHandshakeLeaf extends BSClientLeaf {
    /**
     *
     * @param {string} event
     * @param {Object} [payload={}]
     * @param {StaMP.Protocol.Messages.StandardisedEventMessageData|Object} [data={}}
     * @param {boolean} [resendOnReconnect=false] if `true`, then the event will be sent regardless of the if the client has already connected in the past
     */
    constructor(event, payload = {}, data = {}, resendOnReconnect = false) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._event = event;
        /**
         *
         * @type {Object}
         * @private
         */
        this._payload = Object.assign({}, payload);
        /**
         *
         * @type {StaMP.Protocol.Messages.StandardisedEventMessageData|Object}
         * @private
         */
        this._data = Object.assign({}, data);
        /**
         *
         * @type {boolean}
         * @private
         */
        this._resendOnReconnect = resendOnReconnect;
        /**
         *
         * @type {boolean}
         * @private
         */
        this._isReconnectHandshake = false;

    }

    // region getters & setters
    // region event (get & set)
    /**
     * Gets the event that this `Leaf` will send after handshaking with the server.
     *
     * @return {string}
     */
    get event() {
        return this._event;
    }

    /**
     * Sets the event that this `Leaf` will send after handshaking with the server.
     *
     * @param {string} event
     */
    set event(event) {
        this._event = event;
    }

    // endregion
    // region payload (get & set)
    /**
     * Gets the payload that this `Leaf` will send after handshaking with the server.
     *
     * @return {Object}
     */
    get payload() {
        return Object.assign({}, this._payload);
    }

    /**
     * Sets the payload that this `Leaf` will send after handshaking with the server.
     *
     * @param {Object} payload
     */
    set payload(payload) {
        this._payload = Object.assign({}, payload);
    }

    // endregion
    // region data (get & set)
    /**
     * Gets the data that this `Leaf` will send after handshaking with the server.
     *
     * @return {StaMP.Protocol.Messages.StandardisedEventMessageData|Object}
     */
    get data() {
        return Object.assign({}, this._data);
    }

    /**
     * Sets the data that this `Leaf` will send after handshaking with the server.
     *
     * @param {StaMP.Protocol.Messages.StandardisedEventMessageData|Object} data
     */
    set data(data) {
        this._data = Object.assign({}, data);
    }

    // endregion
    // region resendOnReconnect (get & set)
    /**
     * Gets whether this `Leaf` will re-send it's event when the `CompositeBSClient`
     * reconnects to the BotSocket server, after having disconnected.
     *
     * @return {boolean}
     */
    get resendOnReconnect() {
        return this._resendOnReconnect;
    }

    /**
     * Sets whether this `Leaf` will re-send it's event when the `CompositeBSClient`
     * reconnects to the BotSocket server, after having disconnected.
     *
     * @param {boolean} resendOnReconnect
     */
    set resendOnReconnect(resendOnReconnect) {
        this._resendOnReconnect = resendOnReconnect;
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * @param {number} disconnectCode
     * @override
     */
    postDisconnect(disconnectCode) {
        if (!this._resendOnReconnect) {
            this._isReconnectHandshake = true;
        }
    }

    /**
     * @inheritDoc
     */
    postHandshake() {
        if (!this._resendOnReconnect && this._isReconnectHandshake) {
            this._isReconnectHandshake = false;

            return;
        }

        this.bsClient.sendEvent(this._event, this._payload, this._data);
    }
}

module.exports = SendEventOnHandshakeLeaf;
