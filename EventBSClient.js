const AbstractBSClient = require('./AbstractBSClient');
const EventEmitter = require('events');

/**
 * A basic event-based BotSocket client, which emits status and render-letter events.
 *
 * @extends {AbstractBSClient}
 */
class EventBSClient extends AbstractBSClient {
    /**
     *
     * @param {string} bsUrl
     * @param {?string} [clientId=null] the id of the client, to allow identification and tracking server-side.
     */
    constructor(bsUrl, clientId = null) {
        super(bsUrl, clientId);

        /**
         *
         * @type {module:events.internal}
         * @private
         */
        this._eventEmitter = new EventEmitter();
    }

    // region event constants
    // region E_RENDER_STATUS
    /**
     *
     * @return {'e:render.status'}
     */
    static get E_RENDER_STATUS() {
        return 'e:render.status';
    }

    /**
     *
     * @return {'e:render.status'}
     */
    get E_RENDER_STATUS() {
        return this.constructor.E_RENDER_STATUS;
    }

    // endregion
    // region E_RENDER_LETTER
    /**
     *
     * @return {'e:render.letter'}
     */
    static get E_RENDER_LETTER() {
        return 'e:render.letter';
    }

    /**
     *
     * @return {'e:render.letter'}
     */
    get E_RENDER_LETTER() {
        return this.constructor.E_RENDER_LETTER;
    }

    // endregion
    // endregion
    // region event emitting
    /**
     * Emits an event signaling for a status message to be rendered.
     *
     * The status messages are human-friendly, and targeted as display.
     *
     * For example, status messages will be broadcast counting down to the next reconnection attempt.
     *
     * @param {string} status
     * @param {BotSocket.StatusLevel} level
     *
     * @fires EventBSClient#E_RENDER_STATUS
     * @private
     */
    _emitRenderStatus(status, level) {
        /**
         * @event EventBSClient#E_RENDER_STATUS
         * @type {object}
         * @property {string} E_RENDER_STATUS:status
         * @property {BotSocket.StatusLevel} E_RENDER_STATUS:level
         */
        this._eventEmitter.emit(this.constructor.E_RENDER_STATUS, { status, level });
    }

    /**
     * Emits an event signaling for a StaMP letter (a collection of messages) to be rendered.
     *
     * @param {StaMP.Protocol.Letter} letter
     *
     * @fires EventBSClient#E_RENDER_LETTER
     * @private
     */
    _emitRenderLetter(letter) {
        /**
         * @event EventBSClient#E_RENDER_LETTER
         * @type {object}
         * @property {StaMP.Protocol.Letter} E_RENDER_LETTER:letter
         */
        this._eventEmitter.emit(this.constructor.E_RENDER_LETTER, { letter });
    }

    // endregion
    // region event binding
    /**
     * Binds a listener for an event.
     *
     * @param {'e:render.status'|'e:render.letter'|string} type
     * @param {function} listener
     *
     * @return {EventBSClient}
     */
    on(type, listener) {
        this._eventEmitter.on(type, listener);

        return this;
    }

    /**
     * Unbinds a listener for an event.
     *
     * @param {'e:render.status'|'e:render.letter'|string} type
     * @param {function} listener
     *
     * @return {EventBSClient}
     */
    off(type, listener) {
        this._eventEmitter.removeListener(type, listener);

        return this;
    }

    // endregion

    /**
     * @inheritDoc
     *
     * @param {string} status
     * @param {BotSocket.StatusLevel} level
     * @protected
     * @override
     */
    _renderStatusUpdate(status, level) {
        this._emitRenderStatus(status, level);
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.Letter} letter
     * @protected
     * @override
     */
    _renderLetter(letter) {
        this._emitRenderLetter(letter);
    }
}

module.exports = EventBSClient;
