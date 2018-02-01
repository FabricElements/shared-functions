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
export default (data, state) => {
  let refBase = null;
  let write = "update";

  let imageJSON = {};
  if (!data.id || !data.type) {
    return;
  }

  if (data.type === "avatar") {
    if (!data.user) {
      return;
    }
    refBase = `users-avatars/${data.user}`;
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

  if (state === "not_exists") {
    return doc.update(imageJSON).then(() => {
      console.log("Image deleted!");
    }).catch((error) => {
      throw new Error(error);
    });
  }
  return doc.set(imageJSON, {merge: true}).then(() => {
    console.log("Image added");
  }).catch((error) => {
    throw new Error(error);
  });
};
