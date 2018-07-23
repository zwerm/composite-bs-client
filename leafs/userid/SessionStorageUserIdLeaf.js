const AbstractUserIdLeaf = require('./AbstractUserIdLeaf');

/**
 * `Leaf` that persists a userId using {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage `sessionStorage`}.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage sessionStorage on MDN
 *
 * @extends {AbstractUserIdLeaf}
 */
class SessionStorageUserIdLeaf extends AbstractUserIdLeaf {
    /**
     *
     * @param {string} [sessionName='bs-user-id']
     */
    constructor(sessionName = 'bs-user-id') {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._sessionName = sessionName;
    }

    // region getters & setters
    /**
     * @inheritDoc
     *
     * @return {?string}
     * @override
     */
    get userId() {
        return sessionStorage.getItem(this._sessionName);
    }

    /**
     * @inheritDoc
     *
     * @param {?string} userId
     * @override
     */
    set userId(userId) {
        this._commentOnUserIdType(userId);

        sessionStorage.setItem(this._sessionName, userId);
    }

    // endregion
}

module.exports = SessionStorageUserIdLeaf;
