/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as types from "../helpers/types";

const FieldValue = admin.firestore.FieldValue;

/**
 *
 * @param {string} collection
 * @return {Array}
 */
export const getCollectionArray = async (collection) => {
  const db = admin.firestore();
  const ref = db.collection(collection);

  // const data = await ref.where("capital", "==", true).get();
  const snapshot = await ref.get();
  if (!snapshot || !snapshot.docs) {
    return [];
  }
  return snapshot.docs.map((doc) => {
    let docData: any | object = doc.data();
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
export const getDocument = async (collection: string, id: string) => {
  const db = admin.firestore();
  const ref = db.collection(collection).doc(id);
  return ref.get().then((doc) => {
    if (!doc.exists) {
      return [];
    } else {
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
export const getWhereBasic = async (collection: string, key: string, condition: types.WhereFilterOp, value: any) => {
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
export const getOrderByBasic = async (collection: string, key: string, order?: types.OrderByDirection) => {
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
export const removeDocument = async (collection: string, id: string) => {
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
export const deleteField = async (collection: string, doc: string, field: string) => {
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
export const removeMatch = async (collection: string, id: string) => {
  const db = admin.firestore();
  const ref = db.collection(collection);
  const snapshot = await ref.orderBy(id).get();
  if (!snapshot || !snapshot.docs) {
    return;
  }
  snapshot.forEach((doc) => {
    return deleteField(collection, doc.id, id);
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
export const set = async (collection: string, doc: string, data: object, merge: boolean = false) => {
  const db = admin.firestore();
  const ref = db.collection(collection);
  return ref.doc(doc).set(data, {merge});
};
