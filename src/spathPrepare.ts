import castSPath from './castSPath.js';
import getNewRoot from './internal/getNewRoot.js';
import getWalk from './internal/getWalk.js';
import { SPathMap, SPathRawMap, SPathWithDefault } from './types/SPath.type.js';

/**
 * Prepares a map of raw SPath data by converting it into a processed SPath map.
 *
 * @param spmap The raw SPath map to prepare.
 * @returns The processed SPath map.
 */
export default function spathPrepare(spmap: SPathRawMap): SPathMap {
  const result = getNewRoot(spmap) as SPathMap;
  const [walk] = getWalk(spmap);

  if (typeof walk !== 'undefined') {
    for (const [key, spathData] of walk) {
      let spathValue;
      let defaultValue;

      if (Array.isArray(spathData)) {
        [spathValue, defaultValue] = spathData;
      } else {
        spathValue = spathData;
      }

      const spathWithDefault: SPathWithDefault = [castSPath(spathValue), defaultValue];

      if (['string', 'number'].includes(typeof key)) {
        result[key] = spathWithDefault;
      }
    }
  }

  return result;
}
