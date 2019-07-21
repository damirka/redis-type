/**
 * Base class for type wrappers
 *
 * @module lib/wrapper
 */

'use strict';

const util = require('util');
const json = require('./json');

/**
 * @class Wrapper
 * @classdesc Base class for all the data wrappers in Redis
 */
class Wrapper {
    /**
     * Construct base class and all it's children with bound client
     * @param {Object} client Client to provide all the operations
     */
    constructor(client, key, useJSON = false) {
        if (!client || !(client instanceof Object)) {
            throw new Error('Expected Redis client, got: ' + client);
        }

        if (!key || !key.constructor === 'String') {
            throw new Error('Key must be a valid non-empty string');
        }

        Object.defineProperty(this, 'client',  {value: client});
        Object.defineProperty(this, 'useJSON', {value: useJSON});
        Object.defineProperty(this, 'json',    {value: json});
        Object.defineProperty(this, 'key',     {value: key});
    }

    /**
     * Return promisified version of Redis client's methods. Uses
     * util.promisify internally which is most native way of getting Promise
     *
     * As all the Redis commands have name of the key as first argument, we
     * can and do set first argument with name of the storage set
     *
     * @param  {String}   method Method to return promisified
     * @return {Function}        Promisified Redis client's method
     */
    prom(method) {
        return util.promisify(this.client[method]).bind(this.client, this.key);
    }

    /**
     * Remove any data type from global scope using **DEL** method and the key used
     * in creation. Might be used for debug cleaning up, development purposes or for
     * production cleaning of the storage
     *
     * @return {Promise} Promise resolved with **DEL** operation response
     */
    clear() {
        return util.promisify(this.client.del).bind(this.client)(this.key);
    }
}

module.exports = exports = Wrapper;
