import isNumber from './isNumber.js';
import isString from './isString.js';

/**
 * The type representing a key, which can be either a string or a number.
 */
type KeyType = string | number;
export default KeyType;

/**
 * Checks if the provided value is a valid key type.
 *
 * @param v The value to check.
 * @returns `true` if the value is a valid key type, otherwise `false`.
 */
export function isKeyType(v: unknown): v is KeyType {
	return isString(v) || isNumber(v);
}

/**
 * Converts a key to a number if possible, otherwise returns NaN.
 *
 * @param key The key to convert.
 * @returns The converted key as a number, or NaN if conversion is not possible.
 */
export function numKey(key: KeyType): number {
	return isNumber(key) ? key : Number(key);
}
