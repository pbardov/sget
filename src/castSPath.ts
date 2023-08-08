import stringToSPath from './stringToSPath.js';
import SPath from './SPath.type.js';

/**
 * Casts `value` to a super-path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castSPath(value: string | SPath): SPath {
  return Array.isArray(value) ? value : stringToSPath(value);
}

export default castSPath;
