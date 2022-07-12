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
 */

'use strict';

const Wrapper = require('./wrapper');

/**
 * Class to handle Redis LIST type.
 *
 * Behaves the same way as Array does so use it just like you would use Array, with some exceptions of course
 *
 * @example
 * const client = require('redis').createClient();
 * const types  = require('redis-type')(client);
 *
 * const list = new types.List('my_list', true); // last flag for JSON=true
 *
 * (async () => {
 *
 *   await list.push({a: 1}, {a: 2}, {a: 3});
 *
 *   console.log(await list.slice()); // get list contents
 *
 *   const lastEl = await list.pop();
 *
 *   console.log(await list.slice()); // [{a: 1}, {a: 2}];
 *
 *   await list.setElementAt(0, lastEl);
 *
 *   console.log(await list.slice()); // [{a: 3}, {a: 2}];
 *
 * })();
 *
 * @extends Wrapper
 */
class List extends Wrapper {

    /**
     * Get length of a list
     *
     * - Redis command: [LLEN]{@link https://redis.io/commands/llen}
     * - JavaScript analogy: [Array.length]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length}
     *
     * @example
     * (async () => {
     *
     *   let len = await list.length();
     *
     * })()
     *
     * @return {Promise<Number>} Length of the list
     */
    length() {
        return this.call('LLEN')();
    }

    /**
     * Remove and get first element of the list
     *
     * - Redis command: [LPOP]{@link https://redis.io/commands/lpop}
     * - JavaScript analogy: [Array.prototype.shift]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift}
     *
     * @example
     * (async () => {
     *
     *   await list.push(1, 2, 3);       // fill list with values
     *   let first = await list.shift(); // gonna be 1 and list will contain [2, 3]
     *
     * })()
     *
     * @return {Promise<Object|String>} Shifted value (Object when useJSON=true or String)
     */
    shift() {
        return this.useJSON
            ? this.call('LPOP')().then(this.json.parse)
            : this.call('LPOP')();
    }

    /**
     * Remove and get last element
     *
     * - Redis command: [RPOP]{@link https://redis.io/commands/rpop}
     * - JavaScript analogy: [Array.prototype.pop]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop}
     *
     * @example
     * (async () => {
     *
     *   await list.push(1, 2, 3);    // fill list with values
     *   let last = await list.pop(); // gonna be 3 and list will contain [1, 2]
     *
     * })()
     *
     * @return {Promise<Object|String>} Popped value (Object when useJSON=true or String)
     */
    pop() {
        return this.useJSON
            ? this.call('RPOP')().then(this.json.parse)
            : this.call('RPOP')();
    }

    /**
     * Prepend list with element(s)
     *
     * - Redis command: [LPUSH]{@link https://redis.io/commands/lpush}
     * - JavaScript analogy: [Array.prototype.unshift]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift}
     *
     * @example
     * (async () => {
     *
     *   await list.unshift(1);    // list [1]
     *   await list.unshift(3, 2); // list [3, 2, 1] - just like an Array in JS
     *
     * })()
     *
     * @param  {String}  ...els Element(s) to push in the beginning
     * @return {Promise}
     */
    unshift(...els) {
        return this.useJSON
            ? this.call('LPUSH').apply(this, els.reverse().map(this.json.toJSON))
            : this.call('LPUSH').apply(this, els.reverse());
    }

    /**
     * Push element(s) to the end of the list
     *
     * - Redis command: [RPUSH]{@link https://redis.io/commands/rpush}
     * - JavaScript analogy: [Array.prototype.push]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push}
     *
     * @example
     * (async () => {
     *
     *   await list.push(1, 2, 3, 4); // return value: 4
     *   await list.push(1);          // return value: 5
     *
     * })();
     *
     * @param  {String}         ...els Element(s) to push
     * @return {Promise<Number>}       Resulting length of the list
     */
    push(...els) {
        return this.useJSON
            ? this.call('RPUSH').apply(this, els.map(this.json.toJSON))
            : this.call('RPUSH').apply(this, els);
    }


