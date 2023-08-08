/**
 * Represents an array containing elements of any type.
 */
export type ArrayRoot = Array<any>;

/**
 * Checks if the provided value is an array.
 *
 * @param v The value to check.
 * @returns `true` if the value is an array, otherwise `false`.
 */
export function isArrayRoot(v: unknown): v is ArrayRoot {
	return Array.isArray(v);
}

/**
 * Represents an object with string or number keys and values of any type.
 */
export type ObjectRoot = Record<string | number, any>;

/**
 * Checks if the provided value is an object with string or number keys.
 *
 * @param v The value to check.
 * @returns `true` if the value is an object with string or number keys, otherwise `false`.
 */
export function isObjectRoot(v: unknown): v is ObjectRoot {
	return !isArrayRoot(v) && typeof v === 'object' && v !== null;
}

/**
 * Represents a value that can be either an ArrayRoot or an ObjectRoot.
 */
type RootType = ArrayRoot | ObjectRoot;
export default RootType;

/**
 * Checks if the provided value is of type RootType.
 *
 * @param v The value to check.
 * @returns `true` if the value is of type RootType, otherwise `false`.
 */
export function isRootType(v: unknown): v is RootType {
	return isArrayRoot(v) || isObjectRoot(v);
}
