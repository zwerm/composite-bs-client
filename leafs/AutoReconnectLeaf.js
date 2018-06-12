const { EventEmitter } = require('events');

const BSClientLeaf = require('./BSClientLeaf');

/**
 * A `Leaf` for handling automatic reconnects after a delay when the
 * `CompositeBSClient` disconnects from the BotSocket server.
 *
 * If the `CompositeBSClient` disconnects with a code that's not
 * in the `disconnectCodesToIgnore` array, a countdown will start
 * that will end in triggering automatic reconnection.
 *
 * The countdown time is provided by the BotSocket server as part
 * of the initial client-server handshaking.
 *
 * This `Leaf` will emit {@link AutoReconnectLeaf#event:E_STATUS_RECONNECT_COUNTDOWN e:status.reconnect.countdown}
 * with the remaining seconds before trying to reconnect as it counts down.
 *
 * @see {@link BSClientLeaf#postDisconnect BSClientLeaf.postDisconnect(disconnectCode)}
 */
class AutoReconnectLeaf extends BSClientLeaf {
    /**
     *
     * @param {module:events.internal.EventEmitter} [emitter = new EventEmitter()]
     * @param {Array<number>} disconnectCodesToIgnore Array of disconnect codes that should be ignored, instead of triggering automatic reconnection.
     */
    constructor(emitter = new EventEmitter(), disconnectCodesToIgnore = [3001]) {
        super();

        /**
         *
         * @type {module:events.internal.EventEmitter}
         * @protected
         */
        this._emitter = emitter;
        /**
         * Array of disconnect codes that should be ignored, instead of triggering automatic reconnection,
         *
         * @type {Array<number>}
         * @private
         */
        this._disconnectCodesToIgnore = disconnectCodesToIgnore;
        /**
         *
         * @type {number}
         * @protected
         */
        this._retryWaitTime = 1;
    }

    // region event constants
    // region E_STATUS_RECONNECT_COUNTDOWN
    /**
     * Gets the event string for the event that gets emitted
     * when the reconnection timer counts down by a second.
     *
     * @return {'e:status.reconnect.countdown'}
     */
    static get E_STATUS_RECONNECT_COUNTDOWN() {
        return 'e:status.reconnect.countdown';
    }

    // endregion
    // endregion
    // region getters & setters
    /**
     * Gets a copy of the array of disconnect codes that should be ignored, instead of triggering automatic reconnection.
     *
     * @return {Array<number>} Copy of the array of disconnect codes that should be ignored, instead of triggering automatic reconnection.
     */
    get disconnectCodesToIgnore() {
        return [...this._disconnectCodesToIgnore];
    }

    // endregion
    // region event emitting
    // region E_STATUS_RECONNECT_COUNTDOWN
    /**
     * Emits an event signaling that a reconnection attempt will be triggered soon.
     *
     * This event will provide the number of seconds remaining until reconnection will be attempted.
     *
     * @param {number} secondsUntilReconnect
     *
     * @fires AutoReconnectLeaf#E_STATUS_RECONNECT_COUNTDOWN
     * @protected
     */
    _emitReconnectCountdown(secondsUntilReconnect) {
        /**
         * @event AutoReconnectLeaf#E_STATUS_RECONNECT_COUNTDOWN
         * @type {object}
         * @property {number} E_STATUS_RECONNECT_COUNTDOWN:secondsUntilReconnect the number of seconds left on the countdown before trying to reconnect.
         */
        this._emitter.emit(this.constructor.E_STATUS_RECONNECT_COUNTDOWN, { secondsUntilReconnect });
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * If the disconnect code isn't in the `_disconnectCodesToIgnore` array,
     * the automatic reconnect countdown will start.
     *
     * @param {number} disconnectCode
     * @override
     */
    postDisconnect(disconnectCode) {
        if (this._disconnectCodesToIgnore.indexOf(disconnectCode) === -1) {
            this._reconnectCountdown(this._retryWaitTime);
        }
    }

    /**
     * @inheritDoc
     *
     * Gets the time this `AutoReconnectLeaf` should wait before
     * triggering a reconnection attempt on the `CompositeBSClient`.
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     * @override
     */
    processServerHandshake(serverHandshake) {
        this._retryWaitTime = serverHandshake.retryWaitTime;
    }

    /**
     * Counts down towards triggering reconnection on the `CompositeBSClient`.
     *
     * If the `countdown` parameter is less than or equal to `0`, then {@link CompositeBSClient#reconnect} is called.
     * Otherwise, a timeout will be set to call this method again after a second.
     *
     * @param {number} countdown
     * @protected
     */
    _reconnectCountdown(countdown) {
        if (countdown <= 0) {
            this.bsClient.reconnect();

            return;
        }

        setTimeout(() => {
            const counter = countdown - 1;
            this._emitReconnectCountdown(counter);

            this._reconnectCountdown(counter);
        }, 1000);
    }
}

module.exports = AutoReconnectLeaf;
