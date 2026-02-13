const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

/* 
  If no Firebase app has been created yet, create one. 
  This is important to prevent "Firebase app already exists" errors when this module is imported multiple times.
*/
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "multi-product-viewer.firebasestorage.app",
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = {
  admin,
  db,
  bucket,
};
