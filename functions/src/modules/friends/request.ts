/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as arrays from "../helpers/arrays";
import * as firestore from "../shared/firestore";

const config = functions.config();
const FieldValue = admin.firestore.FieldValue;
const timestamp = FieldValue.serverTimestamp();

/**
 * Update displayName when de user name changes
 * @type {CloudFunction<DeltaDocumentSnapshot>}
 */
export default functions.firestore.document("friends-requests/{userId}").onUpdate(async (event) => {
  const uid = event.params.userId;
  const previousValue = event.data.previous.data();
  const newValue = event.data.data();
  // Basic validation
  if (!newValue || newValue === previousValue) {
    return;
  }

  try {
    // List of users that requested connection to the user
    const friendRequest = Object.keys(newValue).map((key) => key);
    // List of users that the user already send the friend request
    const friendsRequest = await firestore.getOrderByBasic("friends-requests", uid);
    // Return the difference between users and baseList to show as recommendation
    const match = await arrays.repeated(friendRequest, friendsRequest);

    if (!friendRequest.length || !friendsRequest.length || !match.length) {
      return;
    }

    return match.forEach(async (element) => {
      // Set friend connection
      await firestore.set("users-friends", uid, {
        [element]: timestamp,
      }, true);

      await firestore.set("users-friends", element, {
        [uid]: timestamp,
      }, true);

      // Remove requests from users
      await firestore.deleteField("friends-requests", element, uid);
      await firestore.deleteField("friends-requests", uid, element);
    });

  } catch (error) {
    throw new Error(error);
  }
});
