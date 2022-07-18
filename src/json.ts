/**
 * Set of methods to parse/stringify objects, arrays etc
 */

/**
 * JSON.stringify provider
 * @type {Function}
 */
const json = JSON.stringify;

/**
 * JSON.parse provider
 * @type {Function}
 */
export const parse = JSON.parse;

// reexport
export { json as toJSON };

/**
 * If data is represented as object with JSON in it's property values,
 * do parse each property value of this object and return resulting object
 *
 * @param  {Object} obj Object to parse values of
 * @return {Object}     Object with parsed values
 */
export function parseObjectValues(obj: {
  [key: string]: string;
}): { [key: string]: any } {
  obj !== null &&
    Object.keys(obj).forEach(function(prop) {
      obj[prop] = parse(obj[prop]);
    });

  return obj;
}

/**
 * If you need to apply operation like HMSET and you need to encode/stringify
 * Object's values for it -> this one should help
 *
 * @param  {Object} obj Object to JSON it's values
 * @return {Object}     Object with JSON-ed values
 */
export function stringifyObjectValues(obj: {
  [key: string]: any;
}): { [key: string]: string } {
  obj !== null &&
    Object.keys(obj).forEach(function(prop) {
      obj[prop] = json(obj[prop]);
    });

  return obj;
}

/**
 * Parse Array of JSON strings
 *
 * @param  {Array} arr Array to map each value with JSON.parse
 * @return {Array}     Array of mapped values
 */
export function parseArray(arr: string[]): any[] {
  return arr.map(el => parse(el));
}
