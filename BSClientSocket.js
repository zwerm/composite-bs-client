// region required exceptions
const SocketNotReadyException = require('./exceptions/SocketNotReadyException');
// endregion

const EventEmitter = require('events');
const { name: packageName } = require('./package.json');

/**
 * @implements {BotSocket.ClientSocket}
 */
class BSClientSocket extends EventEmitter {
    /**
     *
     * @param {string} bsUrl
     */
    constructor(bsUrl) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._bsUrl = bsUrl;
        /**
         *
         * @type {?WebSocket}
         * @private
         */
        this._socket = null;
        /**
         *
         * @type {debug.IDebugger}
         * @private
         */
        this._logger = require('debug')(`${packageName}:${this.constructor.name}`);
    }

    // region event constants
    // region E_SOCKET_OPEN
    /**
     *
     * @return {'e:socket.open'}
     */
    static get E_SOCKET_OPEN() {
        return 'e:socket.open';
    }

    // endregion
    // region E_SOCKET_CLOSE
    /**
     *
     * @return {'e:socket.close'}
     */
    static get E_SOCKET_CLOSE() {
        return 'e:socket.close';
    }

    // endregion
    // region E_SOCKET_ERROR
    /**
     *
     * @return {'e:socket.error'}
     */
    static get E_SOCKET_ERROR() {
        return 'e:socket.error';
    }

    // endregion
    // region E_SOCKET_MESSAGE
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
        return this._socket && this._socket.readyState === this._socket.OPEN;
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
     * @param {BotSocket.Protocol.Messages.RequestMessage} message
     *
     * @fires BSClientSocket#E_SOCKET_MESSAGE
     * @private
     */
    _emitMessaged(message) {
        /**
         * @event BSClientSocket#E_SOCKET_MESSAGE
         * @type {Object}
         *
         * @property {BotSocket.Protocol.Messages.RequestMessage} E_SOCKET_MESSAGE:message
         */
        this.emit(this.constructor.E_SOCKET_MESSAGE, { message });
    }

    // endregion
    // region sending messages
    /**
     * Sends a BotSocket message to the BotSocket server.
     *
     * @param {BotSocket.Protocol.Messages.RequestType} request
     * @param {BotSocket.Protocol.Messages.RequestData} [data={}]
     * @override
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
     * @see {@link BSClientSocket#connect BSClientSocket.connect}
     */
    reconnect() {
        this.connect();
    }

    /**
     * Attempts to connect to the BotSocket server by instancing a new socket.
     */
    connect() {
        // todo: test about closing the socket if it's already connected/open
        this._newSocket();
    }

    /**
     *
     * @param {number} [code=3001] the closing code.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
     */
    close(code) {
        this._socket && this._socket.close(code);
    }

    /**
     * Instantiates a new WebSocket to connect to a BotSocket server,
     * setting up the relevant event handlers, but not sending handshake.
     *
     * @return {WebSocket}
     * @private
     */
    _newSocket() {
        const socket = new WebSocket(`${this._bsUrl}`);

        socket.addEventListener('error', event => this._handleSocketErrored(event));

        socket.addEventListener('open', () => {
            this._emitOpened();

            // only attach the extra listeners to the socket once we get a connection
            socket.addEventListener('close', event => this._handleSocketClosed(event));
            socket.addEventListener('message', event => this._handleSocketMessaged(event));

            this._logger('socket opened');
        });

        this._socket = socket;

        return socket;
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
        let data = null;

        try {
            data = JSON.parse(messageEvent.data);
        } catch (error) {
            this._logger('server sent malformed json:', messageEvent.data);
        }

        if (data) {
            this._emitMessaged(data);
        }
    }

    // endregion
}

module.exports = BSClientSocket;
