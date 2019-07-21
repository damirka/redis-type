/**
 * Hash wrapper
 *
 * @module lib/hash
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * @class Hash
 * @extends module:lib/wrapper~Wrapper
 */
class Hash extends Wrapper {
    /**
     * Get array of keys in the hash
     * Command: HKEYS
     *
     * @return {Promise}
     */
    keys() {
        return this.prom('hkeys')();
    }

    /**
     * Delete element in hash by it's key
     * Command: HDEL
     *
     * @param  {String}  key Name of the key to delete
     * @return {Promise}
     */
    delete(key) {
        return this.prom('hdel')(key);
    }

    /**
     * Check whether key exists in hash
     * Command: HEXISTS
     *
     * @param  {String}  key Key to check
     * @return {Promise}     [description]
     */
    has(key) {
        return this.prom('hexists')(key).then((e) => !!e);
    }

    /**
     * Set value under given key
     * Command: HSET
     *
     * @param  {String}  key   Key to set
     * @param  {String}  value Value to set under given key
     * @return {Promise}
     */
    set(key, value) {
        return this.useJSON
            ? this.prom('hset')(key, this.json.toJSON(value))
            : this.prom('hset')(key, value);
    }

    /**
     * Get value by it's key
     * Command: HGET
     *
     * @param  {String} key Key to get from hash
     * @return {Promise}
     */
    get(key) {
        return this.useJSON
            ? this.prom('hget')(key).then(this.json.parse)
            : this.prom('hget')(key);
    }

    /**
     * Get multiple keys by passing an array of keys
     * Command: HMGET
     *
     * @param  {String[]} keys Keys to get values for
     * @return {Promise}
     */
    getMul(keys) {
        return this.useJSON
            ? this.prom('hmget')(keys).then(this.json.parseArray)
            : this.prom('hmget')(keys);
    }

    /**
     * Returns object representing hash structure
     * Command: HGETALL
     *
     * @returns {Promise}
     */
    getAll() {
        return this.useJSON
            ? this.prom('hgetall')().then(this.json.parseObjectValues)
            : this.prom('hgetall')();
    }

    /**
     * Set multiple keys by passing an object with key-value structure
     * Command: HMSET
     *
     * @param   {Object}  valuesObj Object with key-value pairs to set
     * @returns {Promise}
     */
    setMul(valuesObj) {
        return this.useJSON
            ? this.prom('hmset')(this.json.stringifyObjectValues(valuesObj))
            : this.prom('hmset')(valuesObj);
    }

    /**
     * Get the length of the hash (keys length)
     * Command: HLEN
     *
     * @return {Promise}
     */
    length() {
        return this.prom('hlen')();
    }

    /**
     * Get array of values from the hash
     * Command: HVALS
     *
     * @return {Promise}
     */
    values() {
        return this.useJSON
            ? this.prom('hvals')().then(this.json.parseArray)
            : this.prom('hvals')();
    }

    /**
     * Returns 2-dimensional array of kind:
     * ```
     * [[key1, value1], [key2, value2]]
     * ```
     * To support hash to Map API transformation
     * Command: HGETALL
     *
     * @return {Promise}
     */
    entries() {
        return this.getAll().then(function (obj) {
            return Object.keys(obj).map(function (key) {
                return [key, obj[key]];
            });
        });
    }
}

module.exports = exports = Hash;
