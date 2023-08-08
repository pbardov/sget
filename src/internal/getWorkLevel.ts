import SPath from '../SPath.type.js';

export default function getWorkLevel(level: number, npos: number, spath: SPath): number {
  let workLevel = level;
  for (let n = 0; n < spath.length && n <= npos; n += 1) {
    const [key, op] = spath[n];
    if (op === '[') {
      workLevel += key ? 1 : 0;
    } else {
      workLevel += 1;
    }
  }
  return workLevel;
}
