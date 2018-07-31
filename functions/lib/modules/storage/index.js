"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const functions = require("firebase-functions");
const imgIX = require("./imgix");
const mark_1 = require("./mark");
// import * as avatar from "./avatar";
const config = functions.config();
/**
 * Storage base function
 */
exports.default = functions.storage.object().onFinalize(async (object, context) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    if (contentType.startsWith("image/")) {
        if (object.metadata) {
            try {
                await mark_1.default(object.metadata, true);
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await imgIX.purge(filePath);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    return null;
    // Get the file name.
    // const fileName = path.basename(filePath);
});
//# sourceMappingURL=index.js.map