import sget from './sget.js';
import spathPrepare from './spathPrepare.js';
import getWalk from './.internal/sgetWalk.js';
import getNewRoot from './.internal/sgetNewRoot.js';

export default function sgetAll(object, spmapValue) {
  const spmap = spathPrepare(spmapValue);
  const [walk] = getWalk(undefined, spmap);
  const result = getNewRoot(spmap);
  for (const [key, spath] of walk) {
    result[key] = sget(object, spath);
  }
  return result;
}
