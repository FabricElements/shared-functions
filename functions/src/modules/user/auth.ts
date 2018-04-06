/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as gcs from "@google-cloud/storage";
import * as functions from "firebase-functions";
import * as rp from "request-promise";
import * as firestore from "../shared/firestore";

const config = functions.config();

const storeImageFromSocial = (user, photoURL) => {
  console.log("obtainImageFromSocial");
  console.log(user);
  console.log(photoURL);
  console.log(config);

  // Gets the profileURL from provider data and save the image on Storage with the required metadata.

  // https://stackoverflow.com/questions/41352150/typeerror-firebase-storage-is-not-a-function
  const fileMetadata = {customMetadata: {type: "avatar", id: 1, user: user.uid}};

  const bucket = gcs().bucket("fabricelements.appspot.com");

  // bucket.upload(photoURL, {
  //   destination: `images/user/${user.uid}/avatar/1.jpg`,
  //   metadata: fileMetadata,
  // });

  const options = {
    method: "GET",
    uri: photoURL,
  };

  return rp(options)
    .then((parsedBody) => {
      console.log("Image obtained:", parsedBody);
      return parsedBody;
    })
    .catch((error) => {
      const finalError = `Image get went wrong: ${error}`;
      throw new Error(finalError);
    });

  // bucket.upload(photoURL, (err, file) => {
  //   if (!err) {
  //     // "zebra.jpg" is now in your bucket.
  //     console.log(file);
  //     console.log("OKK");
  //   } else {
  //     console.log(err);
  //   }
  // });
};

/**
 * On user created
 * @type {CloudFunction<UserRecord>}
 */
export const created = functions.auth.user().onCreate(async (userRecord, context) => {
  const name = userRecord.displayName ? userRecord.displayName : null;
  const email = userRecord.email ? userRecord.email : null;
  const providerData = userRecord.providerData ? userRecord.providerData : null;
  const avatar = userRecord.photoURL ? userRecord.photoURL : null;

  // Set user profile
  await firestore.set("user", userRecord.uid, {
    avatar,
    name,
  });

  // Set basic user account
  await firestore.set(`user/${userRecord.uid}/private`, "account", {
    email,
    providerData,
  });

  // Set default users settings
  await firestore.set(`user/${userRecord.uid}/private`, "settings", {
    dark: false,
    monochrome: false,
    notifications: {
      email: true,
      push: true,
      sounds: true,
    },
  });

  /*if (photoURL) {
    await storeImageFromSocial(user, photoURL);
  }*/
});

/**
 * On user deleted
 * @type {CloudFunction<UserRecord>}
 */
export const deleted = functions.auth.user().onDelete(async (userRecord, context) => {
  // Remove user related documents
  await firestore.removeDocument("user", userRecord.uid);
  await firestore.removeDocument("connections", userRecord.uid);
  await firestore.removeDocument("connection-request", userRecord.uid);
  await firestore.removeDocument("connection-ignored", userRecord.uid);
  // Remove user from docs collection
  await firestore.removeMatch("connections", userRecord.uid);
  await firestore.removeMatch("connection-request", userRecord.uid);
  await firestore.removeMatch("connection-ignored", userRecord.uid);
});
