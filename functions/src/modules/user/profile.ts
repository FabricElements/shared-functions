/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as interfaces from "../helpers/interfaces";

const config = functions.config();

/**
 *
 * @param uid
 */
const userData = (uid) => {
  return admin.auth().getUser(uid)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      return userRecord.toJSON();
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
      return null;
    });
};

/**
 * Return first image from images object
 *
 * @param uid
 * @param images
 * @return {string|null}
 */
const getFirstImage = (uid, images) => {
  // Get an array of the keys:
  const keys = Object.keys(images);
  // Then sort by using the key values:
  keys.sort((a, b) => {
    return images[a] - images[b];
  });

  const image = keys[0];

  if (!image) {
    return null;
  }
  let imageUrl = `https://${config.imgix.domain}/`;
  imageUrl += `users/${uid}/avatar/${image}.jpg`;
  imageUrl += "?fit=crop&crop=faces&w=500&h=500&mask=ellipse&fm=png";

  return imageUrl;
};

/**
 * Update displayName when de user name changes
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
export const update = functions.firestore.document("users/{userId}").onUpdate(async (event) => {
  const uid = event.params.userId;
  const previousValue = event.data.previous.data();
  const newValue = event.data.data();
  const name = newValue.name ? newValue.name : null;
  const prevName = previousValue.name ? previousValue.name : null;
  const prevDisabled = !!previousValue.disabled;
  const newDisabled = !!newValue.disabled;
  const images = newValue.images ? newValue.images : null;
  const avatar = getFirstImage(uid, images);
  let hasChanged = false;
  // const userBaseData = userData(uid);

  let finalData: interfaces.InterfaceUser = {};

  /**
   * Update user name
   */
  if (name && name !== prevName && name.length >= 2) {
    finalData.displayName = name;
    hasChanged = true;
  }

  /**
   * Update user disabled
   */
  if (newDisabled !== prevDisabled) {
    finalData.disabled = newDisabled;
    hasChanged = true;
  }

  /**
   * Update avatar
   */
  if (avatar) {
    finalData.photoURL = avatar;
    hasChanged = true;
  }

  if (!hasChanged) {
    return;
  }

  try {
    return admin.auth().updateUser(uid, finalData);
  } catch (error) {
    throw new Error(error);
  }
});
