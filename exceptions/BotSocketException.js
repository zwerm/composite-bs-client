const GenericException = require('./GenericException');

/**
 * Base class for all BotSocket exceptions and errors.
 *
 * If it's usually possible to recover from an error, then it's an Exception, otherwise;
 * If it's not usually possible to recover from an error, then it's an Error.
 *
 * This class is named as an Exception optimistically,
 * as it's favourable to recover whenever possible.
 *
 * @extends {GenericException}
 */
class BotSocketException extends GenericException {
    /**
     *
     * @param {string} message
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BotSocketException);
        }
    }
}

module.exports = BotSocketException;
