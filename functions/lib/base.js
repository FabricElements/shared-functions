"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 *
 * Functions for the playApp.
 *
 * Notes:
 * -------------------------------------------
 * - All the new functions most be tested and documented properly as described
 * at http://firebase.google.com/docs/functions/
 * - This file most be maintained clean, all te functions need to be required as
 * modules as needed.
 * - Firebase will rename all functions once they are on their servers. For
 * example the function `hello` inside the required module `demo` will be
 * renamed as `demo-hello`.
 */
// import demo from "./demo";
const connection = require("./modules/connection");
exports.connection = connection;
const helpers = require("./modules/helpers");
exports.helpers = helpers;
const shared = require("./modules/shared");
exports.shared = shared;
const slack_1 = require("./modules/slack");
exports.slack = slack_1.default;
const storage_1 = require("./modules/storage");
exports.storage = storage_1.default;
const user = require("./modules/user");
exports.user = user;
//# sourceMappingURL=base.js.map