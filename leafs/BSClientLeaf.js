/**
 *
 */
class BSClientLeaf {
    constructor() {
        /**
         *
         * @type {?CompositeBSClient}
         * @private
         */
        this._compositeBSClient = null;
    }

    // region getters & setters
    /**
     *
     * @return {?CompositeBSClient}
     */
    get bsClient() {
        return this._compositeBSClient;
    }

    // endregion
    // region register & deregister
    /**
     *
     * @param {CompositeBSClient} compositeBSClient
     */
    register(compositeBSClient) {
        this._compositeBSClient = compositeBSClient;
    }

    /**
     *
     */
    deregister() {
        this._compositeBSClient = null;
    }

    // endregion

    /**
     * Called by the `CompositeBSClient` before it tries to connect to the BotSocket server.
     *
     * @param {boolean} isReconnecting if `true`, the connection attempt is an attempt to re-connect.
     */
    preConnect(isReconnecting) {
        // nothing to do
    }

    /**
     * Called by the `CompositeBSClient` after it has successfully connected to the BotSocket server.
     *
     * This method is called *before* handshaking is done with the BotSocket server,
     * meaning it is unsafe to send messages (event, query or otherwise) to the server in this method.
     */
    postConnect() {
        // nothing to do
    }

    /**
     * Called by the `CompositeBSClient` before it tries to disconnect from the BotSocket server.
     *
     * @param {number} disconnectCode the code that will be provided as the reason for disconnection.
     */
    preDisconnect(disconnectCode) {
        // nothing to do
    }

    /**
     * Called by the `CompositeBSClient` after it has been disconnected from the BotSocket server.
     *
     * @param {number} disconnectCode the code that was provided as the reason for disconnection.
     */
    postDisconnect(disconnectCode) {
        // nothing to do
    }

    /**
     * Called by the `CompositeBSClient` when the socket connection errors out.
     */
    errored() {
        // nothing to do
    }

    /**
     * Called by the `CompositeBSClient` after it has shaken hands with the BotSocket server.
     *
     * This method is called *after* the calls to {@link processServerHandshake} have been made,
     * making it safe to send messages (event, query or otherwise) to the server in this method.
     */
    postHandshake() {
        // nothing to do
    }

    /**
     * Supplements the data that's going to be sent as part of a BotSocket `ClientHandshake`.
     *
     * The value returned by the method of this method on a `Leaf` called prior to this
     * one on the bush is passed as the last parameter, and can be accessed like so:
     *
     * ```
     * const lastResult = arguments[arguments.length - 1];
     * ```
     *
     * @param {BotSocket.Protocol.Messages.ClientHandshakeData} clientHandshake
     *
     * @return {BotSocket.Protocol.Messages.ClientHandshakeData}
     */
    supplementClientHandshake(clientHandshake) {
        return clientHandshake;
    }

    /**
     * Supplements a StaMP query message that's going to be sent to the BotSocket server.
     *
     * The value returned by the method of this method on a `Leaf` called prior to this
     * one on the bush is passed as the last parameter, and can be accessed like so:
     *
     * ```
     * const lastResult = arguments[arguments.length - 1];
     * ```
     *
     * @param {StaMP.Protocol.QueryMessage} query
     *
     * @return {StaMP.Protocol.QueryMessage}
     */
    supplementStaMPQuery(query) {
        return query;
    }

    /**
     * Supplements a StaMP event message that's going to be sent to the BotSocket server.
     *
     * The value returned by the method of this method on a `Leaf` called prior to this
     * one on the bush is passed as the last parameter, and can be accessed like so:
     *
     * ```
     * const lastResult = arguments[arguments.length - 1];
     * ```
     *
     * @param {StaMP.Protocol.EventMessage} event
     *
     * @return {StaMP.Protocol.EventMessage}
     */
    supplementStaMPEvent(event) {
        return event;
    }

    /**
     * Processes the data provided by the BotSocket server as part of it's handshaking.
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     */
    processServerHandshake(serverHandshake) {
        // nothing to do
    }

    /**
     * Processes a received `render-letter` BotSocket request message.
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     */
    processRenderLetterRequest(renderLetterData) {
        // nothing to do
    }
}

module.exports = BSClientLeaf;
