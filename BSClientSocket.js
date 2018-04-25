// region required exceptions
const SocketNotReadyException = require('./exceptions/SocketNotReadyException');
// endregion

const EventEmitter = require('events');

/**
 * @typedef {'success'|'info'|'danger'|'warning'} StatusLevel
 */

/**
 *
 */
class BSClientSocket extends EventEmitter {
    /**
     *
     * @param {string} url
     */
    constructor(url) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._url = url;
        /**
         *
         * @type {WebSocket}
         * @private
         */
        this._socket = null;
    }

    // region static constant getters
    // region E_SOCKET_CONNECTED
    /**
     *
     * @return {'e:socket.open'}
     */
    static get E_SOCKET_OPEN() {
        return 'e:socket.open';
    }

    // endregion
    // region E_SOCKET_DISCONNECTED
    /**
     *
     * @return {'e:socket.close'}
     */
    static get E_SOCKET_CLOSE() {
        return 'e:socket.close';
    }

    // endregion
    // region E_SOCKET_ERRORED
    /**
     *
     * @return {'e:socket.error'}
     */
    static get E_SOCKET_ERROR() {
        return 'e:socket.error';
    }

    // endregion
    // region E_SOCKET_RECEIVED_MESSAGE
    /**
     *
     * @return {'e:socket.message'}
     */
    static get E_SOCKET_MESSAGE() {
        return 'e:socket.message';
    }

    // endregion
    // endregion
    // region getters & setters
    /**
     *
     * @return {boolean}
     */
    get isConnected() {
        return this._socket.readyState === this._socket.OPEN;
    }

    // endregion
    // region event emitting
    // region connected, disconnected, & errored
    /**
     * Emits an event signaling that the socket has opened a connection to the BotSocket server.
     *
     * @fires BSClientSocket#E_SOCKET_OPEN
     * @private
     */
    _emitOpened() {
        /**
         * @event BSClientSocket#E_SOCKET_OPEN
         * @type {Object}
         */
        this.emit(this.constructor.E_SOCKET_OPEN, {});
    }

    /**
     * Emits an event signaling that the socket has closed the connection to the BotSocket server.
     *
     * @param {number} disconnectCode the code given as the reason for closing the connection. 3001 means Going Away (i.e page navigation)
     *
     * @fires BSClientSocket#E_SOCKET_CLOSE
     * @private
     */
    _emitClosed(disconnectCode) {
        /**
         * @event BSClientSocket#E_SOCKET_CLOSE
         * @type {Object}
         *
         * @property {number} E_SOCKET_CLOSE:disconnectCode
         */
        this.emit(this.constructor.E_SOCKET_CLOSE, { disconnectCode });
    }

    /**
     * Emits an event signaling that the socket has errored while connecting to or from the BotSocket server.
     *
     * @fires BSClientSocket#E_SOCKET_ERROR
     * @private
     */
    _emitErrored() {
        /**
         * @event BSClientSocket#E_SOCKET_ERROR
         * @type {Object}
         */
        this.emit(this.constructor.E_SOCKET_ERROR, {});
    }

    // endregion

    /**
     * Emits an event signaling that the socket was messaged by the BotSocket server.
     *
     * @param {BotSocket.Protocol.Messages.StandardRequest} message
     *
     * @fires BSClientSocket#E_SOCKET_MESSAGE
     * @private
     */
    _emitMessaged(message) {
        /**
         * @event BSClientSocket#E_SOCKET_MESSAGE
         * @type {Object}
         *
         * @property {BotSocket.Protocol.Messages.StandardRequest} E_SOCKET_MESSAGE:message
         */
        this.emit(this.constructor.E_SOCKET_MESSAGE, { message });
    }

    // endregion
    // region sending messages
    /**
     * Sends a BotSocket message to the BotSocket server.
     *
     * @param {BotSocket.Protocol.Messages.Request} request
     * @param {BotSocket.Protocol.Messages.StandardData} [data={}]
     *
     * @throws {SocketNotReadyException} when the socket isn't ready to send messages.
     */
    sendMessageToServer(request, data = {}) {
        if (this._socket.readyState !== WebSocket.OPEN) {
            throw new SocketNotReadyException(this._socket.readyState);
        }

        this._socket.send(JSON.stringify({ request, data }));
    };

    // endregion

    /**
     * Attempts to reconnect to the BotSocket server by instancing a new socket.
     *
     * @param {string} botUserSessionId
     */
    reconnect(botUserSessionId) {
        this.connect(botUserSessionId);
    }

    /**
     * Attempts to connect to the BotSocket server by instancing a new socket.
     *
     * @param {string} botUserSessionId
     */
    connect(botUserSessionId) {
        // todo: test about closing the socket if it's already connected/open
        this._newSocket(botUserSessionId);
    }

    /**
     *
     * @param {number} [code=3001] the closing code.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
     */
    close(code) {
        this._socket.close(code);
    }

    /**
     * @param {string} botUserSessionId
     *
     * @return {WebSocket}
     * @private
     */
    _newSocket(botUserSessionId) {
        const sessionId = botUserSessionId || '';

        const socket = new WebSocket(`${this._url}?session=${sessionId}`);

        socket.addEventListener('error', event => this._handleSocketErrored(event));

        socket.addEventListener('open', () => {
            this._emitOpened();

            // only attach the extra listeners to the socket once we get a connection
            socket.addEventListener('close', event => this._handleSocketClosed(event));
            socket.addEventListener('message', event => this._handleSocketMessaged(event));

            console.log('socket opened');

            this.sendMessageToServer('handshake', { sessionId });
        });

        this._socket = socket;
    }

    // region handle socket events
    /**
     * Handles when the websocket receives a close event.
     *
     * @param {CloseEvent} closeEvent
     *
     * @fires BSClientSocket#E_SOCKET_CLOSE
     * @private
     */
    _handleSocketClosed(closeEvent) {
        this._emitClosed(closeEvent.code);
    }

    /**
     * Handles when the websocket emits an error event.
     *
     * @param {Event} errorEvent
     *
     * @fires BSClientSocket#E_SOCKET_ERROR
     * @private
     */
    _handleSocketErrored(errorEvent) {
        this._emitErrored();
    }

    /**
     * Handles when the websocket receives a message event.
     *
     * @param {MessageEvent} messageEvent
     *
     * @fires BSClientSocket#E_SOCKET_MESSAGE
     * @private
     */
    _handleSocketMessaged(messageEvent) {
        try {
            this._emitMessaged(JSON.parse(messageEvent.data));
        } catch (error) {
            console.error('server sent malformed json:', messageEvent.data);
        }
    }

    // endregion
}

module.exports = BSClientSocket;
