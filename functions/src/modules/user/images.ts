/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as interfaces from "../helpers/interfaces";
import * as firestore from "../shared/firestore";

const config = functions.config();

/**
 * Get first item formatted
 *
 * @param uid
 * @param {Array} images
 * @return {string}
 */
const getFirst = (uid, images: any[]) => {
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
const updateUser = (uid: string, images: any[]) => {
  let photoURL = getFirst(uid, images);
  let user: interfaces.InterfaceUser = {
    photoURL,
  };

  try {
    return admin.auth().updateUser(uid, user);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get summary for activities
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
export default functions.firestore.document("users/{uid}/basic/avatars").onWrite(async (event) => {
  const uid = event.params.uid;

  if (!event.data.exists) {
    try {
      await updateUser(uid, []);
      return firestore.deleteField("users", uid, "images");
    } catch (error) {
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

    await updateUser(uid, imageList);

    await firestore.set("users", uid, {
      images: imageList,
    }, true);
  } catch (error) {
    throw new Error(error);
  }
});
