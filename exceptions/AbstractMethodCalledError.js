const GenericException = require('./GenericException');
const stack = require('callsite');

/**
 * Error that represents when a call is made on a method that's meant to be abstract.
 *
 * Because Javascript doesn't have an abstract keyword, it's possible to call methods
 * that are meant to be treated as abstract, producing unexpected results.
 *
 * Hence, any method that is to be treated as abstract should throw this error when called.
 *
 * This is an Error, as it's usually not possible to self-correct, since it's a problem with the code itself.
 *
 * @extends {GenericException}
 */
class AbstractMethodCalledError extends GenericException {
    /**
     *
     */
    constructor() {
        super(`Abstract method "${stack()[1].getFunctionName()}" was called directly`);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AbstractMethodCalledError);
        }
    }
}

module.exports = AbstractMethodCalledError;
