import castSPath from './.internal/castSPath.js';
import getNewRoot from './.internal/sgetNewRoot.js';
import getWalk from './.internal/sgetWalk.js';

export default function spathPrepare(spmap, noTouch = true) {
  const result = noTouch ? getNewRoot(spmap) : spmap;
  const [walk] = getWalk(undefined, spmap);
  for (const [key, spathValue] of walk) {
    result[key] = castSPath(spathValue);
  }
  return result;
}
