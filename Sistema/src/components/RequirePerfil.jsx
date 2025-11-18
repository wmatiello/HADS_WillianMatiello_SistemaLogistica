// src/components/RequirePerfil.jsx
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

  if (!allow.includes(perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
