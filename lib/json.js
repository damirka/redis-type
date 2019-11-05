/**
 * Set of methods to parse/stringify objects, arrays etc
 */

'use strict';

/**
 * JSON.stringify provider
 * @type {Function}
 */
const json = exports.toJSON = JSON.stringify;

/**
 * JSON.parse provider
 * @type {Function}
 */
const parse = exports.parse = JSON.parse;

/**
 * If data is represented as object with JSON in it's property values,
 * do parse each property value of this object and return resulting object
 *
 * @param  {Object} obj Object to parse values of
 * @return {Object}     Object with parsed values
 */
exports.parseObjectValues = function (obj) {

    (obj !== null) && Object.keys(obj).forEach(function (prop) {
        obj[prop] = parse(obj[prop]);
    });

    return obj;
};

/**
 * If you need to apply operation like HMSET and you need to encode/stringify
 * Object's values for it -> this one should help
 *
 * @param  {Object} obj Object to JSON it's values
 * @return {Object}     Object with JSON-ed values
 */
exports.stringifyObjectValues = function (obj) {
    (obj !== null) && Object.keys(obj).forEach(function (prop) {
        obj[prop] = json(obj[prop]);
    });

    return obj;
};

/**
 * Parse Array of JSON strings
 *
 * @param  {Array} arr Array to map each value with JSON.parse
 * @return {Array}     Array of mapped values
 */
exports.parseArray = function (arr) {
    return arr.map(parse);
};
