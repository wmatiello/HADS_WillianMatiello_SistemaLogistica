import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "chave_secreta_logistica";

// Aqui futuramente você pode verificar o usuário no Firebase ou no seu banco
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Exemplo simples de validação
  if (email === "admin@logistica.com" && password === "123456") {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "2h" });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: "Credenciais inválidas" });
});

export default router;
