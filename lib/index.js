/**
 * Future extension in real use
 *
 * @module redis-type
 */

'use strict';

module.exports = exports = function (client) {

    return {
        Wrapper: require('./wrapper').bind(null, client),
        Hash:    require('./hash').bind(null, client),
        List:    require('./list').bind(null, client),
        Set:     require('./set').bind(null, client)
    };

};

exports.Wrapper = require('./wrapper');
exports.List    = require('./list');
exports.Hash    = require('./hash');
exports.Set     = require('./set');
