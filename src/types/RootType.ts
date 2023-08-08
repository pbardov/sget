export type ArrayRoot = Array<any>;

export function isArrayRoot(v: unknown): v is ArrayRoot {
	return Array.isArray(v);
}

export type ObjectRoot = Record<string|number, any>;

export function isObjectRoot(v: unknown): v is ObjectRoot {
	return !isArrayRoot(v) && typeof v === 'object' && v !== null;
}

type RootType = ArrayRoot | ObjectRoot;
export default RootType;

export function isRootType(v: unknown): v is RootType {
	return isArrayRoot(v) || isObjectRoot(v);
}
