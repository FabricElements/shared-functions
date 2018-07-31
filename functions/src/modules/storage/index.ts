/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as functions from "firebase-functions";
import * as imgIX from "./imgix";
import mark from "./mark";
// import * as avatar from "./avatar";

const config = functions.config();

/**
 * Storage base function
 */
export default functions.storage.object().onFinalize(async (object, context) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

  if (contentType.startsWith("image/")) {
    if (object.metadata) {
      try {
        await mark(object.metadata, true);
      } catch (error) {
        throw new Error(error);
      }
    }
    try {
      await imgIX.purge(filePath);
    } catch (error) {
      throw new Error(error);
    }
  }

  return null;
  // Get the file name.
  // const fileName = path.basename(filePath);
});
