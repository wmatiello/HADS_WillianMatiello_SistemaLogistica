// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setPerfil(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const ref = doc(db, "usuarios", firebaseUser.uid);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          const dados = snap.data();
          console.log("📄 Dados do Firestore:", dados);
          
          // ✅ CORREÇÃO: Define o perfil APENAS AQUI
          setPerfil(dados.perfil ?? null);
        } else {
          console.warn("⚠️ Nenhum documento encontrado no Firestore para este usuário:", firebaseUser.uid);
          setPerfil(null);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar perfil:", error);
        setPerfil(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, perfil, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}