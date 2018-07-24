const AbstractUserIdLeaf = require('./AbstractUserIdLeaf');

/**
 * `Leaf` that persists a userId via a browser cookie.
 *
 * @extends {AbstractUserIdLeaf}
 */
class CookieUserIdLeaf extends AbstractUserIdLeaf {
    /**
     * Sets a cookie with the given key to the given value.
     *
     * @param {string} name
     * @param {string} value
     * @param {number} [expirationTimeInMs=7*864e5]
     * @param {string} [path='/']
     */
    static setCookie(name, value, expirationTimeInMs = 7 * 864e5, path = '/') {
        const expires = new Date(Date.now() + expirationTimeInMs).toUTCString();

        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=${path}`;
    };

    /**
     * gets the value of a cookie with the given key.
     *
     * @param {string} name
     *
     * @return {string}
     */
    static getCookie(name) {
        return document.cookie.split('; ').reduce((acc, value) => value.startsWith(name) ? decodeURIComponent(value.split('=')[1]) : acc, '');
    };

    /**
     *
     * @param {string} [cookieName='bs-user-id']
     * @param {number} [expirationTimeInMs=7*864e5]
     */
    constructor(cookieName = 'bs-user-id', expirationTimeInMs = 7 * 864e5) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._cookieName = cookieName;
        /**
         *
         * @type {number}
         * @private
         */
        this._expirationTimeInMs = expirationTimeInMs;
    }

    // region getters & setters
    /**
     * @inheritDoc
     *
     * @return {?string}
     * @override
     */
    get userId() {
        return this.constructor.getCookie(this._cookieName);
    }

    /**
     * @inheritDoc
     *
     * @param {?string} userId
     * @override
     */
    set userId(userId) {
        this._commentOnUserIdType(userId);

        this.constructor.setCookie(this._cookieName, userId, this._expirationTimeInMs);
    }

    // endregion
}

module.exports = CookieUserIdLeaf;
