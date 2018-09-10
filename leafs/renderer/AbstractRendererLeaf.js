// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion
const BSClientLeaf = require('./../BSClientLeaf');

/**
 * Abstract `Leaf` that handles rendering requests received
 * during the usual operations of a `CompositeBSClient`.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {BSClientLeaf}
 * @abstract
 */
class AbstractRendererLeaf extends BSClientLeaf {
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
     * @param {?AbstractArchiverLeaf} [archiver=null] optional archiver to restore messages from upon handshaking with the server
     */
    constructor(archiver = null) {
        super();

        /**
         *
         * @type {?AbstractArchiverLeaf}
         * @private
         */
        this._archiver = archiver;
    }

    // region getters & setters
    /**
     *
     * @return {?AbstractArchiverLeaf}
     */
    get archiver() {
        return this._archiver;
    }

    // endregion
    /**
     * @inheritDoc
     */
    postHandshake() {
        if (!this.archiver) {
            return;
        } // don't do anything if we don't have an archiver

        this._renderArchiverRequests();
    }

    /**
     * Renders all the archived `render-letter` requests.
     *
     * @protected
     */
    _renderArchiverRequests() {
        this.archiver.getRequests(['render-letter'])().forEach(({ data }) => this.processRenderLetterRequest(data));
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @abstract
     */
    processRenderLetterRequest(renderLetterData) {
        throw new AbstractMethodCalledError();
    }
}

module.exports = AbstractRendererLeaf;
