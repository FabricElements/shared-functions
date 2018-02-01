/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */

/**
 * Returns Timestamp on json format to use on the database
 */
export = (admin) => {
  return {
    created: admin.database.ServerValue.TIMESTAMP,
    updated: admin.database.ServerValue.TIMESTAMP,
  };
};
