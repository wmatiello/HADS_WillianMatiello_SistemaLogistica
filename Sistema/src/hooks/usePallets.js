// src/hooks/usePallets.js
import { useState, useEffect } from "react";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp,
  getDoc, getDocs, where
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePallets = () => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Carregar pallets em tempo real
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

  // 🔥 Criar pallet
  const criarPallet = async (dadosPallet) => {
    setLoading(true);
    try {
      const pedidoRef = doc(db, "pedidos", dadosPallet.pedidoId);
      const pedidoSnap = await getDoc(pedidoRef);

      if (!pedidoSnap.exists()) {
        throw new Error("Pedido não encontrado");
      }

      const pedido = pedidoSnap.data();

      // Calcular divergência (quantidade real vs quantidade planejada)
      const divergencia =
        parseInt(dadosPallet.quantidade) - parseInt(pedido.quantidade || 0);

      const novoPallet = {
        ...dadosPallet,
        quantidade: parseInt(dadosPallet.quantidade),
        peso: parseFloat(dadosPallet.peso),
        divergencia,
        status: "registrado",
        criadoPor: auth.currentUser?.uid ?? "sistema",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "pallets"), novoPallet);

      // Atualizar total produzido do pedido
      await atualizarTotalProduzidoPedido(dadosPallet.pedidoId);

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar pallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Calcular total produzido do pedido
  const atualizarTotalProduzidoPedido = async (pedidoId) => {
    try {
      const palletsQuery = query(
        collection(db, "pallets"),
        where("pedidoId", "==", pedidoId)
      );

      const palletsSnap = await getDocs(palletsQuery);

      // Somar quantidades
      const totalProduzido = palletsSnap.docs.reduce((total, doc) => {
        return total + parseInt(doc.data().quantidade);
      }, 0);

      await updateDoc(doc(db, "pedidos", pedidoId), {
        totalProduzido,
        atualizadoEm: serverTimestamp()
      });

      console.log("🔄 Total produzido atualizado:", totalProduzido);
    } catch (error) {
      console.error("Erro ao atualizar total produzido:", error);
    }
  };

  // 🔥 Excluir pallet
  const deletarPallet = async (palletId) => {
    try {
      const palletDoc = await getDoc(doc(db, "pallets", palletId));

      if (!palletDoc.exists()) return;

      const pallet = palletDoc.data();
      const pedidoId = pallet.pedidoId;

      await deleteDoc(doc(db, "pallets", palletId));

      // Atualizar total produzido do pedido
      if (pedidoId) {
        await atualizarTotalProduzidoPedido(pedidoId);
      }
    } catch (error) {
      console.error("Erro ao deletar pallet:", error);
      throw error;
    }
  };

  return { 
    pallets, 
    criarPallet, 
    deletarPallet, 
    loading 
  };
};
