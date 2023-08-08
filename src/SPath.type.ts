import KeyType from './types/Key.type.js';

export type KeyOp = [key: KeyType, op: string, ...sub: KeyOp[]];
type SPath = KeyOp[];
export type RawSPathWithDefault = SPath | string | [SPath | string, any];
export type SPathRawMap = { [k: KeyType]: RawSPathWithDefault };
export type SPathWithDefault = [SPath, any];
export type SPathMap = { [k: KeyType]: SPathWithDefault };

export default SPath;
