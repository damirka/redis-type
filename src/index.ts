/**
 * Library access point and NPM settings
 *
 * @module index
 */

import { RedisClientType } from 'redis';
import { Hash } from './hash';
import { List } from './list';
import { Set } from './set';

export * as json from './json';
export { Hash, List, Set };

/**
 * Bind a client to simplify Class instantiation.
 * @param client
 */
export function bind(client: RedisClientType) {
    return {
        Hash<T>(name: string, useJSON: boolean = false) {
            return new Hash<T>(client, name, useJSON);
        },
        List<T>(name: string, useJSON: boolean = false) {
            return new List<T>(client, name, useJSON);
        },
        Set(name: string, useJSON: boolean = false) {
            return new Set(client, name, useJSON);
        }
    };
}
