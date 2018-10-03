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
// import * as connection from "./modules/connection";
const helpers = require("./modules/helpers");
exports.helpers = helpers;
// import * as shared from "./modules/shared";
// import slack from "./modules/slack";
const storage_1 = require("./modules/storage");
exports.storage = storage_1.default;
const user = require("./modules/user");
exports.user = user;
//# sourceMappingURL=app.js.map