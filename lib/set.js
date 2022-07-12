/**
 * Redis SET wrapper
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * Class to handle Redis SET type
 *
 * @extends Wrapper
 */
class Set extends Wrapper {

    /**
     * Add element(s) to the set
     * Command: SADD
     *
     * @param   {String[]|String} el Element or elements to add
     * @returns {Promise}
     */
    add(...el) {
        return this.call('SADD')(...el);
    }

    /**
     * Get size of the set (number of elements in it)
     * Command: SCARD
     *
     * @return {Promise}
     */
    size() {
        return this.call('SCARD')();
    }

    /**
     * Check whether element is present in a set
     * Command: SISMEMBER
     *
     * @param  {String}  el Element to check for
     * @return {Promise}
     */
    has(el) {
        return this.call('SISMEMBER')(el);
    }

    /**
     * Get all members of set as array
     * Command: SMEMBERS
     *
     * @return {Promise}
     */
    values() {
        return this.call('SMEMBERS')();
    }

    /**
     * Remove random element or number of elements from a set
     * Command: SPOP
     *
     * @param  {Number}  count Number of elements to remove
     * @return {Promise}
     */
    pop(count) {
        return this.call('SPOP')(count || 1);
    }

    /**
     * Delete element(s) from a set
     * Command: SREM
     *
     * @param  {String}  el Element(s) to remove
     * @return {Promise}
     */
    delete(...el) {
        return this.call('SREM')(el);
    }
}

module.exports = exports = Set;
