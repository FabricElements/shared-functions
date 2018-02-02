"use strict";
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
module.exports = (admin) => {
    return {
        created: admin.database.ServerValue.TIMESTAMP,
        updated: admin.database.ServerValue.TIMESTAMP,
    };
};
//# sourceMappingURL=timestamp.js.map