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
     * @param {number} [days=7]
     * @param {string} [path='/']
     */
    static setCookie(name, value, days = 7, path = '/') {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();

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
     */
    constructor(cookieName = 'bs-user-id') {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._cookieName = cookieName;
    }

    // region getters & setters
    /**
     *
     * @return {?string}
     */
    get userId() {
        return this.constructor.getCookie(this._cookieName);
    }

    /**
     *
     * @param {?string} userId
     */
    set userId(userId) {
        this._commentOnUserIdType(userId);

        this.constructor.setCookie(this._cookieName, userId);
    }

    // endregion
}

module.exports = CookieUserIdLeaf;
