console.log("Rodando arquivo:", __filename);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const app = express();

// Inicializar Firebase Admin
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
if (!credentialsPath || !fs.existsSync(path.resolve(__dirname, credentialsPath))) {
  console.error("Arquivo de credencial do Firebase não encontrado!");
  process.exit(1);
}
const serviceAccount = require(path.resolve(__dirname, credentialsPath));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
console.log("Firebase Admin inicializado.");

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middlewares separados
const verifyTokenMiddleware = require("./middlewares/verifyToken");
const onlyGerente = require("./middlewares/onlyGerente");
const gerenteOuConferente = require("./middlewares/gerenteOuConferente");

// Wrapper para passar o db ao middleware verifyToken
const verify = (req, res, next) => verifyTokenMiddleware(db, req, res, next);

// Teste inicial da API
app.get("/", (req, res) => res.json({ ok: true, msg: "API Logística Node + Firebase Admin funcionando" }));

// Rotas
app.use("/api/pedidos", verify, require("./routes/pedidos")(db));
app.use("/api/pallets", verify, require("./routes/pallets")(db));
app.use("/api/rotas", verify, require("./routes/rotas")(db));
app.use("/api/usuarios", verify, require("./routes/usuarios")(db));

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
