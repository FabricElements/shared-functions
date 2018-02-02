"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.default = functions.firestore.document("friends-requests/{userId}").onUpdate((event) => __awaiter(this, void 0, void 0, function* () {
    const uid = event.params.userId;
    const previousValue = event.data.previous.data();
    const newValue = event.data.data();
    // Basic validation
    if (!newValue || newValue === previousValue) {
        return;
    }
    try {
        // List of users that requested connection to the user
        const friendRequest = Object.keys(newValue).map((key) => key);
        // List of users that the user already send the friend request
        const friendsRequest = yield firestore.getOrderByBasic("friends-requests", uid);
        // Return the difference between users and baseList to show as recommendation
        const match = yield arrays.repeated(friendRequest, friendsRequest);
        if (!friendRequest.length || !friendsRequest.length || !match.length) {
            return;
        }
        return match.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            // Set friend connection
            yield firestore.set("users-friends", uid, {
                [element]: timestamp,
            }, true);
            yield firestore.set("users-friends", element, {
                [uid]: timestamp,
            }, true);
            // Remove requests from users
            yield firestore.deleteField("friends-requests", element, uid);
            yield firestore.deleteField("friends-requests", uid, element);
        }));
    }
    catch (error) {
        throw new Error(error);
    }
}));
//# sourceMappingURL=request.js.map