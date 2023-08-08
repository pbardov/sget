import stringToSPath from './stringToSPath.js';
import SPath from './types/SPath.type.js';

/**
 * Casts a value to an SPath array. If the input value is already an array, it's treated as an SPath. If the input value is a string, it's converted to an SPath using the stringToSPath function.
 *
 * @param value The value to cast.
 * @returns An SPath array.
 */
export default function castSPath(value: string | SPath): SPath {
  return Array.isArray(value) ? value : stringToSPath(value);
}
