<<<<<<< HEAD
// src/hooks/useUsuarios.js - VERSÃO CORRIGIDA
=======
// src/hooks/useUsuarios.js - APENAS JAVASCRIPT, SEM JSX!
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
import { useState, useEffect } from "react";
import { 
  collection, doc, setDoc, updateDoc, getDocs, 
  onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";
import { useUser } from "../context/UserContext";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { perfil } = useUser();

  // Escutar usuários em tempo real
  useEffect(() => {
    const q = query(collection(db, "usuarios"), orderBy("criadoEm", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usuariosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usuariosData);
    });

    return unsubscribe;
  }, [perfil]);

  // Criar usuário DIRETAMENTE do frontend
  const criarUsuario = async (dadosUsuario) => {
    setLoading(true);
    try {
      if (perfil !== "gerente") {
        throw new Error("Apenas gerentes podem criar usuários");
      }

      // 1. Criar no Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        dadosUsuario.email, 
        dadosUsuario.senha
      );

      // 2. Criar no Firestore
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        perfil: dadosUsuario.perfil,
        criadoPor: auth.currentUser.uid,
        criadoEm: serverTimestamp(),
<<<<<<< HEAD
        ativo: true, // 🔥 NOVO: Já cria como ativo
        desativadoEm: null, // 🔥 NOVO
        motivoDesativacao: null // 🔥 NOVO
=======
        ativo: true
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
      });

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      
      // Tratamento de erros específicos do Firebase Auth
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("Este e-mail já está em uso");
      } else if (error.code === 'auth/weak-password') {
        throw new Error("Senha muito fraca (mínimo 6 caracteres)");
      } else {
        throw new Error("Erro ao criar usuário: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // 🔥 CORRIGIDA: Função para ativar/desativar usuário
  const atualizarUsuario = async (usuarioId, dados) => {
    setLoading(true);
=======
  const atualizarUsuario = async (usuarioId, dados) => {
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
    try {
      if (perfil !== "gerente") {
        throw new Error("Apenas gerentes podem atualizar usuários");
      }

<<<<<<< HEAD
      // 🔥 Verificar se não está tentando desativar a si mesmo
      if (usuarioId === auth.currentUser?.uid && dados.ativo === false) {
        throw new Error("Você não pode desativar sua própria conta");
      }

      // 🔥 Preparar dados de atualização
      const updateData = {
        ...dados,
        atualizadoEm: serverTimestamp()
      };

      // 🔥 Se estiver desativando, adicionar informações extras
      if (dados.ativo === false) {
        updateData.desativadoEm = serverTimestamp();
        updateData.motivoDesativacao = "Desativado pelo administrador";
        updateData.desativadoPor = auth.currentUser?.uid;
      }
      
      // 🔥 Se estiver ativando, limpar informações de desativação
      if (dados.ativo === true) {
        updateData.desativadoEm = null;
        updateData.motivoDesativacao = null;
        updateData.reativadoEm = serverTimestamp();
        updateData.reativadoPor = auth.currentUser?.uid;
      }

      console.log("📝 Atualizando usuário:", usuarioId, updateData);

      // 🔥 Fazer a atualização
      await updateDoc(doc(db, "usuarios", usuarioId), updateData);

      return { success: true, message: "Usuário atualizado com sucesso!" };
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw new Error("Erro ao atualizar usuário: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NOVA: Função específica para ativar/desativar
  const toggleAtivoUsuario = async (usuarioId, ativoAtual) => {
    return await atualizarUsuario(usuarioId, { ativo: !ativoAtual });
  };

=======
      await updateDoc(doc(db, "usuarios", usuarioId), {
        ...dados,
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
  return { 
    usuarios, 
    criarUsuario, 
    atualizarUsuario,
<<<<<<< HEAD
    toggleAtivoUsuario, // 🔥 NOVA função
=======
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
    loading 
  };
};