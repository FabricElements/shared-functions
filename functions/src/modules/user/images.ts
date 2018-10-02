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
  imageUrl += `user/${uid}/avatar/${images[0]}.jpg`;
  imageUrl += "?fit=crop&crop=faces&w=500&h=500&mask=ellipse&fm=png";
  console.info(`Image URL: ${imageUrl}`);
  return imageUrl;
};

/**
 * Update user
 *
 * @param {String} uid
 * @param {Array} images
 * @return {Promise<admin.auth.UserRecord>}
 */
const updateUser = async (uid: string, images: any[]) => {
  let photoURL = getFirst(uid, images);
  console.info(`getFirst passed with: ${photoURL}`);
  let user: interfaces.InterfaceUser = {
    photoURL,
  };
  console.info(`user passed with: ${user}`);
  await admin.auth().updateUser(uid, user);
  console.info(`updateUser finished`);
};

/**
 * Get summary for activities
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
export default functions.firestore.document("user/{uid}/basic/avatars").onWrite(async (change, context) => {
  const uid = context.params.uid;

  if (!change.after.exists) {
    try {
      await updateUser(uid, []);
      console.info(`updateUser (if) passed`);
      return firestore.deleteField("user", uid, "images");
    } catch (error) {
      throw new Error(error);
    }
  }

  const newValue = change.after.data();
  console.info(`newValue: ${newValue}`);

  try {
    // Get an array of the keys:
    let imageList = Object.keys(newValue);
    // Then sort by using the key values:
    imageList.sort((a, b) => {
      return newValue[b] - newValue[a];
    });

    await updateUser(uid, imageList);
    console.info(`updateUser (try) passed`);

    await firestore.set("user", uid, {
      images: imageList,
    }, true);
  } catch (error) {
    throw new Error(error);
  }
});
