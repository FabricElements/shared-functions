/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";

/**
 * Mark ond DB depending on type
 *
 * @param data
 * @param exists
 * @return {Promise<T>}
 */
export default async (data, exists) => {
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
    if (!exists) {
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
    if (!exists) {
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
