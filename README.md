# redis-type - redis type wrapper  

[Full API Reference](https://damirka.github.io/redis-type/)

This small library gives you Promises and (!) JS-like wrappers for Redis types.
```
Redis HASH -> JS Map    // have you ever thought they are so similar?
Redis LIST -> JS Array  // this one is a bit obvious
Redis SET  -> JS Set    // and this one even more!
```

## Install and use

As all the npm packages, this one is installed like this:
```sh
$ npm install --save redis-type
```

To use this library, you have to include redis-type in your JS code and initialize it with Redis client.

```JavaScript

// The first one
const redis  = require('redis');
const client = redis.createClient();

// Initialize library with a client (!)
const types  = require('redis-type')(client);

// Choose the types you are going to use: Hash, List or Set
const Hash   = types.Hash;
const Set    = types.Set;   // this assignment will rewrite global.Set - be careful
const List   = types.List;

const users  = new Hash('users', true); // second argument is for JSON processing

(async () => {

    const allUsers = await users.getAll();

    await users.set('sam', { name: 'Sam', age: '19' });

    const sam = await users.get('sam');

})();
```
