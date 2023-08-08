/* eslint-disable eqeqeq */
import castSPath from './castSPath.js';
import getWalk from './internal/getWalk.js';
import getNewRoot from './internal/getNewRoot.js';
import getWorkLevel from './internal/getWorkLevel.js';
import SPath from './types/SPath.type.js';
import { isKeyType } from './types/Key.type.js';

// Control operations used in the structured path
const CONTROL_OPS = ['.', '[', ']'];

/**
 * Retrieves a value from an object using a structured path (SPath).
 *
 * @param object The object to traverse.
 * @param spathValue The structured path (SPath) string or array.
 * @param defaultValue The default value to return if the path is not found.
 * @param pos The starting position in the spathValue array (optional).
 * @returns The value found at the specified path, or the defaultValue if not found.
 */
export default function sget(object: any, spathValue: string | SPath, defaultValue: any = undefined, pos = 0) {
	let current;
	let currentKey;
	let currentLevel;
	let newRoot;
	let newRootLevel = 0;

	// Define the Processing type to keep track of path traversal
	type Processing = {
		level: number;
		spath: SPath;
		root: any;
		rootKey?: string | number;
		nextRoot?: any;
		nextRootKey?: string | number;
	};

	// Convert the input structured path to an array and slice it starting from the specified position
	const mainSpath = castSPath(spathValue).slice(pos);
	// Initialize the list of path traversal steps with the main structured path
	const processings: Processing[] = [{ level: 0, root: object, rootKey: undefined, spath: mainSpath }];

	// Continue traversal as long as there are steps to process
	while (processings.length) {
		// Destructure the current processing step
		const { level, root, rootKey, spath, nextRoot: nr, nextRootKey: nrk } = processings.shift() as Processing;
		current = root;
		currentKey = rootKey;
		currentLevel = level;

		if (level === 0) {
			newRoot = root;
			newRootLevel = level;
		}

		let nextRoot = nr;
		let nextRootKey = nrk;

		if (currentLevel === 1) {
			nextRoot = current;
			nextRootKey = currentKey;

			if (newRootLevel < 1) {
				newRoot = getNewRoot(newRoot);
				newRootLevel = 1;
			}
		}

		let bracket = spath.length ? spath[spath.length - 1][1] === ']' : false;

		// Handle cases where the nextRoot is the same as the newRoot
		if (
			bracket
			&& newRootLevel >= 1
			&& nextRootKey !== undefined
			&& nextRoot !== undefined
			&& newRoot[nextRootKey] === nextRoot
		) {
			current = newRoot;
			currentKey = undefined;
			currentLevel = 0;
			continue;
		}

		// Iterate through the structured path elements
		for (let npos = 0; npos < spath.length; npos += 1) {
			const [key, op, ...sub] = spath[npos];
			const workLevel = getWorkLevel(level, npos, spath);

			// Check if this is the last element and handle empty keys
			if (key === '' && (!op || op === ']') && level + npos === 0) {
				break;
			}

			// Get the walk and walkLevel using the getWalk function
			const [walk, walkLevel] = getWalk(current, key, currentKey, currentLevel, workLevel);
			let nextLevel = walkLevel;
			current = undefined;
			currentLevel = undefined;
			currentKey = undefined;

			if (walk) {
				// Iterate through the walk items
				for (let [nextKey, next] of walk) {
					if (nextLevel === 1 && current === undefined) {
						nextRoot = next;
						nextRootKey = nextKey;

						if (newRootLevel < 1) {
							newRoot = getNewRoot(newRoot);
							newRootLevel = 1;
						}
					}

					// Handle cases where the nextRoot is the same as the newRoot
					if (
						bracket
						&& newRootLevel >= 1
						&& nextRootKey !== undefined
						&& nextRoot !== undefined
						&& newRoot[nextRootKey] === nextRoot
					) {
						current = newRoot;
						currentKey = undefined;
						currentLevel = 0;
						break;
					}

					if (nextLevel === workLevel) {
						// Handle control operations
						if (CONTROL_OPS.includes(op)) {
							if (op === '[') {
								next = sget(next, sub as SPath);
							} else if (op === ']') {
								bracket = true;
								const result = next;
								next = newRoot;
								nextKey = '';

								if (result && isKeyType(nextRootKey)) {
									next[nextRootKey] = nextRoot;
								}

								nextLevel = 0;
							}
						} else {
							// Handle comparison and modification operations
							const right = spath
								.slice(npos + 1)
								.map(v => {
									const [k, o] = v;
									return `${k}${o !== ']' ? o : ''}`;
								})
								.join('');

							spath.splice(npos + 1);

							if (bracket) {
								spath.push(['', ']']);
							}

							nextLevel += 1;

							if (op) {
								if (op === ':') {
									next = right ? next == right : !!next;
								}
								if (op === '!') {
									next = right ? next != right : !next;
								}
								if (op === '?') {
									next = next !== undefined;
								}
								if (op === '>') {
									next = `${next}` > right;
								}
								if (op === '>=') {
									next = `${next}` >= right;
								}
								if (op === '<') {
									next = `${next}` < right;
								}
								if (op === '<=') {
									next = `${next}` <= right;
								}
								if (op === '%') {
									next %= Number(right);
								}
							}
						}

						if (next !== undefined) {
							if (current === undefined) {
								current = next;
								currentKey = nextKey;
								currentLevel = nextLevel;
							} else {
								if (nextLevel === workLevel + 1 && isKeyType(nextKey)) {
									next = { [nextKey]: next };
									nextLevel -= 1;
								}

								const nextSpath = spath.slice(npos + 1);

								if (!nextSpath.length) {
									nextSpath.push(['', '']);
								}

								processings.push({ level: nextLevel, root: next, rootKey: nextKey, spath: nextSpath, nextRoot, nextRootKey });
							}
						}
					}
				}

				if (current === undefined) {
					break;
				}
			} else {
				break;
			}
		}

		if (current !== undefined && !bracket) {
			break;
		}
	}

	return current !== undefined ? current : defaultValue;
}
