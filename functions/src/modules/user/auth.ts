/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as firestore from "../shared/firestore";
import * as pubSub from "@google-cloud/pubsub";
import { user } from "firebase-functions/lib/providers/auth";

/**
 * Store image from social network
 *
 * @param {string} uid
 * @param {string} photoURL
 * @return {Promise<void>}
 */
const storeImageFromSocial = async (uid: string, photoURL: string) => {
  const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  const fileRef = admin.storage().bucket(adminConfig.storageBucket);
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
export const created = functions.auth.user().onCreate(async (userRecord, context) => {
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
    batch.set(refUser, batchUser, {merge: true});

    // Set basic user account
    const batchAccount = {
      backup: false,
      displayName: userRecord.displayName || null,
      email: userRecord.email || null,
      phoneNumber: userRecord.phoneNumber || null,
      photoURL: userRecord.photoURL || null,
      uid: (uid)
    };
    const refUserAccount = db.collection("user-account").doc(uid);
    batch.set(refUserAccount, batchAccount, {merge: true});

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
    batch.set(refUserSettings, batchSettings, {merge: true});
    await batch.commit();
    console.info("Info saved");
  } catch (error) {
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
export const deleted = functions.auth.user().onDelete(async (userRecord, context) => {
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

/**
 * PubSub basic event
 *
 * @param {object} data
 * @param {object} attributes
 * @returns {Promise}
 */
const publishEvent = (data: object = {}, attributes: object = {}) => {
  const message = JSON.stringify(data);
  const dataBuffer = Buffer.from(message);
  return publisher.publish(dataBuffer, attributes);
};

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp(adminConfig);

const publisher = pubSub({
  projectId: adminConfig.projectId,
}).topic("update-user", {}).publisher();

/**
 * User updates
 *
 * @param {string} uid
 * @param {string} photoURL
 * @return {Promise<void>}
 */
const update = async (nextPageToken) => {
  // List batch of users, 1000 at a time.
  return admin.auth().listUsers(2, nextPageToken)
    .then(async (listUsersResult) => {
      const db = admin.firestore();

      for(const user of listUsersResult.users) {
        try {
          const refUser = db.collection("auth-backup").doc(user.uid);
          const doc = await refUser.get();
          const data = doc.data();

          if (!doc.exists) {
            console.log(`Adding ${user.uid} to the db`)
            refUser.set(user, {merge: true});
          }

          if (
              user.displayName !== data.name ||
              user.photoURL !== data.avatar ||
              user.email !== data.avatar ||
              user.phoneNumber !== data.avatar
            ) {
            console.log('Publishing')
            await publishEvent({user});
            console.log('Event sent')
          }

        } catch (error) {
          throw error;
        }
      }

      if (listUsersResult.pageToken) {
        // List next batch of users.
        return update(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.error("Error listing users:", error);
      throw error
    });
}
