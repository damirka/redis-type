import { RedisClientType } from 'redis';

export class Base {
    constructor(
        protected client: RedisClientType,
        public key: string,
        public useJSON: boolean = false
    ) {}

    /**
     * Call a Redis method (bind current storage key)
     */
    call(method: string, ...args: any[]): Function {
        // @ts-ignore
        return this.client[method].bind(this.client, this.key);
    }

    /**
     * Completely removes the key from storage using `DEL this.key`
     */
    removeKey(): Promise<number> {
        return this.client.DEL(this.key);
    }
}
