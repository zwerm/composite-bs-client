const Leaf = require('./Leaf');

/**
 *
 */
class CompositeBush extends Leaf {
    constructor() {
        super();

        /**
         *
         * @type {Array<Leaf>}
         * @private
         */
        this._leafs = [];

        // this._methodsBranches = ;
        Object.getOwnPropertyNames(Leaf.prototype)
              .filter(methodName => methodName !== 'constructor')
              .forEach(methodName => this[methodName] = (...methodArgs) => this._callMethodOverBranch(methodName, methodArgs));
    }

    /**
     * Registers a {@link Leaf} on this `CompositeBush`.
     *
     * @param {Leaf} leaf
     */
    registerLeaf(leaf) {
        this._leafs.push(leaf);
    }

    /**
     * Deregisters a {@link Leaf} from this `CompositeBush`.
     *
     * @param {Leaf} leaf
     */
    deregisterLeaf(leaf) {
        this._leafs = this._leafs.filter(aLeaf => aLeaf !== leaf);
    }

    /**
     * Calls a method over a branch of {@link Leaf}s, returning the results of the last leaf.
     *
     * If no leafs override the given method, then {@link Leaf}s default implementation of the method is called via `super`.
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
            ? methodBranch.reduce((i, leaf) => leaf[methodName](...methodArgs), null)
            : super[methodName](...methodArgs);
    }

    /**
     * Builds a branch of {@link Leaf}s who have custom overrides of a given method.
     *
     * @param {string} methodName
     *
     * @return {Array<Leaf>}
     * @private
     */
    _buildMethodBranch(methodName) {
        if (!methodName in this) {
            throw new Error(`bad method name (${methodName})`);
        }

        return this._leafs.filter(leaf => leaf[methodName] !== Leaf.prototype[methodName]);
    }
}

module.exports = CompositeBush;