    /**
     * Get range of elements with BEGIN-END arguments
     *
     * - Redis command: [LRANGE]{@link https://redis.io/commands/lrange}
     * - JavaScript analogy: [Array.prototype.slice]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice}
     *
     * Supports just the same interface as Array does.
     *
     * @example
     * (async () => {
     *
     *   await list.push(1, 2, 3, 4, 5);
     *
     *   let one   = await list.slice();    // gonna be [1, 2, 3, 4, 5]
     *   let two   = await list.slice(1);   // gonna be [2, 3, 4, 5]
     *   let three = await list.slice(-2);  // gonna be [4, 5]
     *   let four  = await list.slice(1, 3) // gonna be [2, 3]
     *
     * })()
     *
     * @param  {Number}         [begin=0]  Start point index
     * @param  {Number}         [end=null] End point index
     * @return {Promise<Array>}            Resulting slice of List for given params
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
            ? this.call('LRANGE')(begin, end).then(this.json.parseArray)
            : this.call('LRANGE')(begin, end);
    }

    /**
     * Insert element after the element with given value (as String)
     *
     * - Redis command: [LINSERT AFTER]{@link https://redis.io/commands/linsert}
     * - JavaScript analogy: none
     *
     * @example
     * (async () => {
     *
     *   await list.push('a', 'c', 'd');
     *   await list.insertAfter('a', 'b'); // returned value: 4, list: [a, b, c, d]
     *
     * })()
     *
     * @param  {Number}          key Key to insert after
     * @param  {String}          el  Element to insert
     * @return {Promise<Number>}     Resulting list length
     */
    insertAfter(key, el) {
        return this.useJSON
            ? this.call('LINSERT')('after', key, this.json.toJSON(el))
            : this.call('LINSERT')('after', key, el);
    }

    /**
     * Insert elenent before the elemnt with given index
     *
     * - Redis command: [LINSERT BEFORE]{@link https://redis.io/commands/linsert}
     * - JavaScript analogy: none
     *
     * @example
     * (async () => {
     *
     *   await list.push('a', 'c', 'd');
     *   await list.insertBefore('c', 'b'); // returned value: 4, list: [a, b, c, d]
     *
     * })()
     *
     * @param  {Number}          key Key to insert after
     * @param  {String}          el  Element to insert
     * @return {Promise<Number>}     Resulting list length
     */
    insertBefore(key, el) {
        return this.useJSON
            ? this.call('LINSERT')('before', key, this.json.toJSON(el))
            : this.call('LINSERT')('before', key, el);
    }

    /**
     * Get element at the given index
     *
     * - Redis command: [LINDEX]{@link https://redis.io/commands/lindex}
     * - JavaScript analogy: none | or Array[index]
     *
     * @example
     * (async () => {
     *
     *   await list.push('a', 'b', 'c', 'd');
     *   let el1 = await list.getElementAt(0);   // value: 'a'
     *   let el2 = await list.getElementAt(-1);  // value: 'd'
     *   let el3 = await list.getElementAt(100); // value: null
     *
     * })()
     *
     * @param  {Number}                 index Index to get element at
     * @return {Promise<?String|Object>}      Value under given index or null
     */
    getElementAt(index) {
        return this.useJSON
            ? this.call('LINDEX')(index).then(this.json.parse)
            : this.call('LINDEX')(index);
    }

    /**
     * Set element at given index
     *
     * - Redis command: [LSET]{@link https://redis.io/commands/lset}
     * - JavaScript analogy: none | or Array[index] = value
     *
     * @example
     * (async () => {
     *
     *   await list.push('a', 'b', 'c', 'd');
     *   await list.setElementAt(0, 'd');     // OK, list is [d, b, c, d]
     *   await list.setElementAt(1, 'd');     // OK, list is [d, d, c, d]
     *   await list.setElementAt(2, 'd');     // OK, list is [d, d, d, d]
     *
     *   await list.setElementAt(100, 'd').catch((e) => console.log(e)); // err: index out of range
     *
     * })()
     *
     * @param  {Number}          index Index to set el at
     * @param  {String}          value Value to set at given index
     * @return {Promise<String>}       OK String
     *
     * @throws {Error} When index is out of range (AKA greater than list.length())
     */
    setElementAt(index, value) {
        return this.useJSON
            ? this.call('LSET')(index, this.json.toJSON(value))
            : this.call('LSET')(index, value);
    }

    /**
     * Trim list in the given begin-end range
     *
     * - Redis command: [LTRIM]{@link https://redis.io/commands/ltrim}
     * - JavaScript analogy: none; maybe Array.prototype.slice()
     *
     * Indexes you specify are included (0, 0) - one element, (0, 1) - 2 elements
     *
     * @example
     * (async () => {
     *
     *   await list.push(1, 2, 3, 4);
     *   await list.trim(0, -1);        // list [1,2,3,4] - the same
     *   await list.trim(-3, -1);       // list [2,3,4]   - from the end
     *   await list.trim(0, 1);         // list [2,3]     - from the start
     *
     * })()
     *
     * @param  {Number}          begin Start index
     * @param  {Number}          end   End index
     * @return {Promise<String>}       OK String when success
     */
    trim(begin, end) {
        return this.call('LTRIM')(begin, end);
    }
}

module.exports = exports = List;
