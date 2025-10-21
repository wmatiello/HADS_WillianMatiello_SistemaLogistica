// middlewares/verifyToken.js
const admin = require("firebase-admin");

async function verifyToken(db, req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.*)$/);
    if (!match) return res.status(401).json({ error: "Token não fornecido" });

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = { uid: decoded.uid, email: decoded.email };

    const snap = await db.collection("usuarios").doc(decoded.uid).get();
    req.profile = snap.exists ? snap.data() : null;

    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = verifyToken;
