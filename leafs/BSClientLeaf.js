const moment = require('moment');

/**
 *
 */
class BSClientLeaf {
    constructor() {
        /**
         *
         * @type {?BSClientBush}
         * @private
         */
        this._bush = null;
    }

    // region register & deregister
    /**
     *
     * @param {BSClientBush} bush
     */
    register(bush) {
        this._bush = bush;
    }

    /**
     *
     */
    deregister() {
        this._bush = null;
    }

    // endregion

    /**
     *
     * @param {boolean} isReconnecting
     */
    preConnect(isReconnecting) {
        // nothing to do
    }

    /**
     *
     */
    postConnect() {
        // nothing to do
    }

    /**
     * @param {number} disconnectCode
     */
    preDisconnect(disconnectCode) {
        // nothing to do
    }

    /**
     *
     * @param {number} disconnectCode
     */
    postDisconnect(disconnectCode) {
        // nothing to do
    }

    /**
     *
     */
    errored() {
        // nothing to do
    }

    /**
     * Processes the data returned by the BotSocket server as part of it's handshaking.
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     */
    processServerHandshake(serverHandshake) {
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
     * @param {StaMP.Protocol.Messages.StandardisedQueryMessage} query
     *
     * @return {StaMP.Protocol.Messages.StandardisedQueryMessage}
     */
    supplementStaMPQuery(query) {
        return query;
    }

    /**
     * Renders a StaMP Letter - a collection of StaMP messages.
     *
     * @param {StaMP.Protocol.Letter} letter
     */
    renderLetter(letter) {
        // nothing to do
    }

    /**
     * Renders status update messages.
     *
     * @param {string} status
     * @param {BotSocket.StatusLevel} level
     */
    renderStatus(status, level) {
        // nothing to do
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

module.exports = BSClientLeaf;
