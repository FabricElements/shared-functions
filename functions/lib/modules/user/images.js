"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firestore = require("../shared/firestore");
const config = functions.config();
/**
 * Get first item formatted
 *
 * @param uid
 * @param {Array} images
 * @return {string}
 */
const getFirst = (uid, images) => {
    if (!images.length) {
        return "";
    }
    let imageUrl = `https://${config.imgix.domain}/`;
    imageUrl += `user/${uid}/avatar/${images[0]}.jpg`;
    imageUrl += "?fit=crop&crop=faces&w=500&h=500&mask=ellipse&fm=png";
    return imageUrl;
};
/**
 * Update user
 *
 * @param {String} uid
 * @param {Array} images
 * @return {Promise<admin.auth.UserRecord>}
 */
const updateUser = async (uid, images) => {
    let photoURL = getFirst(uid, images);
    let user = {
        photoURL,
    };
    await admin.auth().updateUser(uid, user);
};
/**
 * Get summary for activities
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
exports.default = functions.firestore.document("user/{uid}/basic/avatars").onWrite(async (change, context) => {
    const uid = context.params.uid;
    if (!change.after.exists) {
        try {
            await updateUser(uid, []);
            return firestore.deleteField("user", uid, "images");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    const newValue = change.after.data();
    try {
        // Get an array of the keys:
        let imageList = Object.keys(newValue);
        // Then sort by using the key values:
        imageList.sort((a, b) => {
            return newValue[b] - newValue[a];
        });
        await updateUser(uid, imageList);
        await firestore.set("user", uid, {
            images: imageList,
        }, true);
    }
    catch (error) {
        throw new Error(error);
    }
});
//# sourceMappingURL=images.js.map