import type RootType from '../types/RootType.js';

export default function getNewRoot(oldRoot: any): RootType {
  return Array.isArray(oldRoot) ? [] : {};
}
