"use strict";
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return error json format
 *
 * @param {string | object} data
 * @param {number} code
 * @returns {object}
 */
exports.error = (data, code = 200) => {
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
exports.basic = (data, code = 200) => {
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
exports.defaultResponse = (message = "All ok") => {
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
exports.defaultBadCall = (code = 200) => {
    return {
        code,
        error: {
            message: "You are not calling the right function or something.",
        },
    };
};
//# sourceMappingURL=responses.js.map