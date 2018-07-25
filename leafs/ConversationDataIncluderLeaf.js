const BSClientLeaf = require('./BSClientLeaf');

/**
 * `Leaf` that handles including the conversation `store` & `context`
 * on all messages that get sent by the client.
 *
 * @extends {BSClientLeaf}
 */
class ConversationDataIncluderLeaf extends BSClientLeaf {
    /**
     *
     * @param {string} [conversationContext='']
     * @param {Object} [conversationStore={}]
     */
    constructor(conversationContext = '', conversationStore = {}) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._conversationContext = conversationContext;
        /**
         *
         * @type {Object}
         * @private
         */
        this._conversationStore = conversationStore;
    }

    // region getters & setters
    // region conversationContext (get & set)
    /**
     *
     * @return {string}
     */
    get conversationContext() {
        return this._conversationContext;
    }

    /**
     *
     * @param {string} conversationContext
     */
    set conversationContext(conversationContext) {
        this._conversationContext = conversationContext;
    }

    // endregion
    // region conversationStore (get & set)
    /**
     *
     * @return {Object}
     */
    get conversationStore() {
        return this._conversationStore;
    }

    /**
     *
     * @param {Object} conversationStore
     */
    set conversationStore(conversationStore) {
        this._conversationStore = conversationStore;
    }

    // endregion
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

        this._commentOnUserIdType(this.userId);

        return Object.assign(
            {},
            query,
            lastResult,
            {
                data: Object.assign(
                    {},
                    query.data,
                    lastResult ? lastResult.data : null,
                    this._buildConversationObject()
                )
            }
        );
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

        this._commentOnUserIdType(this.userId);

        return Object.assign(
            {},
            event,
            lastResult,
            {
                data: Object.assign(
                    {},
                    event.data,
                    lastResult ? lastResult.data : null,
                    this._buildConversationObject()
                )
            }
        );
    }

    /**
     * Builds a conversation object, to be merged into the data property of a message.
     *
     * @return {{conversationContext: string, conversationStore: Object}}
     * @private
     */
    _buildConversationObject() {
        return {
            conversationContext: this._conversationContext,
            conversationStore: this._conversationStore
        };
    }
}

module.exports = ConversationDataIncluderLeaf;
