/**
 * Redis HASH type wrapper
 *
 * Implemented methods:
 *
 * - size (**HLEN**)
 * - keys (**HKEYS**)
 * - delete (**HDEL**)
 * - has (**HEXISTS**)
 * - set (**HSET**)
 * - get (**HGET**)
 * - values (**HVALS**)
 * - entries (**HGETALL**)
 * - getAll (**HGETALL**)
 * - getMul (**HMGET**)
 * - setMul (**HMSET**)
 *
 * Not implemented:
 *
 * - **HINCRBY**
 * - **HINCRBYFLOAT**
 * - **HSETNX**
 * - **HSTRLEN**
 * - **HSCAN**
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * @class Hash
 * @extends Wrapper
 */
class Hash extends Wrapper {

    /**
     * Get the length of the hash (keys length)
     *
     * - Redis command: [HLEN]{@link https://redis.io/commands/hlen}
     * - JavaScript analogy: [Map.prototype.size]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size}
     *
     * @return {Promise}
     */
    size() {
        return this.call('HLEN')();
    }

    /**
     * Get array of keys in the hash
     *
     * - Redis command: [HKEYS]{@link https://redis.io/commands/hkeys}
     * - JavaScript analogy: [Map.prototype.keys]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys}
     *
     * @return {Promise}
     */
    keys() {
        return this.call('HKEYS')();
    }

    /**
     * Delete element in hash by it's key
     *
     * - Redis command: [HDEL]{@link https://redis.io/commands/hdel}
     * - JavaScript analogy: [Map.prototype.delete]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete}
     *
     * @param  {String}  key Name of the key to delete
     * @return {Promise}
     */
    delete(key) {
        return this.call('HDEL')(key);
    }

    /**
     * Check whether key exists in hash
     *
     * - Redis command: [HEXISTS]{@link https://redis.io/commands/hexists}
     * - JavaScript analogy: [Map.prototype.has]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has}
     *
     * @param  {String}  key Key to check
     * @return {Promise}
     */
    has(key) {
        return this.call('HEXISTS')(key).then((e) => !!e);
    }

    /**
     * Set value under given key
     *
     * - Redis command: [HSET]{@link https://redis.io/commands/hset}
     * - JavaScript analogy: [Map.prototype.set]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set}
     *
     * @param  {String}  key   Key to set
     * @param  {String}  value Value to set under given key
     * @return {Promise}
     */
    set(key, value) {
        return this.useJSON
            ? this.call('HSET')(key, this.json.toJSON(value))
            : this.call('HSET')(key, value);
    }

    /**
     * Get value by it's key
     *
     * - Redis command: [HGET]{@link https://redis.io/commands/hget}
     * - JavaScript analogy: [Map.prototype.get]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get}
     *
     * @param  {String} key Key to get from hash
     * @return {Promise}
     */
    get(key) {
        return this.useJSON
            ? this.call('HGET')(key).then(this.json.parse)
            : this.call('HGET')(key);
    }

    /**
     * Get array of values from the hash
     *
     * - Redis command: [HVALS]{@link https://redis.io/commands/hvals}
     * - JavaScript analogy: [Map.prototype.values]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values}
     *
     * @return {Promise}
     */
    values() {
        return this.useJSON
            ? this.call('HVALS')().then(this.json.parseArray)
            : this.call('HVALS')();
    }

    /**
     * Returns 2-dimensional array of kind:
     *
     * ```JavaScript
     * [[key1, value1], [key2, value2]]
     * ```
     * To support Object to Map transformation
     *
     * - Redis command: [HGETALL]{@link https://redis.io/commands/hgetall}
     * - JavaScript analogy: [Map.prototype.entries]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries}
     *
     * @return {Promise}
     */
    entries() {
        return this.getAll().then(function (obj) {
            if (obj === null) {
                return [];
            }

            return Object.keys(obj).map(function (key) {
                return [key, obj[key]];
            });
        });
    }

    /**
     * Get multiple keys by passing an array of keys
     * This command has no analogy in JS
     *
     * - Redis command: [HMGET]{@link https://redis.io/commands/hmget}
     * - JavaScript analogy: none
     *
     * @param  {String[]} keys Keys to get values for
     * @return {Promise}
     */
    getMul(keys) {
        return this.useJSON
            ? this.call('HMGET')(keys).then(this.json.parseArray)
            : this.call('HMGET')(keys);
    }

    /**
     * Returns object representing hash structure
     * This command has no analogy in JS
     *
     * - Redis command: [HGETALL]{@link https://redis.io/commands/hgetall}
     * - JavaScript analogy: none
     *
     * @returns {Promise}
     */
    getAll() {
        return this.useJSON
            ? this.call('HGETALL')().then(this.json.parseObjectValues)
            : this.call('HGETALL')();
    }

    /**
     * Set multiple keys by passing an object with key-value structure
     * This command has no analogy in JS
     *
     * - Redis command: [HMSET]{@link https://redis.io/commands/hmset}
     * - JavaScript analogy: none
     *
     * @param   {Object}  valuesObj Object with key-value pairs to set
     * @returns {Promise}
     */
    setMul(valuesObj) {
        return this.useJSON
            ? this.call('HMSET')(this.json.stringifyObjectValues(valuesObj))
            : this.call('HMSET')(valuesObj);
    }
}

module.exports = exports = Hash;
