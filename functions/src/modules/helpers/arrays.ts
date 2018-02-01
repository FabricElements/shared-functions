/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */

/**
 * Fix array order
 *
 * @param {Array} array1
 * @param {Array} array2
 * @return {Array}
 */
const fixArrayOrder = (array1: any[], array2: any[]) => {
  if (!array1.length || !array2.length) {
    return [];
  }
  let base = array1;
  let compare = array2;
  if (array1.length < array2.length) {
    base = array2;
    compare = array1;
  }
  return [
    base,
    compare,
  ];
};

/**
 * Shuffle array
 *
 * @param {Array} baseArray
 * @return {Array}
 */
export const shuffle = (baseArray: any[]) => {
  let ctr = baseArray.length;
  let temp;
  let index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = baseArray[ctr];
    baseArray[ctr] = baseArray[index];
    baseArray[index] = temp;
  }
  return baseArray;
};

/**
 * Get the difference between 2 arrays
 *
 * @param {Array} array1
 * @param {Array} array2
 * @return {Array}
 */
export const difference = (array1: any[], array2: any[]) => {
  const arrays = fixArrayOrder(array1, array2);
  return arrays[0].filter((x) => arrays[1].indexOf(x) === -1);
};

/**
 * Get repeated items between 2 arrays
 *
 * @param {Array} array1
 * @param {Array} array2
 * @return {Array}
 */
export const repeated = (array1: any[], array2: any[]) => {
  const arrays = fixArrayOrder(array1, array2);
  return arrays[0].filter((x) => arrays[1].indexOf(x) >= 0);
};

/**
 * Get unique values
 *
 * @param {Array} items
 * @return {Array}
 */
export const unique = (items: any[]) => {
  for (let i = 0; i < items.length; ++i) {
    for (let j = i + 1; j < items.length; ++j) {
      if (items[i] === items[j]) {
        items.splice(j--, 1);
      }
    }
  }

  return items;
};
