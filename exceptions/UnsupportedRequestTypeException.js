const BotSocketException = require('./BotSocketException');

/**
 * Exception that represents when a BotSocket message has a request type
 * that's not currently supported by the receiving client.
 *
 * This Exception is usually recoverable, and should be caught & handled, rather than left to bring down the whole system.
 *
 * @extends {BotSocketException}
 *
 * @template BotSocketMessageType
 */
class UnsupportedRequestTypeException extends BotSocketException {
    /**
     *
     * @param {BotSocket.Protocol.Messages.StandardRequest} receivedMessage
     */
    constructor(receivedMessage) {
        super(`request type ${receivedMessage.request} is currently not supported`);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnsupportedRequestTypeException);
        }

        /**
         *
         * @type {BotSocketMessageType & BotSocket.Protocol.Messages.StandardRequest}
         * @private
         */
        this._receivedMessage = receivedMessage;
    }

    // region getters & setters
    /**
     *
     * @return {BotSocketMessageType & BotSocket.Protocol.Messages.StandardRequest}
     */
    get receivedMessage() {
        return this._receivedMessage;
    }

    // endregion
}

module.exports = UnsupportedRequestTypeException;
