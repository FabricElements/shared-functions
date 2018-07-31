"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const arrays = require("../helpers/arrays");
const firestore = require("../shared/firestore");
const config = functions.config();
const FieldValue = admin.firestore.FieldValue;
const timestamp = FieldValue.serverTimestamp();
/**
 * Update displayName when de user name changes
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
exports.default = functions.firestore.document("connection-request/{userId}").onUpdate(async (change, context) => {
    const uid = context.params.userId;
    const previousValue = change.before.data();
    const newValue = change.after.data();
    // Basic validation
    if (!newValue || newValue === previousValue) {
        return;
    }
    try {
        // List of users that requested connection to the user
        const friendRequest = Object.keys(newValue).map((key) => key);
        // List of users that the user already send the friend request
        const friendsRequest = await firestore.getOrderByBasic("connection-request", uid);
        // Return the difference between users and baseList to show as recommendation
        const match = await arrays.repeated(friendRequest, friendsRequest);
        if (!friendRequest.length || !friendsRequest.length || !match.length) {
            return;
        }
        match.forEach(async (matchKey) => {
            // Set friend connection
            await firestore.set("connections", uid, {
                [matchKey]: timestamp,
            }, true);
            await firestore.set("connections", matchKey, {
                [uid]: timestamp,
            }, true);
            // Remove requests from users
            await firestore.deleteField("connection-request", matchKey, uid);
            await firestore.deleteField("connection-request", uid, matchKey);
        });
    }
    catch (error) {
        throw new Error(error);
    }
});
//# sourceMappingURL=request.js.map