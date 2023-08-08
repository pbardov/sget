import sget from './sget.js';
import spathPrepare from './spathPrepare.js';
import getWalk from './internal/getWalk.js';
import getNewRoot from './internal/getNewRoot.js';
import SPath, { SPathRawMap } from './types/SPath.type.js';
import { isKeyType, numKey } from './types/Key.type.js';
import RootType, { isArrayRoot } from './types/RootType.js';

/**
 * Retrieves values from the provided object based on the structured path map.
 *
 * @param object The object to retrieve values from.
 * @param spmapValue The raw structured path map.
 * @returns An object containing the retrieved values.
 */
export default function sgetAll(object: RootType, spmapValue: SPathRawMap) {
  const spmap = spathPrepare(spmapValue);
  const [walk] = getWalk(spmap);
  const result = getNewRoot(spmap);

  if (walk) {
    for (const [key, [spath, defaultValue]] of walk) {
      if (isKeyType(key)) {
        const getRes = sget(object, spath as SPath, defaultValue);

        if (isArrayRoot(result)) {
          result[numKey(key)] = getRes;
        } else {
          result[key] = getRes;
        }
      }
    }
  }

  return result;
}
