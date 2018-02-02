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
    //   destination: `images/users/${user.uid}/avatar/1.jpg`,
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
exports.created = functions.auth.user().onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    const user = event.data;
    const name = user.displayName ? user.displayName : null;
    const email = user.email ? user.email : null;
    const providerData = user.providerData ? user.providerData : null;
    const photoURL = user.photoURL ? user.photoURL : null;
    try {
        // Set user profile
        yield firestore.set("users", user.uid, {
            name,
        });
        // Set basic user account
        yield firestore.set("users-account", user.uid, {
            email,
            providerData,
        });
        /*if (photoURL) {
          await storeImageFromSocial(user, photoURL);
        }*/
    }
    catch (error) {
        throw new Error(error);
    }
}));
/**
 * On user created
 * @type {CloudFunction<UserRecord>}
 */
exports.deleted = functions.auth.user().onDelete((event) => __awaiter(this, void 0, void 0, function* () {
    const uid = event.data.uid;
    try {
        // Remove user related documents
        yield firestore.removeDocument("users", uid);
        yield firestore.removeDocument("users-account", uid);
        yield firestore.removeDocument("users-avatars", uid);
        yield firestore.removeDocument("users-friends", uid);
        yield firestore.removeDocument("users-settings", uid);
        yield firestore.removeDocument("friends-requests", uid);
        yield firestore.removeDocument("ignored-users", uid);
        // Remove user from docs collection
        yield firestore.removeMatch("users-friends", uid);
        yield firestore.removeMatch("friends-requests", uid);
        yield firestore.removeMatch("ignored-users", uid);
    }
    catch (error) {
        throw new Error(error);
    }
}));
//# sourceMappingURL=auth.js.map