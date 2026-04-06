/**
 * Capitalizes the first letter of a string.
 * @param {string} str 
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and adds an ellipsis.
 * @param {string} str 
 * @param {number} length 
 * @returns {string}
 */
export function truncateString(str, length = 50) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Checks if a string is empty or contains only whitespace.
 * @param {string} str 
 * @returns {boolean}
 */
export function isStringEmpty(str) {
  return !str || str.trim().length === 0;
}

/**
 * Reverses the given string.
 * @param {string} str 
 * @returns {string}
 */
export function reverseString(str) {
  if (!str) return '';
  return str.split('').reverse().join('');
}
