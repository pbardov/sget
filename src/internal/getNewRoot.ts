import type RootType from '../types/RootType.js';

/**
 * Returns a new root value based on the type of the old root value.
 *
 * @param oldRoot The old root value.
 * @returns A new root value that is either an empty array or an empty object.
 */
export default function getNewRoot(oldRoot: any): RootType {
  return Array.isArray(oldRoot) ? [] : {};
}
