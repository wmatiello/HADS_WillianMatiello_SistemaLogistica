const express = require("express");
const admin = require("firebase-admin");
const { criadoEm, atualizadoEm } = require("../utils/timestamps");

module.exports = (db) => {
  const router = express.Router();

  // Listar usuários
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("usuarios").get();
      const usuarios = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Criar usuário
  router.post("/", async (req, res) => {
    try {
      const { email, senha, nome, perfil } = req.body;
      if (!email || !senha || !nome || !perfil) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const userRecord = await admin.auth().createUser({ email, password: senha });
      await db.collection("usuarios").doc(userRecord.uid).set({
        nome, email, perfil, criadoEm: criadoEm()
      });

      res.status(201).json({ id: userRecord.uid, email, nome, perfil });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Atualizar usuário
  router.put("/:id", async (req, res) => {
    try {
      const docRef = db.collection("usuarios").doc(req.params.id);
      await docRef.update({ ...req.body, atualizadoEm: atualizadoEm() });
      const snap = await docRef.get();
      res.json({ id: snap.id, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Deletar usuário
  router.delete("/:id", async (req, res) => {
    try {
      await admin.auth().deleteUser(req.params.id);
      await db.collection("usuarios").doc(req.params.id).delete();
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
