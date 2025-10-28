const express = require("express");
const { criadoEm, atualizadoEm } = require("../utils/timestamps");

module.exports = (db) => {
  const router = express.Router();

  // Listar rotas
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("rotas").get();
      const rotas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(rotas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Criar rota
  router.post("/", async (req, res) => {
    try {
      const { nome, cidade } = req.body;
      if (!nome || !cidade) return res.status(400).json({ error: "Campos obrigatórios ausentes" });

      const data = { ...req.body, criadoPor: req.user.uid, criadoEm: criadoEm(), atualizadoEm: criadoEm() };
      const ref = await db.collection("rotas").add(data);
      const snap = await ref.get();
      res.status(201).json({ id: ref.id, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atualizar rota
  router.put("/:id", async (req, res) => {
    try {
      const docRef = db.collection("rotas").doc(req.params.id);
      await docRef.update({ ...req.body, atualizadoEm: atualizadoEm() });
      const snap = await docRef.get();
      res.json({ id: snap.id, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Deletar rota
  router.delete("/:id", async (req, res) => {
    try {
      await db.collection("rotas").doc(req.params.id).delete();
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
