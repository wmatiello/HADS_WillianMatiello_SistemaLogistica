// src/hooks/usePedidos.js
import { useState, useEffect } from "react";
import { 
  collection, doc, addDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
  getDocs, getDoc, where, updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "pedidos"), orderBy("criadoEm", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const pedidosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 🔥 Buscar pallets relacionados para cada pedido
      const pedidosComPallets = await Promise.all(
        pedidosData.map(async pedido => {
          const palletsQuery = query(
            collection(db, "pallets"),
            where("pedidoId", "==", pedido.id)
          );

          const palletsSnap = await getDocs(palletsQuery);
          const pallets = palletsSnap.docs.map(d => ({
            id: d.id,
            ...d.data()
          }));

          return { ...pedido, pallets };
        })
      );

      setPedidos(pedidosComPallets);
    });

    return unsubscribe;
  }, []);

  const criarPedido = async (dados) => {
    setLoading(true);
    try {
      const novoPedido = {
        ...dados,
        quantidade: parseInt(dados.quantidade),
        criadoPor: auth.currentUser?.uid ?? "sistema",
        status: "pendente",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        totalProduzido: 0,
        totalPeso: 0,
        divergencia: 0
      };

      await addDoc(collection(db, "pedidos"), novoPedido);
    } finally {
      setLoading(false);
    }
  };

  const deletarPedido = async (id) => {
    await deleteDoc(doc(db, "pedidos", id));
  };

  return {
    pedidos,
    criarPedido,
    deletarPedido,
    loading
  };
};
