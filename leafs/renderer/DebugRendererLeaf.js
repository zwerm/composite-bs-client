const AbstractRendererLeaf = require('./AbstractRendererLeaf');

const { name: packageName } = require('./../../package.json');

/**
 * `Leaf` that renders render-letter requests to the console using `debug`.
 *
 * @extends {AbstractRendererLeaf}
 */
class DebugRendererLeaf extends AbstractRendererLeaf {
    /**
     *
     * @param {?AbstractArchiverLeaf} [archiver=null] optional archiver to restore messages from upon handshaking with the server
     * @param {string} [namespace=`${packageName}:${DebugRendererLeaf.prototype.constructor.name}`]
     */
    constructor(archiver = null, namespace = `${packageName}:${DebugRendererLeaf.prototype.constructor.name}`) {
        super(archiver);

        /**
         *
         * @type {debug.IDebugger}
         * @private
         */
        this._logger = require('debug')(namespace);
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        renderLetterData.letter.forEach(message => this.logMessage(message));
    }

    logMessage(message) {
        const from = AbstractRendererLeaf.getMessageSenderClassification(message);

        this._logger(message, from, this.getMessageSugar(message));
    }

    getMessageSugar(message) {
        switch (message.type) {
            case 'typing':
                return `${message.state === 'on' ? 'started' : 'stopped'} typing`;
            case 'text':
                return `: ${message.text}`;
            case 'image':
                return 'sent an image';
            case 'card':
                return 'sent a card';
            default:
                return 'sent a message';
        }
    }
}

module.exports = DebugRendererLeaf;
