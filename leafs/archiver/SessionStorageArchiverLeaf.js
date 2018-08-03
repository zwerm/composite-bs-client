const AbstractArchiverLeaf = require('./AbstractArchiverLeaf');

/**
 * `Leaf` that archives messages using {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage `sessionStorage`}.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage sessionStorage on MDN
 *
 * @extends {AbstractArchiverLeaf}
 */
class SessionStorageArchiverLeaf extends AbstractArchiverLeaf {
    /**
     *
     * @param {Array<BotSocket.Protocol.Messages.RequestType>} [requestsToArchive=['render-letter', 'handshake']] list of requests to archive.
     * @param {string} [archiveName='bs-request-archive']
     */
    constructor(
        requestsToArchive = (/** @type {Array<BotSocket.Protocol.Messages.RequestType>} */[
            'render-letter',
            'handshake'
        ]),
        archiveName = 'bs-request-archive'
    ) {
        super(requestsToArchive);

        /**
         *
         * @type {string}
         * @private
         */
        this._archiveName = archiveName;
    }

    // region getters & setters
    /**
     * @inheritDoc
     *
     * @return {string}
     */
    get archiveName() {
        return this._archiveName;
    }

    // endregion

    /**
     * Loads all of the archived requests from `sessionStorage`.
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestMessage>}
     * @private
     */
    _loadRequests() {
        return JSON.parse(sessionStorage.getItem(this.archiveName)) || [];
    }

    /**
     * @inheritDoc
     *
     * @param {Array<BotSocket.Protocol.Messages.RequestType>} [requestTypes=this.requestsToArchive]
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestMessage>}
     * @override
     */
    getRequests(requestTypes = this.requestsToArchive) {
        const requests = this._loadRequests();

        return requests.filter(request => requestTypes.includes(request.request));
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RequestMessage} request
     * @protected
     * @override
     */
    _archiveRequest(request) {
        sessionStorage.setItem(this.archiveName, JSON.stringify([...this.getRequests(), request]));
    }
}

module.exports = SessionStorageArchiverLeaf;
