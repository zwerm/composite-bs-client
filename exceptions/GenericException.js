const stack = require('callsite');

/**
 * Base class for all generic exceptions and errors.
 *
 * If it's usually possible to recover from an error, then it's an Exception, otherwise;
 * If it's not usually possible to recover from an error, then it's an Error.
 *
 * This class is named as an Exception optimistically,
 * as it's favourable to recover whenever possible.
 */
class GenericException extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GenericException);
        }

        /**
         *
         * @type {Date}
         * @protected
         */
        this._timestamp = new Date();
    }

    // region getters & setters
    /**
     *
     * @return {string}
     */
    get name() {
        return stack()[0].getTypeName();
    }

    /**
     *
     * @return {Date}
     */
    get timestamp() {
        return this._timestamp;
    }

    // endregion
}

module.exports = GenericException;
