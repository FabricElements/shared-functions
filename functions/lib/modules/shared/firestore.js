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
const FieldValue = admin.firestore.FieldValue;
/**
 *
 * @param {string} collection
 * @return {Array}
 */
exports.getCollectionArray = (collection) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection);
    // const data = await ref.where("capital", "==", true).get();
    const snapshot = yield ref.get();
    if (!snapshot || !snapshot.docs) {
        return [];
    }
    return snapshot.docs.map((doc) => {
        let docData = doc.data();
        docData.id = doc.id;
        return docData;
    });
});
/**
 *
 * @param {string} collection
 * @param {string} id
 * @return {Array}
 */
exports.getDocument = (collection, id) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection).doc(id);
    return ref.get().then((doc) => {
        if (!doc.exists) {
            return [];
        }
        else {
            const data = doc.data();
            return Object.keys(data).map((key) => key);
        }
    }).catch((error) => {
        // console.error("Error getting documents", error);
        throw new Error(error);
    });
});
/**
 * Get where basic
 *
 * @param {string} collection
 * @param {string} key
 * @param {WhereFilterOp} condition
 * @param value
 * @return {Array}
 */
exports.getWhereBasic = (collection, key, condition, value) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection).where(key, condition, value);
    return ref.get().then((snapshot) => {
        if (!snapshot || !snapshot.docs) {
            return [];
        }
        return snapshot.docs.map((doc) => doc.id);
    }).catch((error) => {
        // console.error("Error getting documents", error);
        throw new Error(error);
    });
});
/**
 * Get where basic
 *
 * @param {string} collection
 * @param {string} key
 * @param order
 * @return {Array}
 */
exports.getOrderByBasic = (collection, key, order) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection).orderBy(key, order);
    return ref.get().then((snapshot) => {
        if (!snapshot || !snapshot.docs) {
            return [];
        }
        return snapshot.docs.map((doc) => doc.id);
    }).catch((error) => {
        // console.error("Error getting documents", error);
        throw new Error(error);
    });
});
/**
 * Remove document from collection
 *
 * @param {string} collection
 * @param {string} id
 * @return {Promise<void>}
 */
exports.removeDocument = (collection, id) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection).doc(id);
    return ref.delete();
});
/**
 * Remove key from document
 *
 * @param {string} collection
 * @param {string} doc
 * @param {string} field
 * @return {Promise<void>}
 */
exports.deleteField = (collection, doc, field) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection);
    return ref.doc(doc).update({
        [field]: FieldValue.delete(),
    });
});
/**
 * Remove key on documents that contain it
 *
 * @param {string} collection
 * @param {string} id
 * @return {Promise<T>}
 */
exports.removeMatch = (collection, id) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection);
    const snapshot = yield ref.orderBy(id).get();
    if (!snapshot || !snapshot.docs) {
        return;
    }
    snapshot.forEach((doc) => {
        return exports.deleteField(collection, doc.id, id);
    });
});
/**
 * Remove key from document
 *
 * @param {string} collection
 * @param {string} doc
 * @param data
 * @param merge
 * @return {Promise<void>}
 */
exports.set = (collection, doc, data, merge = false) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.firestore();
    const ref = db.collection(collection);
    return ref.doc(doc).set(data, { merge });
});
//# sourceMappingURL=firestore.js.map