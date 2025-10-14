const admin = require("firebase-admin");

// Funções para criar timestamps consistentes
const criadoEm = () => admin.firestore.FieldValue.serverTimestamp();
const atualizadoEm = () => admin.firestore.FieldValue.serverTimestamp();

module.exports = { criadoEm, atualizadoEm };
