"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const gcs = require("@google-cloud/storage");
const functions = require("firebase-functions");
const rp = require("request-promise");
const firestore = require("../shared/firestore");
const config = functions.config();
const storeImageFromSocial = (user, photoURL) => {
    console.log("obtainImageFromSocial");
    console.log(user);
    console.log(photoURL);
    console.log(config);
    // Gets the profileURL from provider data and save the image on Storage with the required metadata.
    // https://stackoverflow.com/questions/41352150/typeerror-firebase-storage-is-not-a-function
    const fileMetadata = { customMetadata: { type: "avatar", id: 1, user: user.uid } };
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
exports.created = functions.auth.user().onCreate((userRecord, context) => __awaiter(this, void 0, void 0, function* () {
    const name = userRecord.displayName ? userRecord.displayName : null;
    const email = userRecord.email ? userRecord.email : null;
    const providerData = userRecord.providerData ? userRecord.providerData : null;
    const avatar = userRecord.photoURL ? userRecord.photoURL : null;
    // Set user profile
    yield firestore.set("user", userRecord.uid, {
        avatar,
        name,
    });
    // Set basic user account
    yield firestore.set(`user/${userRecord.uid}/private`, "account", {
        email,
        providerData,
    });
    // Set default users settings
    yield firestore.set(`user/${userRecord.uid}/private`, "settings", {
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
}));
/**
 * On user deleted
 * @type {CloudFunction<UserRecord>}
 */
exports.deleted = functions.auth.user().onDelete((userRecord, context) => __awaiter(this, void 0, void 0, function* () {
    // Remove user related documents
    yield firestore.removeDocument("user", userRecord.uid);
    yield firestore.removeDocument("connections", userRecord.uid);
    yield firestore.removeDocument("connection-request", userRecord.uid);
    yield firestore.removeDocument("connection-ignored", userRecord.uid);
    // Remove user from docs collection
    yield firestore.removeMatch("connections", userRecord.uid);
    yield firestore.removeMatch("connection-request", userRecord.uid);
    yield firestore.removeMatch("connection-ignored", userRecord.uid);
}));
//# sourceMappingURL=auth.js.map