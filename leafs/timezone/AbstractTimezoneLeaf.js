// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion

const Leaf = require('./../Leaf');

/**
 * Abstract `Leaf` that handles managing & providing a `timezone` as and
 * when required during the usual operations of a BotSocket Client.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {Leaf}
 * @abstract
 */
class AbstractTimezoneLeaf extends Leaf {
    // region getters & setters
    /**
     * Gets the current timezone the BSClient is in.
     *
     * @return {string}
     * @abstract
     */
    get timezone() {
        throw new AbstractMethodCalledError();
    }

    // endregion

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.QueryMessage} query
     *
     * @return {StaMP.Protocol.QueryMessage}
     * @override
     */
    supplementStaMPQuery(query) {
        const lastResult = arguments[arguments.length - 1];

        return Object.assign(
            {},
            query,
            lastResult,
            { timezone: this.timezone }
        );
    }
}

module.exports = AbstractTimezoneLeaf;
