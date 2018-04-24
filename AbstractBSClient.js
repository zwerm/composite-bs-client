// region required exceptions
const AbstractMethodCalledError = require('./exceptions/AbstractMethodCalledError');
const UnsupportedRequestTypeException = require('./exceptions/UnsupportedRequestTypeException');
// endregion

const BSClientSocket = require('./BSClientSocket');

const moment = require('moment');

class AbstractBSClient {
    /**
     * Gets the classification of the sender of the given `StaMP` message.
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     *
     * @return {string}
     * @static
     */
    static getMessageSenderClassification(message) {
        if (message.from) {
            const [senderClassification, senderTag, senderOriginatingServer] = message.from.split(':');

            return senderClassification === 'user' ? senderClassification : 'server';
        }

        return 'server';
    }

    /**
     *
     * @param {string} bsUrl
     * @param {?string} [userBotSessionId=null]
     * @param {string} [timezone=moment.tz.guess()]
     */
    constructor(bsUrl, userBotSessionId = null, timezone = moment.tz.guess()) {
        /**
         *
         * @type {number}
         * @protected
         */
        this._retryWaitTime = 1;
        /**
         *
         * @type {BSClientSocket}
         * @protected
         */
        this._bsClientSocket = new BSClientSocket(bsUrl, () => this.userBotSessionId, timezone);
        /**
         *
         * @type {?string}
         * @private
         */
        this._userBotSessionId = userBotSessionId;

        this._bsClientSocket.on(BSClientSocket.E_SOCKET_OPEN, (...args) => this._handleSocketConnected(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_CLOSE, (...args) => this._handleSocketDisconnected(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_ERROR, (...args) => this._handleSocketErrored(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_MESSAGE, (...args) => this._handleSocketMessaged(...args));
    }

    // region getters & setters
    // region userBotSession (get & set)
    /**
     *
     * @return {string}
     */
    get userBotSessionId() {
        return this._userBotSessionId;
    }

    /**
     *
     * @param {string} session
     */
    set userBotSessionId(session) {
        this._userBotSessionId = session;
    }

    // endregion
    // region isConnected (get)
    /**
     *
     * @return {boolean}
     */
    get isConnected() {
        return this._bsClientSocket.isConnected;
    }

    // endregion
    // endregion
    // region event handlers
    // region handle connected, disconnected, & errored
    /**
     *
     * @protected
     */
    _handleSocketConnected() {
        this._renderStatusUpdate('connected', 'info');
    }

    /**
     *
     * @param {number} disconnectCode
     * @protected
     */
    _handleSocketDisconnected({ disconnectCode }) {
        console.warn('socket closed');

        if (disconnectCode !== 3001) { // 1001 means Going Away, such as with page navigation, so don't try to reconnect
            this._reconnectCountdown(this._retryWaitTime);
        }
    }

    /**
     *
     * @private
     */
    _handleSocketErrored() {
        this._renderStatusUpdate('unable to reconnect', 'danger');
    }

    // endregion
    /**
     *
     * @param {BotSocket.Protocol.Messages.StandardRequest} message
     *
     * @private
     */
    _handleSocketMessaged({ message }) {
        console.log(message);
        switch (message.request) {
            case 'handshake':
                this._processServerHandshake((/** @type {BotSocket.Protocol.Messages.ServerHandshake} */ message).data);
                break;
            case 'render-messages':
                this._processRenderMessages((/** @type {BotSocket.Protocol.Messages.RenderMessages} */ message).data);
                break;
            case 'render-letter':
                this._renderLetter((/** @type {BotSocket.Protocol.Messages.RenderLetter} */ message).data.letter);
                break;
            default:
                throw new UnsupportedRequestTypeException(message);
        }
    }

    // endregion

    /**
     *
     * @param {number} [code=3001] the closing code. default code is 3001, which means don't reconnect automatically
     */
    closeSocket(code = 3001) {
        this._bsClientSocket.close(code);
    }

    connect() {
        this._bsClientSocket.connect();

        this._renderStatusUpdate('connecting...', 'warning');
    }

    /**
     * The countdown to when to attempt reconnection to the server
     *
     * @param {number} countdown
     * @private
     */
    _reconnectCountdown(countdown) {
        if (countdown <= 0) {
            this._bsClientSocket.reconnect();
            this._renderStatusUpdate('reconnecting...', 'warning');

            return;
        }

        setTimeout(() => {
            const counter = countdown - 1;
            this._renderStatusUpdate(`connection lost, retrying in ${counter}...`, 'warning');

            this._reconnectCountdown(counter);
        }, 1000);
    }

    /**
     * Sends a query message to the BotSocket server.
     *
     * @param {string} query
     * @param {string} [text=query]
     * @param {StaMP.Protocol.Messages.StandardisedQueryMessageData|Object} [data={ senderId: this.userBotSession }]
     */
    sendQuery(query, text = query, data = { senderId: this.userBotSessionId }) {
        this._bsClientSocket.sendMessageToServer('submit-query', {
            type: 'query',
            query,
            text,
            data: {
                senderId: this.userBotSessionId,
                ...data
            }
        });
    }

    /**
     * Processes the result of handshaking with the BotSocket server.
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     * @param {number} [retryWaitTime=this#_retryWaitTime]
     * @param {string} [sessionId=this#_userBotSession]
     * @private
     */
    _processServerHandshake({ retryWaitTime = this._retryWaitTime, sessionId = this._userBotSessionId } = {}) {
        this._retryWaitTime = retryWaitTime;
        this.userBotSessionId = sessionId;
    }

    /**
     *
     * @param {StaMP.Protocol.Letter} messages
     */
    _processRenderMessages({ messages }) {
        this._renderLetter(messages);
    }

    /**
     * Renders status update messages.
     *
     * @param {string} status
     * @param {StatusLevel} level
     * @protected
     * @abstract
     */
    _renderStatusUpdate(status, level) {
        throw new AbstractMethodCalledError();
    }

    /**
     * Renders a StaMP Letter - a collection of StaMP messages.
     *
     * @param {StaMP.Protocol.Letter} letter
     * @protected
     * @abstract
     */
    _renderLetter(letter) {
        throw new AbstractMethodCalledError();
    }

    /**
     *
     * @param {string} format
     *
     * @return {string}
     */
    timestamp(format = 'hh:mm:ssa') {
        return moment().format(format);
    }
}

module.exports = AbstractBSClient;
