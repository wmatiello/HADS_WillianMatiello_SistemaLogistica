// src/hooks/useDadosExemplo.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const useDadosExemplo = () => {
  const criarDadosExemplo = async () => {
    try {
      console.log("🔄 Criando dados de exemplo...");

      // 1. Criar pedidos de exemplo
      const pedidosExemplo = [
        {
          cliente: "Cliente A",
          produto: "Produto X",
          quantidade: 100,
          cidade: "SC",
          prioridade: "normal",
          status: "pendente",
          criadoPor: "sistema",
          criadoEm: serverTimestamp()
        },
        {
          cliente: "Cliente B", 
          produto: "Produto Y",
          quantidade: 50,
          cidade: "PR",
          prioridade: "alta",
          status: "pendente",
          criadoPor: "sistema",
          criadoEm: serverTimestamp()
        }
      ];

      for (const pedido of pedidosExemplo) {
        const docRef = await addDoc(collection(db, "pedidos"), pedido);
        console.log("✅ Pedido criado:", docRef.id);
      }

      // 2. Criar rotas de exemplo
      const rotasExemplo = [
        {
          nome: "Rota 6",
          cidade: "SC", 
          descricao: "Transferência para Matriz SC",
          status: "ativa",
          pedidos: [],
          criadoPor: "sistema",
          criadoEm: serverTimestamp()
        },
        {
          nome: "Rota 5",
          cidade: "PR",
          descricao: "Destino Paraná",
          status: "ativa", 
          pedidos: [],
          criadoPor: "sistema",
          criadoEm: serverTimestamp()
        }
      ];

      for (const rota of rotasExemplo) {
        const docRef = await addDoc(collection(db, "rotas"), rota);
        console.log("✅ Rota criada:", docRef.id);
      }

      alert("✅ Dados de exemplo criados com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao criar dados de exemplo:", error);
      alert("Erro ao criar dados: " + error.message);
    }
  };

  return { criarDadosExemplo };
};