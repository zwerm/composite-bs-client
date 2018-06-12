const ScrollToPositionOnLetterLeaf = require('./ScrollToPositionOnLetterLeaf');

/**
 * `Leaf` that scrolls to the top of an `HTMLElement`
 * when a `render-letter` request comes in.
 */
class ScrollToTopOnLetterLeaf extends ScrollToPositionOnLetterLeaf {
    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        this._scrollToPosition(0);
    }
}

module.exports = ScrollToTopOnLetterLeaf;
