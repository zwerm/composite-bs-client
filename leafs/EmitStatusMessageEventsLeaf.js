const { EventEmitter } = require('events');

const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that emits status messages events based on the
 * usual operations of a BotSocket Client, via an event emitter.
 *
 * @extends {BSClientLeaf}
 */
class EmitStatusMessageEventsLeaf extends BSClientLeaf {
    /**
     *
     * @param {module:events.internal.EventEmitter} [emitter = new EventEmitter()]
     */
    constructor(emitter = new EventEmitter()) {
        super();

        /**
         *
         * @type {module:events.internal.EventEmitter}
         * @protected
         */
        this._emitter = emitter;
    }

    // region event constants
    // region E_STATUS_CONNECTING
    /**
     *
     * @return {'e:status.connecting'}
     */
    static get E_STATUS_CONNECTING() {
        return 'e:status.connecting';
    }

    // endregion
    // region E_STATUS_CONNECT
    /**
     *
     * @return {'e:status.connect'}
     */
    static get E_STATUS_CONNECT() {
        return 'e:status.connect';
    }

    // endregion
    // region E_STATUS_DISCONNECTING
    /**
     *
     * @return {'e:status.disconnecting'}
     */
    static get E_STATUS_DISCONNECTING() {
        return 'e:status.disconnecting';
    }

    // endregion
    // region E_STATUS_DISCONNECT
    /**
     *
     * @return {'e:status.disconnect'}
     */
    static get E_STATUS_DISCONNECT() {
        return 'e:status.disconnect';
    }

    // endregion
    // region E_STATUS_ERROR
    /**
     *
     * @return {'e:status.error'}
     */
    static get E_STATUS_ERROR() {
        return 'e:status.error';
    }

    // endregion

    // endregion
    // region getters & setters
    /**
     *
     * @return {module:events.internal.EventEmitter}
     */
    get emitter() {
        return this._emitter;
    }

    // endregion
    // region event emitting
    // region E_STATUS_CONNECTING
    /**
     * Emits an event signaling that the BotSocket client is connecting to the server.
     *
     * This event will provide a boolean representing if it's the first initial connection.
     *
     * @param {boolean} isReconnection
     *
     * @fires EmitStatusMessageEventsLeaf#E_STATUS_CONNECTING
     * @private
     */
    _emitStatusConnecting(isReconnection) {
        /**
         * @event EmitStatusMessageEventsLeaf#E_STATUS_CONNECTING
         * @type {object}
         * @property {boolean} E_STATUS_CONNECTING:isReconnection
         */
        this.emitter.emit(this.constructor.E_STATUS_CONNECTING, { isReconnection });
    }

    // endregion
    // region E_STATUS_CONNECT
    /**
     * Emits an event signaling that the BotSocket client has connected to the server.
     *
     * This event will provide nothing.
     *=*
     * @fires EmitStatusMessageEventsLeaf#E_STATUS_CONNECT
     * @private
     */
    _emitStatusConnect() {
        /**
         * @event EmitStatusMessageEventsLeaf#E_STATUS_CONNECT
         * @type {object}
         */
        this.emitter.emit(this.constructor.E_STATUS_CONNECT, {});
    }

    // endregion
    // region E_STATUS_DISCONNECTING
    /**
     * Emits an event signaling that the BotSocket client is about to manually disconnect from the server.
     *
     * This event will provide the code that will be given as the disconnect code.
     *
     * @param {number} disconnectCode
     *
     * @fires EmitStatusMessageEventsLeaf#E_STATUS_DISCONNECTING
     * @private
     */
    _emitStatusDisconnecting(disconnectCode) {
        /**
         * @event EmitStatusMessageEventsLeaf#E_STATUS_DISCONNECTING
         * @type {object}
         *
         * @property {boolean} E_STATUS_DISCONNECTING:disconnectCode
         */
        this.emitter.emit(this.constructor.E_STATUS_DISCONNECTING, { disconnectCode });
    }

    // endregion
    // region E_STATUS_DISCONNECT
    /**
     * Emits an event signaling that the BotSocket client has been disconnected from the server.
     *
     * This event will provide the code that was provided upon disconnect.
     *
     * @param {number} disconnectCode
     *
     * @fires EmitStatusMessageEventsLeaf#E_STATUS_DISCONNECT
     * @private
     */
    _emitStatusDisconnect(disconnectCode) {
        /**
         * @event EmitStatusMessageEventsLeaf#E_STATUS_DISCONNECT
         * @type {object}
         *
         * @property {boolean} E_STATUS_DISCONNECT:disconnectCode
         */
        this.emitter.emit(this.constructor.E_STATUS_DISCONNECT, { disconnectCode });
    }

    // endregion
    // region E_STATUS_ERROR
    /**
     * Emits an event signaling that the BotSocket client's socket errored when trying to do something.
     *
     * This event will provide the error... maybe?
     *
     * @param {Object} socketError
     *
     * @fires EmitStatusMessageEventsLeaf#E_STATUS_ERROR
     * @private
     */
    _emitStatusError(socketError) {
        /**
         * @event EmitStatusMessageEventsLeaf#E_STATUS_ERROR
         * @type {object}
         * @property {Object} E_STATUS_ERROR:socketError
         */
        this.emitter.emit(this.constructor.E_STATUS_ERROR, { socketError });
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * @param {boolean} isReconnection
     */
    preConnect(isReconnection) {
        this._emitStatusConnecting(isReconnection);
    }

    /**
     * @inheritDoc
     */
    postConnect() {
        this._emitStatusConnect();
    }

    /**
     * @inheritDoc
     *
     * @param {number} disconnectCode
     * @override
     */
    preDisconnect(disconnectCode) {
        this._emitStatusDisconnecting(disconnectCode);
    }

    /**
     * @inheritDoc
     *
     * @param {number} disconnectCode
     * @override
     */
    postDisconnect(disconnectCode) {
        this._emitStatusDisconnect(disconnectCode);
    }

    /**
     * @inheritDoc
     */
    errored() {
        this._emitStatusError();
    }
}

module.exports = EmitStatusMessageEventsLeaf;
