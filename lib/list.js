/**
 * Redis LIST type wrapper
 *
 * Implemented methods:
 *
 * - length (**LLEN**)
 * - shift (**LPOP**)
 * - pop (**RPOP**)
 * - push (**RPUSHX**)
 * - unshift (**LPUSHX**)
 * - slice (**LRANGE**)
 * - insertAfter (**LINSERT AFTER**)
 * - insertBefore (**LINSERT BEFOR**)
 * - getElementAt (**LINDEX**)
 * - setElementAt (**LSET**)
 * - trim (**LTRIM**)
 *
 *
 * Not implemented:
 *
 * - **BLPOP**
 * - **BRPOP**
 * - **LPUSH** (**LPUSHX** used instead)
 * - **RPUSH** (**RPUSHX** used instead)
 * - **RPOPLPUSH**
 *
 *
 * @module lib/list
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * Class to handle Redis LIST type
 *
 * @extends module:lib/wrapper~Wrapper
 */
class List extends Wrapper
{
    /**
     * Get length of a list
     * Command: LLEN
     *
     * @return {Promise}
     */
    length() {
        return this.prom('llen')();
    }

    /**
     * Remove and get first element
     * Command: LPOP
     *
     * @return {Promise}
     */
    shift() {
        return this.prom('lpop')();
    }

    /**
     * Remove and get last element
     * Command: RPOP
     *
     * @return {Promise}
     */
    pop() {
        return this.prom('rpop')();
    }

    /**
     * Push element(s) to the end of the list
     * Command: RPUSH
     *
     * @param  {String}  el Element to push
     * @return {Promise}
     */
    push(el) {
        return this.prom('rpush')(el);
    }

    /**
     * Prepend list with element(s)
     * Command: LPUSH
     *
     * @param  {String}  el Element to push in the beginning
     * @return {Promise}
     */
    unshift(el) {
        return this.prom('lpush')(el);
    }

    /**
     * Get ramge of elements with BEGIN-END arguments
     * Command: LRANGE
     *
     * @param  {Number}  begin Start point index
     * @param  {Number}  end   End point index
     * @return {Promise}
     */
    slice(begin, end) {
        return this.prom('lrange')(begin, end);
    }

    /**
     * Insert element after the element with given index
     * Command: LINSERT AFTER
     *
     * @param  {Number}  index Index to insert after
     * @param  {String}  el    Element to insert
     * @return {Promise}
     */
    insertAfter(index, el) {
        return this.prom('linsert')('after', index, el);
    }

    /**
     * Insert elenent before the elemnt with given index
     * Command: LINSERT BEFORE
     *
     * @param  {Number}  index Index to insert after
     * @param  {String}  el    Element to insert
     * @return {Promise}
     */
    insertBefore(index, el) {
        return this.prom('linsert')('before', index, el);
    }

    /**
     * Get element at the given index
     * Command: LINDEX
     *
     * @param  {Number}  index Index to get element at
     * @return {Promise}
     */
    getElementAt(index) {
        return this.prom('lindex')(index);
    }

    /**
     * Set element at given index
     * Command: LSET
     *
     * @param  {Number}  index Index to set el at
     * @param  {String}  el    Element to set
     * @return {Promise}
     */
    setElementAt(index, el) {
        return this.prom('lset', index, el);
    }

    /**
     * Trim list in the given begin-end range
     * Command: LTRIM
     *
     * @param  {Number}  begin Start index
     * @param  {Number}  end   End index
     * @return {Promise}
     */
    trim(begin, end) {
        return this.prom('ltrim')(begin, end);
    }
}

module.exports = exports = List;