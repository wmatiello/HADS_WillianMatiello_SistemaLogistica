import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { UserProvider } from "./context/UserContext";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Rotas from "./pages/Rotas";
import Pallets from "./pages/Pallets";
import Usuarios from "./pages/Usuarios";
import Sidebar from "./components/Sidebar";
import RequirePerfil from "./components/RequirePerfil";

// Layout principal com Sidebar e Outlet (onde as páginas são renderizadas)
function ProtectedLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Controla todas as rotas do app
function AppRoutes() {
  const [user, loading] = useAuthState(auth);

  // Enquanto o Firebase verifica o login
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" replace />}
      />

      {/* Layout protegido (só entra se estiver logado) */}
      <Route
        element={user ? <ProtectedLayout /> : <Navigate to="/login" replace />}
      >
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Usuários - somente gerente */}
        <Route
          path="/usuarios"
          element={
            <RequirePerfil allow={["gerente"]}>
              <Usuarios />
            </RequirePerfil>
          }
        />

        {/* Pedidos - somente gerente */}
        <Route
          path="/pedidos"
          element={
            <RequirePerfil allow={["gerente"]}>
              <Pedidos />
            </RequirePerfil>
          }
        />

        {/* Pallets - gerente e conferente */}
        <Route
          path="/pallets"
          element={
            <RequirePerfil allow={["gerente", "conferente"]}>
              <Pallets />
            </RequirePerfil>
          }
        />

        {/* Rotas - gerente e conferente */}
        <Route
          path="/rotas"
          element={
            <RequirePerfil allow={["gerente", "conferente"]}>
              <Rotas />
            </RequirePerfil>
          }
        />
      </Route>

      {/* Caso não encontre a rota */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

// App principal com contexto do usuário
export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}
