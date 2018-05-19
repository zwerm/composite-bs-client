// region required exceptions
const UnsupportedRequestTypeException = require('./exceptions/UnsupportedRequestTypeException');
// endregion

const BSClientSocket = require('./BSClientSocket');
const BSClientBush = require('./leafs/BSClientBush');

/**
 *
 */
class CompositeBSClient {
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
     * @param {?string} [defaultUserId=null] The default user id to use, if no registered `Leaf`s override it.
     */
    constructor(bsUrl, defaultUserId = null) {
        /**
         *
         * @type {BSClientBush | BSClientLeaf}
         * @private
         */
        this._bsClientBush = new BSClientBush(this);
        /**
         *
         * @type {BSClientSocket}
         * @private
         */
        this._bsClientSocket = new BSClientSocket(bsUrl);
        /**
         * The default user id that we use if not overridden by a `Leaf`.
         *
         * @type {?string}
         * @private
         */
        this._defaultUserId = defaultUserId;

        this._bsClientSocket.on(BSClientSocket.E_SOCKET_OPEN, (...args) => this._handleSocketConnected(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_CLOSE, (...args) => this._handleSocketDisconnected(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_ERROR, (...args) => this._handleSocketErrored(...args));
        this._bsClientSocket.on(BSClientSocket.E_SOCKET_MESSAGE, (...args) => this._handleSocketMessaged(...args));
    }

    // region getters & setters
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
     * @private
     */
    _handleSocketConnected() {
        this._sendClientHandshake();
        this._bsClientBush.postConnect();
    }

    /**
     *
     * @param {number} disconnectCode
     * @private
     */
    _handleSocketDisconnected({ disconnectCode }) {
        this._bsClientBush.postDisconnect(disconnectCode);
        console.warn('socket closed');
    }

    /**
     *
     * @private
     */
    _handleSocketErrored() {
        this._bsClientBush.errored();
    }

    // endregion
    /**
     *
     * @param {BotSocket.Protocol.Messages.RequestMessage} message
     *
     * @private
     */
    _handleSocketMessaged({ message }) {
        console.log(message);
        switch (message.request) {
            case 'handshake':
                this._processServerHandshake((/** @type {BotSocket.Protocol.Messages.ServerHandshake} */ message).data);
                break;
            case 'render-letter':
                this._processRenderLetterRequest((/** @type {BotSocket.Protocol.Messages.RenderLetter} */ message).data);
                break;
            default:
                throw new UnsupportedRequestTypeException(message);
        }
    }

    // endregion
    // region register & deregister leafs
    /**
     * Registers a {@link BSClientLeaf}.
     *
     * Returns this `CompositeBSClient` to allow to chaining.
     *
     * @param {BSClientLeaf} leaf
     *
     * @return {CompositeBSClient}
     */
    registerLeaf(leaf) {
        this._bsClientBush.registerLeaf(leaf);

        return this;
    }

    /**
     * Deregisters a {@link BSClientLeaf}.
     *
     * Returns this `CompositeBSClient` to allow to chaining.
     *
     * @param {BSClientLeaf} leaf
     *
     * @return {CompositeBSClient}
     */
    deregisterLeaf(leaf) {
        this._bsClientBush.deregisterLeaf(leaf);

        return this;
    }

    // endregion

    /**
     *
     * @param {number} [code=3001] the closing code. default code is 3001, which means don't reconnect automatically
     */
    closeSocket(code = 3001) {
        this._bsClientBush.preDisconnect(code);

        this._bsClientSocket.close(code);
    }

    /**
     *
     */
    connect() {
        this._bsClientBush.preConnect(false);

        this._bsClientSocket.connect();
    }

    /**
     *
     */
    reconnect() {
        this._bsClientBush.preConnect(true);

        this._bsClientSocket.connect();
    }

    /**
     * Sends a query message to the BotSocket server.
     *
     * Unless provided in the `data` parameter, `AbstractBSClient#clientId`
     * will be used for the required `data.senderId` property, via the spread operator.
     *
     * @param {string} query
     * @param {string} [text=query]
     * @param {StaMP.Protocol.Messages.StandardisedQueryMessageData|Object} [data={}]
     */
    sendQuery(query, text = query, data = {}) {
        this._sendQuery(this._supplementStaMPQuery({
            $StaMP: true,
            type: 'query',
            from: 'user',
            query,
            text,
            data: { senderId: this._defaultUserId },
            timezone: null
        }));
    }

    /**
     * Actually sends a query message to the BotSocket server.
     *
     * @param {StaMP.Protocol.QueryMessage} queryMessage
     * @private
     */
    _sendQuery(queryMessage) {
        (/** @type {BotSocket.ClientSocket} */this._bsClientSocket).sendMessageToServer(
            'submit-query',
            queryMessage
        );
    }

    /**
     * Sends a handshake message to the BotSocket server.
     *
     * @private
     */
    _sendClientHandshake() {
        (/** @type {BotSocket.ClientSocket} */this._bsClientSocket).sendMessageToServer(
            'handshake',
            this._supplementClientHandshake()
        );
    }

    /**
     * Supplements the data that's going to be sent as part of a BotSocket `ClientHandshake`.
     *
     * @return {BotSocket.Protocol.Messages.ClientHandshakeData}
     * @private
     */
    _supplementClientHandshake() {
        return this._bsClientBush.supplementClientHandshake({ userId: this._defaultUserId });
    }

    /**
     * Supplements a StaMP query message that's going to be sent to the BotSocket server.
     *
     * @param {StaMP.Protocol.QueryMessage} query
     *
     * @return {StaMP.Protocol.QueryMessage}
     * @private
     */
    _supplementStaMPQuery(query) {
        return this._bsClientBush.supplementStaMPQuery(query);
    }

    /**
     * Processes the data provided by the BotSocket server as part of it's handshaking.
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     * @private
     */
    _processServerHandshake(serverHandshake) {
        this._defaultUserId = serverHandshake.userId;

        this._bsClientBush.processServerHandshake(serverHandshake);
    }

    /**
     * Processes a received `render-letter` BotSocket request message.
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @private
     */
    _processRenderLetterRequest(renderLetterData) {
        this._bsClientBush.processRenderLetterRequest(renderLetterData);
    }
}

module.exports = CompositeBSClient;
