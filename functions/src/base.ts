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
import * as connection from "./modules/connection";
import * as helpers from "./modules/helpers";
import * as shared from "./modules/shared";
import storage from "./modules/storage";
import * as user from "./modules/user";

export {
  // demo,
  connection,
  helpers,
  storage,
  user,
  shared,
};
