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
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// import demo from "./demo";
import * as friends from "./modules/friends/index";
import storage from "./modules/storage/index";
import * as user from "./modules/user/index";

const config = functions.config();
admin.initializeApp(config.firebase);

export {
  // demo,
  friends,
  storage,
  user,
};
