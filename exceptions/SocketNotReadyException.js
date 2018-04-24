const GenericException = require('./GenericException');

/**
 * Exception that represents when a call is made for an action to take place
 * on a socket that isn't ready for use, usually because it's not connected.
 *
 * This Exception is usually recoverable, and should be caught & handled, rather than left to bring down the whole system.
 *
 * @extends {GenericException}
 */
class SocketNotReadyException extends GenericException {
    /**
     * Humanizes a socket ready state value into a string.
     *
     * @param {number} socketReadyState
     *
     * @return {string}
     * @static
     */
    static humanizeSocketReadyState(socketReadyState) {
        switch (socketReadyState) {
            case WebSocket.CONNECTING:
                return 'the connection is not yet open';
            case WebSocket.OPEN:
                return 'the connection is open and ready to communicate';
            case WebSocket.CLOSING:
                return 'the connection is in the process of closing';
            case WebSocket.CLOSED:
                return 'the connection is closed or couldn\'t be opened';
            default:
                return 'not a clue';
        }
    }

    /**
     *
     * @param {number} socketReadyState
     */
    constructor(socketReadyState) {
        super(`Unable to use socket, as ${SocketNotReadyException.humanizeSocketReadyState(socketReadyState)}`);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SocketNotReadyException);
        }

        /**
         *
         * @type {number}
         * @private
         */
        this._socketReadyState = socketReadyState;
    }

    // region getters & setters
    /**
     *
     * @return {number}
     */
    get socketReadyState() {
        return this._socketReadyState;
    }

    // endregion
}

module.exports = SocketNotReadyException;
