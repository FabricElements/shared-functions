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
const admin = require("firebase-admin");
/**
 * Mark ond DB depending on type
 *
 * @param data
 * @param state
 * @return {Promise<T>}
 */
exports.default = (data, state) => __awaiter(this, void 0, void 0, function* () {
    let refBase = null;
    let imageJSON = {};
    if (!data.id || !data.type) {
        return;
    }
    if (data.type === "avatar") {
        if (!data.user) {
            return;
        }
        refBase = `user/${data.user}/basic/avatars`;
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
    try {
        if (state === "not_exists") {
            yield doc.update(imageJSON);
            console.log("Image deleted!");
        }
        else {
            yield doc.set(imageJSON, { merge: true });
            console.log("Image added");
        }
    }
    catch (error) {
        throw new Error(error);
    }
});
//# sourceMappingURL=mark.js.map