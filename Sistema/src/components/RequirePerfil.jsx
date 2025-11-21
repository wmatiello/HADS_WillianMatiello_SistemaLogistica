// src/components/RequirePerfil.jsx - VERSÃO ORIGINAL
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function RequirePerfil({ allow }) {
  const { perfil, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Carregando...
      </div>
    );
  }

  // ✅ AGORA DEVE FUNCIONAR - seu usuário tem perfil "gerente"
  if (!allow.includes(perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
} 