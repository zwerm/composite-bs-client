// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion
const BSClientLeaf = require('./../BSClientLeaf');

const { name: packageName } = require('./../../package.json');

/**
 * Abstract `Leaf` that handles archiving requests received
 * during the usual operations of a `CompositeBSClient`.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {BSClientLeaf}
 * @abstract
 */
class AbstractArchiverLeaf extends BSClientLeaf {
    /**
     *
     * @param {Array<BotSocket.Protocol.Messages.RequestType>} [requestsToArchive=[]] list of requests to archive. if empty, all requests will be archived.
     */
    constructor(
        requestsToArchive = (/** @type {Array<BotSocket.Protocol.Messages.RequestType>} */[
            'render-letter',
            'handshake'
        ])
    ) {
        super();

        /**
         *
         * @type {debug.IDebugger}
         * @private
         */
        this._logger = require('debug')(`${packageName}:${this.constructor.name}`);
        /**
         *
         * @type {Array<BotSocket.Protocol.Messages.RequestType>}
         * @private
         */
        this._requestsToArchive = requestsToArchive;
    }

    // region getters & setters
    /**
     * Gets an array of all of the requests that have been archived thus far.
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestMessage>}
     */
    get archivedRequests() {
        return this.getRequests();
    }

    /**
     * Gets a list of the types of requests that this `Leaf` will archive.
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestType>}
     */
    get requestsToArchive() {
        return [...this._requestsToArchive];
    }

    // endregion

    /**
     * Checks if this `Archiver` should archive a request of the given `requestType`.
     *
     * @param {BotSocket.Protocol.Messages.RequestType} requestType
     *
     * @return {boolean}
     */
    shouldArchiveRequest(requestType) {
        return this.requestsToArchive.length === 0 || this.requestsToArchive.includes(requestType);
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.ClientHandshakeData} clientHandshake
     *
     * @return {BotSocket.Protocol.Messages.ClientHandshakeData}
     * @override
     */
    supplementClientHandshake(clientHandshake) {
        const lastResult = arguments[arguments.length - 1];

        // make a note that this handshake is from the client side
        this.archiveIfShouldForType('handshake', Object.assign({ side: 'client' }, lastResult));

        return lastResult;
    }

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

        this.archiveIfShouldForType('submit-event', lastResult);

        return lastResult;
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.EventMessage} event
     *
     * @return {StaMP.Protocol.EventMessage}
     * @override
     */
    supplementStaMPEvent(event) {
        const lastResult = arguments[arguments.length - 1];

        this.archiveIfShouldForType('submit-event', lastResult);

        return lastResult;
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     * @override
     */
    processServerHandshake(serverHandshake) {
        // make a note that the handshake is from the server side
        this.archiveIfShouldForType('handshake', Object.assign({ side: 'server' }, serverHandshake));
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        this.archiveIfShouldForType('render-letter', renderLetterData);
    }

    /**
     * Archives a request if it's of a type that this `Leaf` has been told to archive.
     *
     * Returns `true` or `false`, based on if the request was actually archived.
     *
     * @param {BotSocket.Protocol.Messages.RequestType} request
     * @param {BotSocket.Protocol.Messages.RequestData} data
     *
     * @return {boolean}
     */
    archiveIfShouldForType(request, data) {
        if (this.shouldArchiveRequest(request)) {
            this.archive(request, data);

            return true;
        }

        this._logger(`ignoring archive request for ${request} message`, data);

        return false;
    }

    /**
     * Archives a request of the given type, with the given data.
     *
     * @param {BotSocket.Protocol.Messages.RequestType} request
     * @param {BotSocket.Protocol.Messages.RequestData} data
     */
    archive(request, data) {
        this._logger(`archiving ${request} message`, data);

        this._archiveRequest({ request, data });
    }

    /**
     * Gets all the archived requests that are of the types in `requestTypes`.
     *
     * Unless specified, this will return all the requests of the same type
     * that this `Leaf` is archiving.
     *
     * @param {Array<BotSocket.Protocol.Messages.RequestType>} [requestTypes=this.requestsToArchive]
     *
     * @return {Array<BotSocket.Protocol.Messages.RequestMessage>}
     * @abstract
     */
    getRequests(requestTypes = this.requestsToArchive) {
        throw new AbstractMethodCalledError();
    }

    /**
     * Archives the given `BotSocket` `request`.
     *
     * @param {BotSocket.Protocol.Messages.RequestMessage} request
     * @protected
     * @abstract
     */
    _archiveRequest(request) {
        throw new AbstractMethodCalledError();
    }
}

module.exports = AbstractArchiverLeaf;
