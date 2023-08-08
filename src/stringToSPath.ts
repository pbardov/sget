import SPath, { KeyOp } from './types/SPath.type.js';

/**
 * Converts a string representation of a structured path into an SPath array.
 *
 * @param string The input string to convert.
 * @returns An SPath array representing the structured path.
 */
export default function stringToSPath(string: string): SPath {
  const path: SPath = [];
  const parents = new Map();
  let current = path as KeyOp;

  for (const [, key, op] of string.matchAll(/(.*?)(>=|<=|[\.\[\]:!\?%><]|$)/g)) {
    const sub: KeyOp = [key, op];
    if (!key && !op) continue;

    current.push(sub);

    switch (op) {
      case '[': {
        parents.set(sub, current);
        current = sub;
        break;
      }
      case ']': {
        if (parents.has(current)) {
          const prev = current;
          current = parents.get(prev);
          parents.delete(prev);
        }
        break;
      }
      case '.':
      default:
        break;
    }
  }

  return path;
}
