// region required exceptions
const UnsupportedRequestTypeException = require('./exceptions/UnsupportedRequestTypeException');
// endregion

const BSClientSocket = require('./BSClientSocket');
const BSClientBush = require('./leafs/BSClientBush');
const { name: packageName } = require('./package.json');

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
     * Builds a url for connecting to the `ZwermChat` BotSocket server.
     *
     * @param {string} baseUrl the base `ZwermChat` BotSocket server url.
     * @param {string} botTeam the id of the team that the bot being connected to belongs to.
     * @param {string} botId the id of the bot that is being connected to.
     * @param {string} channelId the id of the channel of the bot that is being connected to.
     *
     * @return {string}
     */
    static buildZwermChatUrl(baseUrl, botTeam, botId, channelId) {
        return `${baseUrl}/${botTeam}/${botId}/${channelId}`;
    }

    /**
     * Instantiates a new `CompositeBClient` to connect to the `ZwermChat` BotSocket server.
     *
     * @param {string} baseUrl the base `ZwermChat` BotSocket server url.
     * @param {string} botTeam the id of the team that the bot being connected to belongs to.
     * @param {string} botId the id of the bot that is being connected to.
     * @param {string} channelId the id of the channel of the bot that is being connected to.
     *
     * @return {CompositeBSClient}
     */
    static newForZwermChat(baseUrl, botTeam, botId, channelId) {
        return new CompositeBSClient(
            CompositeBSClient.buildZwermChatUrl(
                baseUrl,
                botTeam,
                botId,
                channelId
            )
        );
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
        /**
         *
         * @type {debug.IDebugger}
         * @private
         */
        this._logger = require('debug')(`${packageName}:${this.constructor.name}`);

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
        this.sendClientHandshake();
        this._bsClientBush.postConnect();
    }

    /**
     *
     * @param {number} disconnectCode
     * @private
     */
    _handleSocketDisconnected({ disconnectCode }) {
        this._bsClientBush.postDisconnect(disconnectCode);
        this._logger('socket closed');
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
        this._logger('new message', message);
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
     *
     * @deprecated in favor of the {@link #disconnect disconnect} method.
     */
    closeSocket(code = 3001) {
        this._bsClientBush.preDisconnect(code);

        this._bsClientSocket.close(code);
    }

    /**
     * Disconnects from the BotSocket server by closing the socket.
     *
     * @param {number} [code=3001] the closing code. default code is 3001, which means don't reconnect automatically
     *
     * @return {CompositeBSClient}
     */
    disconnect(code = 3001) {
        this._bsClientBush.preDisconnect(code);

        this._bsClientSocket.close(code);

        return this;
    }

    /**
     * Connects to the BotSocket server by opening a new socket.
     *
     * @return {CompositeBSClient}
     */
    connect() {
        this._bsClientBush.preConnect(false);

        this._bsClientSocket.connect();

        return this;
    }

    /**
     * Reconnects to the BotSocket server by opening a new socket.
     *
     * @return {CompositeBSClient}
     */
    reconnect() {
        this._bsClientBush.preConnect(true);

        this._bsClientSocket.connect();

        return this;
    }

    /**
     * Sends a query message to the BotSocket server.
     *
     * The query message will be supplemented by any registered leafs that implement the
     * {@link BSClientLeaf#supplementStaMPQuery BSClientLeaf.supplementStaMPQuery} method.
     *
     * The query's `data.senderId` property will be the default user id that was
     * provided by the BotSocket server as part of it's handshaking, unless overridden
     * by a registered `leaf`.
     *
     * @param {string} query
     * @param {string} [text=query]
     * @param {StaMP.Protocol.Messages.StandardisedQueryMessageData|Object} [data={}]
     *
     * @see {@link BSClientLeaf#supplementStaMPQuery BSClientLeaf.supplementStaMPQuery}
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
     * Sends an event message to the BotSocket server.
     *
     * The event message will be supplemented by any registered leafs that implement the
     * {@link BSClientLeaf#supplementStaMPEvent BSClientLeaf.supplementStaMPEvent} method.
     *
     * The event's `data.senderId` property will be the default user id that was
     * provided by the BotSocket server as part of it's handshaking, unless overridden
     * by a registered `leaf`.
     *
     * @param {string} event
     * @param {Object} [payload={}]
     * @param {StaMP.Protocol.Messages.StandardisedEventMessageData|Object} [data={}]
     *
     * @see {@link BSClientLeaf#supplementStaMPEvent BSClientLeaf.supplementStaMPEvent}
     */
    sendEvent(event, payload = {}, data = {}) {
        this._sendEvent(this._supplementStaMPEvent({
            $StaMP: true,
            type: 'event',
            from: 'user',
            event,
            payload,
            data: { senderId: this._defaultUserId },
            timezone: null
        }));
    }

    /**
     * Actually sends an event message to the BotSocket server.
     *
     * @param {StaMP.Protocol.EventMessage} eventMessage
     * @private
     */
    _sendEvent(eventMessage) {
        (/** @type {BotSocket.ClientSocket} */this._bsClientSocket).sendMessageToServer(
            'submit-event',
            eventMessage
        );
    }

    /**
     * Sends a handshake message to the BotSocket server.
     */
    sendClientHandshake() {
        this._sendClientHandshake(this._supplementClientHandshake({ userId: this._defaultUserId }));
    }

    /**
     * Actually sends a handshake message to the BotSocket server.
     *
     * @param {BotSocket.Protocol.Messages.ClientHandshakeData} clientHandshake
     *
     * @private
     */
    _sendClientHandshake(clientHandshake) {
        (/** @type {BotSocket.ClientSocket} */this._bsClientSocket).sendMessageToServer(
            'handshake',
            clientHandshake
        );
    }

    /**
     * Supplements the data that's going to be sent as part of a BotSocket `ClientHandshake`.
     *
     * @param {BotSocket.Protocol.Messages.ClientHandshakeData} clientHandshake
     *
     * @return {BotSocket.Protocol.Messages.ClientHandshakeData}
     * @private
     */
    _supplementClientHandshake(clientHandshake) {
        return this._bsClientBush.supplementClientHandshake(clientHandshake);
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
     * Supplements a StaMP event message that's going to be sent to the BotSocket server.
     *
     * @param {StaMP.Protocol.EventMessage} event
     *
     * @return {StaMP.Protocol.EventMessage}
     * @private
     */
    _supplementStaMPEvent(event) {
        return this._bsClientBush.supplementStaMPEvent(event);
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
        this._bsClientBush.postHandshake();
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
