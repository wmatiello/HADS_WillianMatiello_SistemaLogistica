// src/hooks/usePallets.js
import { useState, useEffect } from "react";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePallets = () => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Escutar pallets em tempo real
  useEffect(() => {
    const q = query(collection(db, "pallets"), orderBy("criadoEm", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const palletsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPallets(palletsData);
    });

    return unsubscribe;
  }, []);

  const criarPallet = async (dadosPallet) => {
    setLoading(true);
    try {
      // Buscar pedido para calcular divergência
      const pedidoRef = doc(db, "pedidos", dadosPallet.pedidoId);
      const pedidoSnap = await getDoc(pedidoRef);
      
      if (!pedidoSnap.exists()) {
        throw new Error("Pedido não encontrado");
      }

      const pedido = pedidoSnap.data();
      const divergencia = dadosPallet.quantidade - pedido.quantidade;

      const palletCompleto = {
        ...dadosPallet,
        divergencia,
        status: "registrado",
        criadoPor: auth.currentUser.uid,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "pallets"), palletCompleto);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar pallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const atualizarPallet = async (palletId, dados) => {
    try {
      await updateDoc(doc(db, "pallets", palletId), {
        ...dados,
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar pallet:", error);
      throw error;
    }
  };

  const deletarPallet = async (palletId) => {
    try {
      await deleteDoc(doc(db, "pallets", palletId));
    } catch (error) {
      console.error("Erro ao deletar pallet:", error);
      throw error;
    }
  };

  return { 
    pallets, 
    criarPallet, 
    atualizarPallet, 
    deletarPallet, 
    loading 
  };
};