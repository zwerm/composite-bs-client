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
    // region archiver (get & set)
    /**
     *
     * @return {?AbstractArchiverLeaf}
     */
    get archiver() {
        return this._archiver;
    }

    /**
     *
     * @param {?AbstractArchiverLeaf} archiver
     */
    set archiver(archiver) {
        this._archiver = archiver;
    }

    // endregion
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
     * Renders all the requests returned by the {@link #_getArchiverRequestsToRender `#_getArchiverRequestsToRender`} method.
     *
     * @protected
     */
    _renderArchiverRequests() {
        this._getArchiverRequestsToRender().forEach(({ data }) => this.processRenderLetterRequest(data));
    }

    /**
     * Gets all the requests that should be rendered from the `AbstractArchiverLeaf`.
     *
     * By default, this method just returns all the archived `render-letter` requests.
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestMessage>}
     * @protected
     */
    _getArchiverRequestsToRender() {
        return this.archiver.getRequests(['render-letter']);
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
