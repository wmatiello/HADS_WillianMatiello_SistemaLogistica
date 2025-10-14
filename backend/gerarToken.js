require("dotenv").config();

const admin = require("firebase-admin");
const path = require("path");

// Inicializar Firebase Admin (mesmo que no server.js)
const serviceAccount = require(path.resolve(__dirname, process.env.FIREBASE_CREDENTIALS_PATH));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Coloque o UID do usuário que você criou no Authentication
const UID = "qihQlf1FG3XL2KjYAksywTbvMaC3";

async function gerarToken(uid) {
  try {
    const token = await admin.auth().createCustomToken(uid);
    console.log("Token de teste:", token);
  } catch (err) {
    console.error(err);
  }
}

gerarToken(UID);
