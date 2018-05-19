const { EventEmitter } = require('events');

const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that emits render letter events when `render-letter` requests come in.
 *
 * @extends {BSClientLeaf}
 */
class EmitLetterMessageEventsLeaf extends BSClientLeaf {
    /**
     *
     * @param {module:events.internal.EventEmitter} [emitter = new EventEmitter()]
     */
    constructor(emitter = new EventEmitter()) {
        super();

        /**
         *
         * @type {module:events.internal.EventEmitter}
         * @protected
         */
        this._emitter = emitter;
    }

    // region event constants
    // region E_RENDER_LETTER
    /**
     *
     * @return {'e:render.letter'}
     */
    static get E_RENDER_LETTER() {
        return 'e:render.letter';
    }

    // endregion
    // endregion
    // region getters & setters
    /**
     *
     * @return {module:events.internal.EventEmitter}
     */
    get emitter() {
        return this._emitter;
    }

    // endregion
    // region event emitting
    // region E_RENDER_LETTER
    /**
     * Emits an event signaling for a StaMP letter (a collection of messages) to be rendered.
     *
     * @param {StaMP.Protocol.Letter} letter
     *
     * @fires EmitLetterMessageEventsLeaf#E_RENDER_LETTER
     * @private
     */
    _emitRenderLetter(letter) {
        /**
         * @event EmitLetterMessageEventsLeaf#E_RENDER_LETTER
         * @type {object}
         * @property {StaMP.Protocol.Letter} E_RENDER_LETTER:letter
         */
        this.emitter.emit(this.constructor.E_RENDER_LETTER, { letter });
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        this._emitRenderLetter(renderLetterData.letter);
    }
}

module.exports = EmitLetterMessageEventsLeaf;
