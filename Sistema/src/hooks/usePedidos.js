// src/hooks/usePedidos.js
import { useState, useEffect } from "react";
<<<<<<< HEAD
import {
  collection, doc, addDoc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, serverTimestamp, where
=======
import { 
  collection, doc, addDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
  getDocs, getDoc, where, updateDoc
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    // 🔥 LISTENER REALTIME EM "pedidos"
    const pedidosQuery = query(
      collection(db, "pedidos"),
      orderBy("criadoEm", "desc")
    );

    const unsubscribePedidos = onSnapshot(pedidosQuery, (snapshot) => {
      setPedidos((prev) =>
        snapshot.docs.map((doc) => {
          const existing = prev.find(p => p.id === doc.id);
          return {
            id: doc.id,
            ...doc.data(),
            pallets: existing?.pallets || []   // mantém os pallets já anexados
          };
        })
      );
    });

    // 🔥 LISTENER REALTIME EM "pallets"
    const palletsQuery = query(collection(db, "pallets"));

    const unsubscribePallets = onSnapshot(palletsQuery, (snapshot) => {
      const todosPallets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Junta pedidos + pallets em tempo real
      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) => ({
          ...pedido,
          pallets: todosPallets.filter((p) => p.pedidoId === pedido.id)
        }))
      );
    });

    return () => {
      unsubscribePedidos();
      unsubscribePallets();
    };
  }, []);

  // Criar pedido
  const criarPedido = async (dados) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "pedidos"), {
        ...dados,
        quantidade: Number(dados.quantidade),
=======
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
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
        criadoPor: auth.currentUser?.uid ?? "sistema",
        status: "pendente",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        totalProduzido: 0,
        totalPeso: 0,
<<<<<<< HEAD
        divergencia: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FINALIZAR PEDIDO - NOVA FUNÇÃO
  const finalizarPedido = async (id) => {
    setLoading(true);
    try {
      const pedidoRef = doc(db, "pedidos", id);
      
      await updateDoc(pedidoRef, {
        status: "finalizado",
        atualizadoEm: serverTimestamp(),
        finalizadoEm: serverTimestamp(),
        finalizadoPor: auth.currentUser?.uid ?? "sistema",
      });

      console.log(`✅ Pedido ${id} finalizado com sucesso`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao finalizar pedido:", error);
      throw new Error("Erro ao finalizar pedido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ATUALIZAR STATUS DO PEDIDO - FUNÇÃO GENÉRICA
  const atualizarStatusPedido = async (id, novoStatus) => {
    setLoading(true);
    try {
      const pedidoRef = doc(db, "pedidos", id);
      
      const dadosAtualizacao = {
        status: novoStatus,
        atualizadoEm: serverTimestamp(),
      };

      // Se for finalizar, adiciona informações extras
      if (novoStatus === "finalizado") {
        dadosAtualizacao.finalizadoEm = serverTimestamp();
        dadosAtualizacao.finalizadoPor = auth.currentUser?.uid ?? "sistema";
      }

      await updateDoc(pedidoRef, dadosAtualizacao);

      console.log(`✅ Pedido ${id} atualizado para status: ${novoStatus}`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar status do pedido:", error);
      throw new Error("Erro ao atualizar status do pedido: " + error.message);
=======
        divergencia: 0
      };

      await addDoc(collection(db, "pedidos"), novoPedido);
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Editar pedido
  const editarPedido = async (id, novosDados) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "pedidos", id), {
        ...novosDados,
        atualizadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Erro ao editar pedido:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Deletar pedido
  const deletarPedido = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "pedidos", id));
      console.log(`✅ Pedido ${id} excluído com sucesso`);
    } catch (error) {
      console.error("❌ Erro ao excluir pedido:", error);
      throw error;
    } finally {
      setLoading(false);
    }
=======
  const deletarPedido = async (id) => {
    await deleteDoc(doc(db, "pedidos", id));
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
  };

  return {
    pedidos,
    criarPedido,
<<<<<<< HEAD
    editarPedido,
    deletarPedido,
    finalizarPedido, // ✅ NOVA FUNÇÃO
    atualizarStatusPedido, // ✅ NOVA FUNÇÃO
    loading,
  };
};
=======
    deletarPedido,
    loading
  };
};
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
