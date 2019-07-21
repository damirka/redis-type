/**
 * Redis SET wrapper
 *
 * @module lib/set
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * @class Set
 * @classdesc Class to handle Redis SET type
 *
 * @extends module:lib/wrapper~Wrapper
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
        return this.prom('sadd')(...el);
    }

    /**
     * Get size of the set (number of elements in it)
     * Command: SCARD
     *
     * @return {Promise}
     */
    size() {
        return this.prom('scard')();
    }

    /**
     * Check whether element is present in a set
     * Command: SISMEMBER
     *
     * @param  {String}  el Element to check for
     * @return {Promise}
     */
    has(el) {
        return this.prom('sismember')(el);
    }

    /**
     * Get all members of set as array
     * Command: SMEMBERS
     *
     * @return {Promise}
     */
    values() {
        return this.prom('smembers')();
    }

    /**
     * Remove random element or number of elements from a set
     * Command: SPOP
     *
     * @param  {Number}  count Number of elements to remove
     * @return {Promise}
     */
    pop(count) {
        return this.prom('spop')(count || 1);
    }

    /**
     * Delete element(s) from a set
     * Command: SREM
     *
     * @param  {String}  el Element(s) to remove
     * @return {Promise}
     */
    delete(...el) {
        return this.prom('srem')(el);
    }
}

module.exports = exports = Set;
