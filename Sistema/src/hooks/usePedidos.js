// src/hooks/usePedidos.js
import { useState, useEffect } from "react";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Escutar pedidos em tempo real
  useEffect(() => {
    const q = query(collection(db, "pedidos"), orderBy("criadoEm", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pedidosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPedidos(pedidosData);
    });

    return unsubscribe;
  }, []);

  const criarPedido = async (dadosPedido) => {
    setLoading(true);
    try {
      const pedidoCompleto = {
        ...dadosPedido,
        status: "pendente",
        criadoPor: auth.currentUser.uid,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "pedidos"), pedidoCompleto);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const atualizarPedido = async (pedidoId, dados) => {
    try {
      await updateDoc(doc(db, "pedidos", pedidoId), {
        ...dados,
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  };

  const deletarPedido = async (pedidoId) => {
    try {
      await deleteDoc(doc(db, "pedidos", pedidoId));
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      throw error;
    }
  };

  return { 
    pedidos, 
    criarPedido, 
    atualizarPedido, 
    deletarPedido, 
    loading 
  };
};