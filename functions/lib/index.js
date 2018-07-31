"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
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
const admin = require("firebase-admin");
/**
 * Init firebase app first
 */
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({
    timestampsInSnapshots: true,
});
/**
 * Export app modules after the app is initialized
 */
__export(require("./app"));
//# sourceMappingURL=index.js.map