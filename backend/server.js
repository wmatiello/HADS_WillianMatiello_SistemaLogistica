console.log("Rodando arquivo:", __filename);

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const admin = require("firebase-admin");

// --- Inicializar Firebase Admin ---
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
const credentialsJson = process.env.FIREBASE_CREDENTIALS;

if (credentialsJson) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(credentialsJson)),
  });
  console.log("Firebase Admin inicializado via JSON da variável de ambiente.");
} else if (credentialsPath) {
  const fullPath = path.resolve(__dirname, credentialsPath);
  if (fs.existsSync(fullPath)) {
    const serviceAccount = require(fullPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin inicializado via arquivo:", fullPath);
  } else {
    console.error("Arquivo de credencial não encontrado em:", fullPath);
    process.exit(1);
  }
} else {
  console.error("Nenhuma credencial do Firebase Admin encontrada.");
  process.exit(1);
}

const db = admin.firestore();

// --- Configurar Express ---
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Middleware: verificar token Firebase ---
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = { uid: decoded.uid, email: decoded.email };
    const snap = await db.collection("usuarios").doc(decoded.uid).get();
    req.profile = snap.exists ? snap.data() : null;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
}

// --- Helpers de autorização ---
function onlyGerente(req, res, next) {
  if (req.profile?.perfil === "gerente") return next();
  return res.status(403).json({ error: "Acesso negado. Requer perfil gerente." });
}

function gerenteOuConferente(req, res, next) {
  if (["gerente", "conferente"].includes(req.profile?.perfil)) return next();
  return res.status(403).json({ error: "Acesso negado. Requer gerente ou conferente." });
}

// --- Rotas básicas ---
app.get("/", (req, res) => res.json({ ok: true, msg: "API Logística Node + Firebase Admin funcionando" }));

// --- Rotas de pedidos ---
app.get("/api/pedidos", verifyToken, async (req, res) => {
  const snap = await db.collection("pedidos").get();
  const pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(pedidos);
});

app.post("/api/pedidos", verifyToken, onlyGerente, async (req, res) => {
  const data = { ...req.body, criadoPor: req.user.uid, criadoEm: admin.firestore.FieldValue.serverTimestamp() };
  const ref = await db.collection("pedidos").add(data);
  const snap = await ref.get();
  res.status(201).json({ id: ref.id, ...snap.data() });
});

// --- Rotas de pallets ---
app.get("/api/pedidos/:id/pallets", verifyToken, gerenteOuConferente, async (req, res) => {
  const snap = await db.collection("pedidos").doc(req.params.id).collection("pallets").get();
  const pallets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(pallets);
});

app.post("/api/pedidos/:id/pallets", verifyToken, gerenteOuConferente, async (req, res) => {
  const colRef = db.collection("pedidos").doc(req.params.id).collection("pallets");
  const data = { ...req.body, criadoPor: req.user.uid, criadoEm: admin.firestore.FieldValue.serverTimestamp() };
  const ref = await colRef.add(data);
  const snap = await ref.get();
  res.status(201).json({ id: ref.id, ...snap.data() });
});

// --- Rotas de rotas ---
app.get("/api/rotas", verifyToken, async (req, res) => {
  const snap = await db.collection("rotas").get();
  const rotas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(rotas);
});

app.post("/api/rotas", verifyToken, onlyGerente, async (req, res) => {
  const data = { ...req.body, criadoPor: req.user.uid, criadoEm: admin.firestore.FieldValue.serverTimestamp() };
  const ref = await db.collection("rotas").add(data);
  const snap = await ref.get();
  res.status(201).json({ id: ref.id, ...snap.data() });
});

// --- Rotas de usuários ---
app.post("/api/usuarios/:uid", verifyToken, onlyGerente, async (req, res) => {
  await db.collection("usuarios").doc(req.params.uid).set(req.body, { merge: true });
  const snap = await db.collection("usuarios").doc(req.params.uid).get();
  res.json({ id: req.params.uid, ...snap.data() });
});

app.get("/api/me", verifyToken, (req, res) => {
  res.json({ user: req.user, profile: req.profile });
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
