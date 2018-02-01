/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */

/**
 * Return error json format
 *
 * @param {string | object} data
 * @param {number} code
 * @returns {object}
 */
export const error = (data: string | object, code = 200) => {
  return {
    code,
    error: data,
  };
};

/**
 * Return basic json format
 *
 * @param {string | object} data
 * @param {number} code
 * @returns {object}
 */
export const basic = (data: string | object, code = 200) => {
  return {
    code,
    data,
  };
};

/**
 * Return default response json
 *
 * @param {string} message
 * @returns {object}
 */
export const defaultResponse = (message = "All ok") => {
  return {
    code: 200,
    data: {
      message,
    },
  };
};

/**
 * Return default bad call with message
 *
 * @param {number} code
 * @returns {object}
 */
export const defaultBadCall = (code = 200) => {
  return {
    code,
    error: {
      message: "You are not calling the right function or something.",
    },
  };
};
