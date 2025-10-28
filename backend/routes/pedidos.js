const express = require("express");
const { criadoEm, atualizadoEm } = require("../utils/timestamps");

module.exports = (db) => {
  const router = express.Router();

  // Listar pedidos
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("pedidos").get();
      const pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Criar pedido
  router.post("/", async (req, res) => {
    try {
      const data = { ...req.body, criadoPor: req.user.uid, criadoEm: criadoEm(), atualizadoEm: criadoEm() };
      const ref = await db.collection("pedidos").add(data);
      const snap = await ref.get();
      res.status(201).json({ id: ref.id, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atualizar pedido
  router.put("/:id", async (req, res) => {
    try {
      const docRef = db.collection("pedidos").doc(req.params.id);
      await docRef.update({ ...req.body, atualizadoEm: atualizadoEm() });
      const snap = await docRef.get();
      res.json({ id: snap.id, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Deletar pedido
  router.delete("/:id", async (req, res) => {
    try {
      await db.collection("pedidos").doc(req.params.id).delete();
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
