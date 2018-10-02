"use strict";
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
exports.getCollectionArray = async (collection) => {
    const db = admin.firestore();
    const ref = db.collection(collection);
    // const data = await ref.where("capital", "==", true).get();
    const snapshot = await ref.get();
    if (!snapshot || !snapshot.docs) {
        return [];
    }
    return snapshot.docs.map((doc) => {
        let docData = doc.data();
        docData.id = doc.id;
        return docData;
    });
};
/**
 *
 * @param {string} collection
 * @param {string} id
 * @return {Array}
 */
exports.getDocument = async (collection, id) => {
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
};
/**
 * Get where basic
 *
 * @param {string} collection
 * @param {string} key
 * @param {WhereFilterOp} condition
 * @param value
 * @return {Array}
 */
exports.getWhereBasic = async (collection, key, condition, value) => {
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
};
/**
 * Get where basic
 *
 * @param {string} collection
 * @param {string} key
 * @param order
 * @return {Array}
 */
exports.getOrderByBasic = async (collection, key, order) => {
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
};
/**
 * Remove document from collection
 *
 * @param {string} collection
 * @param {string} id
 * @return {Promise<void>}
 */
exports.removeDocument = async (collection, id) => {
    const db = admin.firestore();
    const ref = db.collection(collection).doc(id);
    return ref.delete();
};
/**
 * Remove key from document
 *
 * @param {string} collection
 * @param {string} doc
 * @param {string} field
 * @return {Promise<void>}
 */
exports.deleteField = async (collection, doc, field) => {
    const db = admin.firestore();
    const ref = db.collection(collection);
    return ref.doc(doc).update({
        [field]: FieldValue.delete(),
    });
};
/**
 * Remove key on documents that contain it
 *
 * @param {string} collection
 * @param {string} id
 * @return {Promise<T>}
 */
exports.removeMatch = async (collection, id) => {
    const db = admin.firestore();
    const ref = db.collection(collection);
    const snapshot = await ref.orderBy(id).get();
    if (!snapshot || !snapshot.docs) {
        return;
    }
    snapshot.forEach((doc) => {
        return exports.deleteField(collection, doc.id, id);
    });
};
/**
 * Remove key from document
 *
 * @param {string} collection
 * @param {string} doc
 * @param data
 * @param merge
 * @return {Promise<void>}
 */
exports.set = async (collection, doc, data, merge = false) => {
    const db = admin.firestore();
    const ref = db.collection(collection);
    return ref.doc(doc).set(data, { merge });
};
//# sourceMappingURL=firestore.js.map