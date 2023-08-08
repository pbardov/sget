import SPath from '../types/SPath.type.js';

/**
 * Calculates the work level for the traversal based on the provided parameters.
 *
 * @param level The current traversal level.
 * @param npos The current position in the structured path array.
 * @param spath The structured path array being traversed.
 * @returns The calculated work level.
 */
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
