import SPath, {KeyOp} from './SPath.type.js';

/**
 * Converts `string` to a property super-path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
function stringToSPath(string: string): SPath {
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
export default stringToSPath;
