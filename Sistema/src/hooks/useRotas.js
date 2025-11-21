// src/hooks/useRotas.js
import { useState, useEffect } from "react";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp,
  arrayUnion, arrayRemove
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const useRotas = () => {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "rotas"), orderBy("criadoEm", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rotasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRotas(rotasData);
    });

    return unsubscribe;
  }, []);

  const criarRota = async (dadosRota) => {
    setLoading(true);
    try {
      const rotaCompleta = {
        ...dadosRota,
        pedidos: [], // Array de IDs dos pedidos prontos
        status: "planejada", // planejada, em_transporte, concluida
        criadoPor: auth.currentUser.uid,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "rotas"), rotaCompleta);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADICIONAR PEDIDO PRONTO À ROTA
  const adicionarPedidoARota = async (rotaId, pedidoId) => {
    try {
      await updateDoc(doc(db, "rotas", rotaId), {
        pedidos: arrayUnion(pedidoId),
        atualizadoEm: serverTimestamp()
      });

      // ✅ MARCAR PEDIDO COMO "em_transporte"
      await updateDoc(doc(db, "pedidos", pedidoId), {
        status: "em_transporte",
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao adicionar pedido à rota:", error);
      throw error;
    }
  };

  const removerPedidoDaRota = async (rotaId, pedidoId) => {
    try {
      await updateDoc(doc(db, "rotas", rotaId), {
        pedidos: arrayRemove(pedidoId),
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao remover pedido da rota:", error);
      throw error;
    }
  };

  const deletarRota = async (rotaId) => {
    try {
      await deleteDoc(doc(db, "rotas", rotaId));
    } catch (error) {
      console.error("Erro ao deletar rota:", error);
      throw error;
    }
  };

  return { 
    rotas, 
    criarRota, 
    adicionarPedidoARota,
    removerPedidoDaRota,
    deletarRota,
    loading 
  };
};