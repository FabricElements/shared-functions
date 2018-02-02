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
    imageUrl += `users/${uid}/avatar/${images[0]}.jpg`;
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
const updateUser = (uid, images) => {
    let photoURL = getFirst(uid, images);
    let user = {
        photoURL,
    };
    try {
        return admin.auth().updateUser(uid, user);
    }
    catch (error) {
        throw new Error(error);
    }
};
/**
 * Get summary for activities
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
exports.default = functions.firestore.document("users-avatars/{uid}").onWrite((event) => __awaiter(this, void 0, void 0, function* () {
    const uid = event.params.uid;
    if (!event.data.exists) {
        try {
            yield updateUser(uid, []);
            return firestore.deleteField("users", uid, "images");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    const newValue = event.data.data();
    try {
        // Get an array of the keys:
        let imageList = Object.keys(newValue);
        // Then sort by using the key values:
        imageList.sort((a, b) => {
            return newValue[b] - newValue[a];
        });
        yield updateUser(uid, imageList);
        yield firestore.set("users", uid, {
            images: imageList,
        }, true);
    }
    catch (error) {
        throw new Error(error);
    }
}));
//# sourceMappingURL=images.js.map