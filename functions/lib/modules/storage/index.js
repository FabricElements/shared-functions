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
const functions = require("firebase-functions");
const imgIX = require("./imgix");
const mark_1 = require("./mark");
// import * as avatar from "./avatar";
const config = functions.config();
/**
 * Storage base function
 */
exports.default = functions.storage.object().onChange((event) => __awaiter(this, void 0, void 0, function* () {
    const object = event.data; // The Storage object.
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    // Exit if this is a move or deletion event.
    if (resourceState === "not_exists") {
        console.log("This is a deletion event.");
    }
    if (contentType.startsWith("image/")) {
        if (object.metadata) {
            try {
                yield mark_1.default(object.metadata, resourceState);
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            yield imgIX.purge(filePath);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    return;
    // Get the file name.
    // const fileName = path.basename(filePath);
}));
//# sourceMappingURL=index.js.map