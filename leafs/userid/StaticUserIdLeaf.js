const AbstractUserIdLeaf = require('./AbstractUserIdLeaf');

/**
 * `Leaf` that simply uses a static user id,
 * that can be changed with getters & setters.
 *
 * @extends {AbstractUserIdLeaf}
 */
class StaticUserIdLeaf extends AbstractUserIdLeaf {
    /**
     *
     * @param {?string} [userId=null]
     */
    constructor(userId = null) {
        super();

        /**
         *
         * @type {?string}
         * @private
         */
        this._userId = userId;
    }

    // region getters & setters
    /**
     * @inheritDoc
     *
     * @return {?string}
     */
    get userId() {
        return this._userId;
    }

    /**
     * @inheritDoc
     *
     * @param {?string} userId
     */
    set userId(userId) {
        this._commentOnUserIdType(userId);

        this._userId = userId;
    }

    // endregion
}

module.exports = StaticUserIdLeaf;
