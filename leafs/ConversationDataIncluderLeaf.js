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
     * @param {string} [context='']
     * @param {Object} [conversationStore={}]
     * @param {boolean} [persist=true]
     * @param {string} [contextSessionName='bs-conversation-context']
     * @param {string} [storeSessionName='bs-conversation-store']
     */
    constructor(
        context = '',
        conversationStore = {},
        persist = true,
        {
            contextSessionName = 'bs-conversation-context',
            storeSessionName = 'bs-conversation-store'
        }
    ) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._context = context;
        /**
         *
         * @type {Object}
         * @private
         */
        this._conversationStore = conversationStore;
        /**
         *
         * @type {boolean}
         * @private
         */
        this._persist = persist;
        /**
         *
         * @type {string}
         * @private
         */
        this._contextSessionName = contextSessionName;
        /**
         *
         * @type {string}
         * @private
         */
        this._storeSessionName = storeSessionName;

    }

    // region getters & setters
    // region context (get & set)
    /**
     *
     * @return {string}
     */
    get context() {
        return this._persist
            ? sessionStorage.getItem(this._contextSessionName)
            : this._context;
    }

    /**
     *
     * @param {string} context
     */
    set context(context) {
        this._persist
            ? sessionStorage.setItem(this._contextSessionName, context)
            : this._context = context;
    }

    // endregion
    // region conversationStore (get & set)
    /**
     *
     * @return {Object}
     */
    get conversationStore() {
        return this._persist
            ? JSON.parse(sessionStorage.getItem(this._storeSessionName))
            : this._conversationStore;
    }

    /**
     *
     * @param {Object} conversationStore
     */
    set conversationStore(conversationStore) {
        this._persist
            ? sessionStorage.setItem(this._storeSessionName, JSON.stringify(conversationStore))
            : this._conversationStore = conversationStore;
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
     * @return {{context: string, conversationStore: Object}}
     * @private
     */
    _buildConversationObject() {
        return {
            context: this._context,
            conversationStore: this._conversationStore
        };
    }
}

module.exports = ConversationDataIncluderLeaf;
