const express = require("express");
const { criadoEm, atualizadoEm } = require("../utils/timestamps");

module.exports = (db) => {
  const router = express.Router();

  // Listar pallets de um pedido
  router.get("/:pedidoId", async (req, res) => {
    try {
      const snap = await db.collection("pedidos").doc(req.params.pedidoId).collection("pallets").get();
      const pallets = snap.docs.map(d => ({ id: d.id, pedidoId: req.params.pedidoId, ...d.data() }));
      res.json(pallets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Criar pallet
  router.post("/:pedidoId", async (req, res) => {
    try {
      const { codigo, quantidade, peso } = req.body;
      if (!codigo || !quantidade || !peso) return res.status(400).json({ error: "Campos obrigatórios ausentes" });

      const data = { ...req.body, criadoPor: req.user.uid, criadoEm: criadoEm(), atualizadoEm: criadoEm() };
      const ref = await db.collection("pedidos").doc(req.params.pedidoId).collection("pallets").add(data);
      const snap = await ref.get();
      res.status(201).json({ id: ref.id, pedidoId: req.params.pedidoId, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atualizar pallet
  router.put("/:pedidoId/:palletId", async (req, res) => {
    try {
      const docRef = db.collection("pedidos").doc(req.params.pedidoId).collection("pallets").doc(req.params.palletId);
      await docRef.update({ ...req.body, atualizadoEm: atualizadoEm() });
      const snap = await docRef.get();
      res.json({ id: snap.id, pedidoId: req.params.pedidoId, ...snap.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Deletar pallet
  router.delete("/:pedidoId/:palletId", async (req, res) => {
    try {
      await db.collection("pedidos").doc(req.params.pedidoId).collection("pallets").doc(req.params.palletId).delete();
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
