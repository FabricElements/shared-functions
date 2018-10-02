"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firestore = require("../shared/firestore");
/**
 * Store image from social network
 *
 * @param {string} uid
 * @param {string} photoURL
 * @return {Promise<void>}
 */
const storeImageFromSocial = async (uid, photoURL) => {
    const projectId = process.env.GCLOUD_PROJECT;
    console.log("obtainImageFromSocial");
    console.log(`PhotoURL: ${photoURL}`);
    console.log(`Project ID: ${projectId}`);
    // https://stackoverflow.com/questions/41352150/typeerror-firebase-storage-is-not-a-function
    const fileRef = admin.storage().bucket(`${projectId}.appspot.com`);
    await fileRef.upload(photoURL, {
        destination: `images/user/${uid}/avatar/1.jpg`,
        metadata: {
            contentType: "image/jpeg",
            metadata: {
                id: "1",
                type: "avatar",
                user: uid
            },
        },
    });
    console.log("Image saved");
};
/**
 * On user created
 * @type {CloudFunction<UserRecord>}
 */
exports.created = functions.auth.user().onCreate(async (userRecord, context) => {
    const uid = userRecord.uid || null;
    if (!uid) {
        throw new Error("uid is undefined");
    }
    const photoURL = userRecord.photoURL || null;
    try {
        console.info("Try to save user basic info");
        const db = admin.firestore();
        let batch = db.batch();
        // Set user profile
        const batchUser = {
            avatar: photoURL,
            backup: false,
            name: userRecord.displayName || null
        };
        const refUser = db.collection("user").doc(uid);
        batch.set(refUser, batchUser, { merge: true });
        // Set basic user account
        // const _providerData = userRecord.providerData || null;
        // console.info(`Provider Info: ${_providerData}`);
        const batchAccount = {
            backup: false,
            displayName: userRecord.displayName || null,
            email: userRecord.email || null,
            photoURL: userRecord.photoURL || null,
            uid: (uid)
            // providerData: _providerData
        };
        const refUserAccount = db.collection("user-account").doc(uid);
        batch.set(refUserAccount, batchAccount, { merge: true });
        // Set default users settings
        const batchSettings = {
            backup: false,
            dark: false,
            monochrome: false,
            notifications: {
                email: true,
                push: true,
                sounds: true,
            },
        };
        const refUserSettings = db.collection("user-settings").doc(uid);
        batch.set(refUserSettings, batchSettings, { merge: true });
        await batch.commit();
        console.info("Info saved");
    }
    catch (error) {
        console.error(error);
    }
    if (photoURL) {
        await storeImageFromSocial(uid, photoURL);
    }
    return null;
});
/**
 * On user deleted
 * @type {CloudFunction<UserRecord>}
 */
exports.deleted = functions.auth.user().onDelete(async (userRecord, context) => {
    // Remove user related documents
    const db = admin.firestore();
    let batch = db.batch();
    batch.delete(db.collection(`user`).doc(userRecord.uid));
    batch.delete(db.collection(`connections`).doc(userRecord.uid));
    batch.delete(db.collection(`connection-request`).doc(userRecord.uid));
    batch.delete(db.collection(`connection-ignored`).doc(userRecord.uid));
    await batch.commit();
    // Remove user from docs collection
    await firestore.removeMatch("connections", userRecord.uid);
    await firestore.removeMatch("connection-request", userRecord.uid);
    await firestore.removeMatch("connection-ignored", userRecord.uid);
});
//# sourceMappingURL=auth.js.map