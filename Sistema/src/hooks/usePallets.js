<<<<<<< HEAD
// src/hooks/usePallets.js - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  getDocs,
  where,
=======
// src/hooks/usePallets.js
import { useState, useEffect } from "react";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp,
  getDoc, getDocs, where
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePallets = () => {
  const [pallets, setPallets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Carregar pallets em tempo real
  useEffect(() => {
    const q = query(collection(db, "pallets"), orderBy("criadoEm", "desc"));
<<<<<<< HEAD

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const palletsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
=======
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const palletsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
      }));
      setPallets(palletsData);
    });

    return unsubscribe;
  }, []);

<<<<<<< HEAD
  // 🔥 Criar pallet - VERSÃO OTIMIZADA
  const criarPallet = async (dadosPallet) => {
    setLoading(true);
    try {
      console.log("🚀 Iniciando criação de pallet...");
      
=======
  // 🔥 Criar pallet
  const criarPallet = async (dadosPallet) => {
    setLoading(true);
    try {
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
      const pedidoRef = doc(db, "pedidos", dadosPallet.pedidoId);
      const pedidoSnap = await getDoc(pedidoRef);

      if (!pedidoSnap.exists()) {
        throw new Error("Pedido não encontrado");
      }

      const pedido = pedidoSnap.data();
<<<<<<< HEAD
      
      console.log("📊 Pedido encontrado:", {
        id: dadosPallet.pedidoId,
        cliente: pedido.cliente,
        produto: pedido.produto,
        quantidade: pedido.quantidade
      });

      // Calcular pesos
      const pesoLiquido = parseFloat(dadosPallet.pesoLiquido) || 0;
      const pesoBruto = parseFloat(dadosPallet.pesoBruto) || 0;
      const tara = pesoBruto - pesoLiquido;
      const quantidade = parseInt(dadosPallet.quantidade) || 0;

      // Criar pallet
      const novoPallet = {
        ...dadosPallet,
        codigo: dadosPallet.codigo,
        cliente: pedido.cliente,
        quantidade: quantidade,
        tipoItem: dadosPallet.tipoItem,
        pesoLiquido: pesoLiquido,
        pesoBruto: pesoBruto,
        tara: tara,
        status: "registrado",
        criadoPor: auth.currentUser?.uid ?? "sistema",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      };

      console.log("📦 Criando pallet...");
      const docRef = await addDoc(collection(db, "pallets"), novoPallet);
      console.log("✅ Pallet criado com ID:", docRef.id);

      // 🔥 ATUALIZAR TOTAIS DO PEDIDO
      await atualizarTotaisPedido(dadosPallet.pedidoId);

      return docRef.id;
    } catch (error) {
      console.error("❌ Erro ao criar pallet:", error);
=======

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
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
      throw error;
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // 🔥 Calcular TOTAIS do pedido - VERSÃO COMPLETA
  const atualizarTotaisPedido = async (pedidoId) => {
    try {
      console.log("🔄 Calculando totais para pedido:", pedidoId);
      
      // Buscar todos os pallets do pedido
=======
  // 🔥 Calcular total produzido do pedido
  const atualizarTotalProduzidoPedido = async (pedidoId) => {
    try {
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
      const palletsQuery = query(
        collection(db, "pallets"),
        where("pedidoId", "==", pedidoId)
      );

      const palletsSnap = await getDocs(palletsQuery);
<<<<<<< HEAD
      const pedidoRef = doc(db, "pedidos", pedidoId);
      const pedidoSnap = await getDoc(pedidoRef);
      
      if (!pedidoSnap.exists()) {
        console.log("⚠️ Pedido não encontrado");
        return;
      }

      const pedido = pedidoSnap.data();
      
      console.log("📊 Dados atuais do pedido:", {
        quantidade: pedido.quantidade,
        totalProduzido: pedido.totalProduzido || 0,
        divergencia: pedido.divergencia || 0
      });

      // 🔥 CALCULAR NOVOS TOTAIS
      let totalProduzido = 0;
      let totalPesoLiquido = 0;
      let totalPesoBruto = 0;

      palletsSnap.docs.forEach((doc, index) => {
        const pallet = doc.data();
        totalProduzido += parseInt(pallet.quantidade) || 0;
        totalPesoLiquido += parseFloat(pallet.pesoLiquido) || 0;
        totalPesoBruto += parseFloat(pallet.pesoBruto) || 0;
        console.log(`   Pallet ${index + 1}:`, {
          quantidade: pallet.quantidade,
          pesoLiquido: pallet.pesoLiquido,
          pesoBruto: pallet.pesoBruto
        });
      });

      const divergencia = totalProduzido - parseInt(pedido.quantidade || 0);
      
      console.log("📈 Novos totais calculados:", {
        totalProduzido,
        totalPesoLiquido,
        totalPesoBruto,
        divergencia,
        palletsCount: palletsSnap.docs.length
      });

      // 🔥🔥🔥 PREPARAR DADOS PARA UPDATE COM TODOS OS CAMPOS NECESSÁRIOS 🔥🔥🔥
      const updateData = {
        // 🔥 CAMPOS QUE DEVEM SER ATUALIZADOS
        totalProduzido: totalProduzido,
        totalPesoLiquido: totalPesoLiquido,
        totalPesoBruto: totalPesoBruto,
        divergencia: divergencia,
        atualizadoEm: serverTimestamp(),
        
        // 🔥 CAMPOS QUE DEVEM SER MANTIDOS (IMPORTANTE!)
        // Estes campos são necessários para passar nas regras
        cliente: pedido.cliente,
        produto: pedido.produto,
        quantidade: pedido.quantidade,
        status: pedido.status,
        cidade: pedido.cidade,
        prioridade: pedido.prioridade,
        criadoPor: pedido.criadoPor,
        criadoEm: pedido.criadoEm
      };

      console.log("📤 Enviando update para Firestore:", Object.keys(updateData));
      
      // 🔥 FAZER O UPDATE
      await updateDoc(pedidoRef, updateData);
      
      console.log("✅ Pedido atualizado com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao atualizar totais:", error);
      console.error("Código do erro:", error.code);
      console.error("Mensagem:", error.message);
      
      // 🔥 DEBUG DETALHADO
      if (error.code === 'permission-denied') {
        console.error("🔥🔥🔥 PERMISSÃO NEGADA! 🔥🔥🔥");
        console.error("Verifique se as regras estão corretas.");
        console.error("O update deve conter EXATAMENTE os campos:");
        console.error("1. totalProduzido (int)");
        console.error("2. totalPesoLiquido (number)");
        console.error("3. totalPesoBruto (number)");
        console.error("4. divergencia (int)");
        console.error("5. atualizadoEm (timestamp)");
        console.error("E manter TODOS os outros campos originais.");
      }
    }
  };

  // 🔥 Editar pallet - VERSÃO SIMPLIFICADA
  const editarPallet = async (palletId, dadosAtualizados) => {
    setLoading(true);
    try {
      console.log("✏️  Editando pallet:", palletId);
      
      const palletRef = doc(db, "pallets", palletId);
      const palletSnap = await getDoc(palletRef);
      
      if (!palletSnap.exists()) {
        throw new Error("Pallet não encontrado");
      }

      const pallet = palletSnap.data();
      const pedidoId = pallet.pedidoId;

      // Calcular novos pesos
      const pesoLiquido = parseFloat(dadosAtualizados.pesoLiquido) || 0;
      const pesoBruto = parseFloat(dadosAtualizados.pesoBruto) || 0;
      const tara = pesoBruto - pesoLiquido;
      const quantidade = parseInt(dadosAtualizados.quantidade) || 0;

      // Atualizar pallet
      await updateDoc(palletRef, {
        ...dadosAtualizados,
        quantidade: quantidade,
        pesoLiquido: pesoLiquido,
        pesoBruto: pesoBruto,
        tara: tara,
        atualizadoEm: serverTimestamp(),
      });

      console.log("✅ Pallet atualizado");

      // Recalcular totais do pedido
      if (pedidoId) {
        console.log("🔄 Recalculando totais do pedido após edição");
        await atualizarTotaisPedido(pedidoId);
      }

      return { id: palletId, ...dadosAtualizados };
    } catch (error) {
      console.error("❌ Erro ao editar pallet:", error);
      throw error;
    } finally {
      setLoading(false);
=======

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
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
    }
  };

  // 🔥 Excluir pallet
  const deletarPallet = async (palletId) => {
<<<<<<< HEAD
    setLoading(true);
    try {
      console.log("🗑️  Deletando pallet:", palletId);
      
      const palletRef = doc(db, "pallets", palletId);
      const palletSnap = await getDoc(palletRef);

      if (!palletSnap.exists()) {
        console.log("⚠️ Pallet não encontrado");
        return;
      }

      const pallet = palletSnap.data();
      const pedidoId = pallet.pedidoId;

      // Deletar pallet
      await deleteDoc(palletRef);
      console.log("✅ Pallet deletado");

      // Recalcular totais do pedido
      if (pedidoId) {
        console.log("🔄 Recalculando totais após exclusão");
        await atualizarTotaisPedido(pedidoId);
      }
    } catch (error) {
      console.error("❌ Erro ao deletar pallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    pallets,
    criarPallet,
    editarPallet,
    deletarPallet,
    loading,
  };
};
=======
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
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
