const ScrollToPositionOnLetterLeaf = require('./ScrollToPositionOnLetterLeaf');

/**
 * `Leaf` that scrolls to the bottom of an `HTMLElement`
 * when a `render-letter` request comes in.
 */
class ScrollToBottomOnLetterLeaf extends ScrollToPositionOnLetterLeaf {
    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        this._scrollToPosition(this.scrollElement.scrollHeight);
    }
}

module.exports = ScrollToBottomOnLetterLeaf;
