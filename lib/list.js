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
 * - splice (**LSET/LREM/LINSERT AFTER**)
 * - insertAfter (**LINSERT AFTER**)
 * - insertBefore (**LINSERT BEFORE**)
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
 * @module lib/list
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * Class to handle Redis LIST type
 *
 * @extends Wrapper
 */
class List extends Wrapper {

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
        return this.useJSON
            ? this.prom('lpop')().then(this.json.parse)
            : this.prom('lpop')();
    }

    /**
     * Remove and get last element
     * Command: RPOP
     *
     * @return {Promise}
     */
    pop() {
        return this.useJSON
            ? this.prom('rpop')().then(this.json.parse)
            : this.prom('rpop')();
    }

    /**
     * Push element(s) to the end of the list
     * Command: RPUSH
     *
     * @param  {String}  ...els Element(s) to push
     * @return {Promise}
     */
    push(...els) {
        return this.useJSON
            ? this.prom('rpush').apply(this, els.map(this.json.toJSON))
            : this.prom('rpush').apply(this, els);
    }

    /**
     * Prepend list with element(s)
     * Command: LPUSH
     *
     * @param  {String}  ...els Element(s) to push in the beginning
     * @return {Promise}
     */
    unshift(...els) {
        return this.useJSON
            ? this.prom('lpush').apply(this, els.reverse().map(this.json.toJSON))
            : this.prom('lpush').apply(this, els.reverse());
    }

    /**
     * Get range of elements with BEGIN-END arguments
     * Command: LRANGE
     *
     * Supports just the same interface as Array does.
     *
     * @param  {Number}  [begin=0]  Start point index
     * @param  {Number}  [end=null] End point index
     * @return {Promise}
     */
    slice(begin = 0, end = null) {

        switch (true) {
            case (end === null && begin < 0):
                end = -1;
                break;
            case (end === null && begin === 0):
                begin = 0; end = -1;
                break;
            case (end === null):
                end = -1;
                break;
            case (end !== null):
                end -= 1;
        }

        return this.useJSON
            ? this.prom('lrange')(begin, end).then(this.json.parseArray)
            : this.prom('lrange')(begin, end);
    }

    /**
     * Change the contents of an array by removing or replacing existing
     * elements and/or adding new elements in place
     * Commands: LSET, LREM, LINSERT AFTER
     *
     * @param  {Number}   [start=0]     Start index
     * @param  {Number}   [deleteCount] Number of elements to remove from "start
     * @param  {Object[]} [items]       Elements to add to the array, beginning from "start"
     * @return {Promise}
     */
    async splice(start = 0, deleteCount, ...items) {
        // Start of the transaction block
        await this.prom('multi');

        let result = new Array();

        if (deleteCount > 0 || (deleteCount == null)) {
            if (deleteCount == null) {
                result = await this.slice(start);
            } else {
                result = await this.slice(start, start + deleteCount);
            }

            // Set elements to deletion
            for (let i = start; i < start + result.length; i++) {
                await this.setElementAt(i, '__DELETE__');
            }

            // Delete elements
            await this.prom('lrem')(0, this.json.toJSON('__DELETE__'));
        }

        // Insert new items into array
        if (items.length > 0) {
            let counter = 0;

            for (const item of items) {
                await this.insertAfter(start + counter, item);

                counter++;
            }
        }

        // Execute queued commands
        await this.prom('exec');

        // Return deleted items
        return result;
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
        return this.useJSON
            ? this.prom('linsert')('after', index, this.json.toJSON(el))
            : this.prom('linsert')('after', index, el);
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
        return this.useJSON
            ? this.prom('linsert')('before', index, this.json.toJSON(el))
            : this.prom('linsert')('before', index, el);
    }

    /**
     * Get element at the given index
     * Command: LINDEX
     *
     * @param  {Number}  index Index to get element at
     * @return {Promise}
     */
    getElementAt(index) {
        return this.useJSON
            ? this.prom('lindex')(index).then(this.json.parse)
            : this.prom('lindex')(index);
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
        return this.useJSON
            ? this.prom('lset')(index, this.json.toJSON(el))
            : this.prom('lset')(index, el);
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
