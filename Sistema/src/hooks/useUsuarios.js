// src/hooks/useUsuarios.js - APENAS JAVASCRIPT, SEM JSX!
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
        ativo: true
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

  const atualizarUsuario = async (usuarioId, dados) => {
    try {
      if (perfil !== "gerente") {
        throw new Error("Apenas gerentes podem atualizar usuários");
      }

      await updateDoc(doc(db, "usuarios", usuarioId), {
        ...dados,
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

  return { 
    usuarios, 
    criarUsuario, 
    atualizarUsuario,
    loading 
  };
};