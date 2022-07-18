/**
 * Redis SET wrapper
 */

import { Base } from './base';

/**
 * Class to handle Redis SET type
 *
 * @extends Wrapper
 */
export class Set extends Base {

    /**
     * Add element(s) to the set
     * Command: SADD
     *
     * @param {String[]|String} el Element or elements to add
     */
    add(...el: string[]): Promise<number> {
        return this.call('SADD')(...el);
    }

    /**
     * Get size of the set (number of elements in it)
     * Command: SCARD
     */
    size(): Promise<number> {
        return this.call('SCARD')();
    }

    /**
     * Check whether element is present in a set
     * Command: SISMEMBER
     *
     * @param {String} el Element to check for
     */
    has(el: string): Promise<boolean>{
        return this.call('SISMEMBER')(el);
    }

    /**
     * Get all members of set as array
     * Command: SMEMBERS
     *
     */
    values(): Promise<string[]>{
        return this.call('SMEMBERS')();
    }

    /**
     * Remove random element or number of elements from a set
     * Command: SPOP
     *
     * @param {Number} count Number of elements to remove
     */
    pop(count: number): Promise<string[]> {
        return this.call('SPOP')(count || 1);
    }

    /**
     * Delete element(s) from a set
     * Command: SREM
     *
     * @param {String}  [...el] Element(s) to remove
     */
    delete(...el: string[]): Promise<number> {
        return this.call('SREM')(el);
    }
}
