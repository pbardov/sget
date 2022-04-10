/* eslint-disable eqeqeq */
import castSPath from './.internal/castSPath.js';
import getWalk from './.internal/sgetWalk.js';
import getNewRoot from './.internal/sgetNewRoot.js';
import getWorkLevel from './.internal/sgetWorkLevel.js';

const CONTROL_OPS = ['.', '[', ']'];

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @since 3.7.0
 * @category Object
 * @param {Object|Array} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @see has, hasIn, set, unset
 * @example
 *
 * const object = [{ key: { index: 0 } }, { key: { index: 1 } }, { key: { index: 3 } }]
 *
 * sget(object, '[.key.index>0].key.index')
 * // => 1
 *
 * sget(object, '[.key.index:4]', 'default')
 * // => 'default'
 */
function sget(object, spathValue, defaultValue, pos = 0) {
  let current;
  let currentKey;
  let currentLevel;
  let newRoot;
  let newRootLevel;

  const mainSpath = castSPath(spathValue).slice(pos);
  const iterators = [[0, object, undefined, mainSpath]];
  while (iterators.length) {
    const [level, root, rootKey, spath, nr, nrk] = iterators.shift();
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

    for (let npos = 0; npos < spath.length; npos += 1) {
      const [key, op, ...sub] = spath[npos];
      const workLevel = getWorkLevel(level, npos, spath); // level + npos + 1;

      if (key === '' && (!op || op === ']') && level + npos === 0) {
        break;
      }

      const [walk, walkLevel] = getWalk(key, current, currentKey, currentLevel, workLevel);
      let nextLevel = walkLevel;
      current = undefined;
      currentLevel = undefined;
      currentKey = undefined;

      if (walk) {
        for (let [nextKey, next] of walk) {
          if (nextLevel === 1 && current === undefined) {
            nextRoot = next;
            nextRootKey = nextKey;
            if (newRootLevel < 1) {
              newRoot = getNewRoot(newRoot);
              newRootLevel = 1;
            }
          }

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
            if (CONTROL_OPS.includes(op)) {
              if (op === '[') {
                next = sget(next, sub);
              } else if (op === ']') {
                bracket = true;
                const result = next;
                next = newRoot;
                nextKey = undefined;
                if (result) {
                  next[nextRootKey] = nextRoot;
                }
                nextLevel = 0;
              }
            } else {
              const right = spath
                .slice(npos + 1)
                .map(([k, o]) => `${k}${o !== ']' ? o : ''}`)
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
                  next %= right;
                }
              }
            }

            if (next !== undefined) {
              if (current === undefined) {
                current = next;
                currentKey = nextKey;
                currentLevel = nextLevel;
              } else {
                if (nextLevel === workLevel + 1) {
                  next = { [nextKey]: next };
                  nextLevel -= 1;
                }
                const nextSpath = spath.slice(npos + 1);
                if (!nextSpath.length) {
                  nextSpath.push(['', '']);
                }
                iterators.push([nextLevel, next, nextKey, nextSpath, nextRoot, nextRootKey]);
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

export default sget;
