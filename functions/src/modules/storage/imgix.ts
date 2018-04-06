/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as functions from "firebase-functions";
import * as rp from "request-promise";

const config = functions.config();

/**
 * Purge image from imgIX url
 *
 * @param {String} url
 */
export const purge = (url) => {
  const clearRef = url.split("images/")[1];
  if (!clearRef) {
    console.log("This image is not in the 'images' directory");
    return;
  }

  const options = {
    auth: {
      sendImmediately: true,
      user: config.imgix.key,
    },
    body: {
      url: `https://${config.imgix.domain}/${clearRef}`,
    },
    headers: {
      "Content-Type": "application/json",
    },
    json: true,
    method: "POST",
    uri: "https://api.imgix.com/v2/image/purger",
  };

  return rp(options)
    .then((parsedBody) => {
      console.log("Image purged:", clearRef);
    })
    .catch((error) => {
      const finalError = `Image clean up went wrong: ${error}`;
      throw new Error(finalError);
    });
};
