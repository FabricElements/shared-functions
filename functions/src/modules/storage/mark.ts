/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";

/**
 * Mark ond DB depending on type
 *
 * @param data
 * @param state
 * @return {Promise<T>}
 */
export default async (data, state) => {
  let refBase = null;
  let imageJSON = {};
  if (!data.id || !data.type) {
    return;
  }

  if (data.type === "avatar") {
    if (!data.user) {
      return;
    }
    refBase = `user/${data.user}/basic/avatars`;
    const id = parseInt(data.id, 2);
    imageJSON = {
      [id]: Date.now(),
    };
    if (state === "not_exists") {
      imageJSON = {
        [id]: admin.firestore.FieldValue.delete(),
      };
    }
  }

  if (!refBase) {
    return;
  }

  const db = admin.firestore();
  const doc = db.doc(refBase);

  try {
    if (state === "not_exists") {
      await doc.update(imageJSON);
      console.log("Image deleted!");
    } else {
      await doc.set(imageJSON, {merge: true});
      console.log("Image added");
    }
  } catch (error) {
    throw new Error(error);
  }
};
