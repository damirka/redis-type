/**
 * Base class for type wrappers
 *
 */

'use strict';

const util = require('util');
const json = require('./json');

/**
 * @class Wrapper
 * Base class for all the data wrappers in Redis
 */
class Wrapper {

    /**
     * Construct base class and all it's children with bound client
     *
     * @param {Object}  client          Client to provide all the operations
     * @param {String}  key             Name of the key under which the Redis structure is stored
     * @param {Boolean} [useJSON=false] Whether information in this structure should be stored as JSON
     */
    constructor(client, key, useJSON = false) {
        if (!client || !(client instanceof Object)) {
            throw new Error('Expected Redis client, got: ' + client);
        }

        if (!key || !key.constructor === 'String') {
            throw new Error('Key must be a valid non-empty string');
        }

        Object.defineProperties(this, {
            useJSON: {value: useJSON},
            client:  {value: client},
            json:    {value: json},
            key:     {value: key}
        });
    }

    /**
     * Return promisified version of Redis client's methods. Uses
     * util.promisify internally which is most native way of getting Promise
     *
     * As all Redis commands have name of the key as first argument, we
     * can and do set first argument with name/key of the storage/structure
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
