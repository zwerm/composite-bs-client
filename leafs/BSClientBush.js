const BSClientLeaf = require('./BSClientLeaf');

/**
 *
 */
class BSClientBush extends BSClientLeaf {
    /**
     *
     * @param {CompositeBSClient} compositeBSClient
     */
    constructor(compositeBSClient) {
        super();

        /**
         *
         * @type {CompositeBSClient}
         * @private
         */
        this._compositeBSClient = compositeBSClient;
        /**
         *
         * @type {Array<BSClientLeaf>}
         * @private
         */
        this._leafs = [];

        Object.getOwnPropertyNames(BSClientLeaf.prototype)
              .filter(methodName => methodName !== 'constructor')
              .forEach(methodName => this[methodName] = (...methodArgs) => this._callMethodOverBranch(methodName, methodArgs));
    }

    // region getters & setters
    /**
     *
     * @return {CompositeBSClient}
     */
    get bsClient() {
        return this._compositeBSClient;
    }

    // endregion

    /**
     * Registers a {@link BSClientLeaf} on this `BSClientBush`.
     *
     * @param {BSClientLeaf} leaf
     */
    registerLeaf(leaf) {
        this._leafs.push(leaf);

        leaf.register(this);
    }

    /**
     * Deregisters a {@link BSClientLeaf} from this `BSClientBush`.
     *
     * @param {BSClientLeaf} leaf
     */
    deregisterLeaf(leaf) {
        this._leafs = this._leafs.filter(aLeaf => aLeaf !== leaf);

        leaf.deregister();
    }

    /**
     * Calls a method over a branch of {@link BSClientLeaf}s, returning the results of the last leaf.
     *
     * If no leafs override the given method, then {@link BSClientLeaf}s default implementation of the method is called via `super`.
     *
     * @param {string} methodName
     * @param {Array} methodArgs
     *
     * @return {*}
     * @private
     */
    _callMethodOverBranch(methodName, methodArgs) {
        const methodBranch = this._buildMethodBranch(methodName);

        return methodBranch.length
            ? methodBranch.reduce((i, leaf) => leaf[methodName](...methodArgs, i), null)
            : super[methodName](...methodArgs);
    }

    /**
     * Builds a branch of {@link BSClientLeaf}s who have custom overrides of a given method.
     *
     * @param {string} methodName
     *
     * @return {Array<BSClientLeaf>}
     * @private
     */
    _buildMethodBranch(methodName) {
        if (!methodName in this) {
            throw new Error(`bad method name (${methodName})`);
        }

        return this._leafs.filter(leaf => leaf[methodName] !== BSClientLeaf.prototype[methodName]);
    }
}

module.exports = BSClientBush;
