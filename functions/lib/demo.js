"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const rp = require("request-promise");
const config = functions.config();
const storeImageFromSocial = async (user, photoURL) => {
    console.log("obtainImageFromSocial");
    console.log(user);
    console.log(photoURL);
    console.log(config);
    // Gets the profileURL from provider data and save the image on Storage with the required metadata.
    // https://stackoverflow.com/questions/41352150/typeerror-firebase-storage-is-not-a-function
    const fileMetadata = { customMetadata: { type: "avatar", id: 1, user: user.uid } };
    // const bucket = gcs().bucket("fabricelements.appspot.com");
    const bucket = admin.storage().bucket();
    // bucket.upload(photoURL, {
    //   destination: `images/user/${user.uid}/avatar/1.jpg`,
    //   metadata: fileMetadata,
    // });
    const options = {
        method: "GET",
        uri: photoURL,
    };
    try {
        const body = await rp(options);
        /* await bucket.upload(body, (err, file) => {
          if (!err) {
            // "zebra.jpg" is now in your bucket.
            console.log(file);
            console.log("OK");
          } else {
            console.log(err);
          }
        });*/
    }
    catch (error) {
        const finalError = `Image get went wrong: ${error}`;
        throw new Error(finalError);
    }
    /*return rp(options)
      .then((parsedBody) => {
        console.log("Image obtained:", parsedBody);
        return parsedBody;
      })
      .catch((error) => {
        const finalError = `Image get went wrong: ${error}`;
        throw new Error(finalError);
      });*/
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
exports.default = functions.https.onRequest(async (request, response) => {
    // const object = event.data; // The Storage object.
    // const fileBucket = object.bucket; // The Storage bucket that contains the file.
    // let user = request.user;
    let user = { uid: "OCSn2Q1iVHNguWQvMVZQYDY4Zyj2" };
    let photoURL = "https://lh5.googleusercontent.com/-Jn0ysyLSmaA/AAAAAAAAAAI/AAAAAAAAA9g/rPX_9MlNK4M/photo.jpg";
    try {
        await storeImageFromSocial(user, photoURL);
        response.status(200).end("all good");
    }
    catch (error) {
        response.status(500).end(error);
    }
});
//# sourceMappingURL=demo.js.map