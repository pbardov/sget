import isNumber from './isNumber.js';
import isString from './isString.js';

type KeyType = string | number;

export default KeyType;

export function isKeyType(v: unknown): v is KeyType {
	return isString(v) || isNumber(v);
}

export function numKey(key: KeyType): number {
	return isNumber(key) ? key : Number(key);
}
