import castSPath from './.internal/castSPath.js';
import getNewRoot from './.internal/sgetNewRoot.js';
import getWalk from './.internal/sgetWalk.js';

export default function spathPrepare(spmap, noTouch = true) {
  const result = noTouch ? getNewRoot(spmap) : spmap;
  const [walk] = getWalk(undefined, spmap);
  for (const [key, spathData] of walk) {
    let spathValue;
    let defaultValue;
    if (Array.isArray(spathData)) {
      [spathValue, defaultValue] = spathData;
    } else {
      spathValue = spathData;
    }
    result[key] = [castSPath(spathValue), defaultValue];
  }
  return result;
}
