import isObject from '../isObject.js';
import KeyType, {isKeyType, numKey} from '../types/Key.type.js';
import {ArrayRoot, isArrayRoot, isObjectRoot, ObjectRoot} from '../types/RootType.js';

export type Walk = [string | number, any][];

const getWalk = (object: any, key?: KeyType, objectKey?: KeyType, level = 0, workLevel = 1): [(Walk | undefined), (number | undefined)] => {
  const ia: ArrayRoot | undefined = isArrayRoot(object) ? object : undefined;
  const io: ObjectRoot | undefined = isObjectRoot(object) ? object : undefined;
  let walk: Walk | undefined;
  let nextLevel: number | undefined = level;
  if (workLevel === level) {
    walk = [[objectKey ?? '', object]];
  } else if (workLevel === level + 1) {
    nextLevel += 1;
    if (isKeyType(key) && key) {
      walk = [[key, io ? io[key] : ia ? ia[numKey(key)] : undefined]];
    } else if (ia) {
      walk = [...ia.entries()];
    } else if (io) {
      walk = Object.entries(io);
    } else {
      nextLevel = undefined;
    }
  }
  return [walk, nextLevel];
};

export default getWalk;
