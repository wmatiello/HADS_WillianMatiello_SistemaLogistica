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

// Layout protegido com sidebar
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

function AppRoutes() {
  const [user, loading] = useAuthState(auth);

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

      {/* Layout protegido se logado */}
      <Route element={user ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
        
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/usuarios"
          element={
            <RequirePerfil allow="gerente">
              <Usuarios />
            </RequirePerfil>
          }
        />

        <Route
          path="/pedidos"
          element={
            <RequirePerfil allow="gerente">
              <Pedidos />
            </RequirePerfil>
          }
        />

        <Route
          path="/pallets"
          element={
            <RequirePerfil allow={["gerente", "conferente"]}>
              <Pallets />
            </RequirePerfil>
          }
        />

        <Route
          path="/rotas"
          element={
            <RequirePerfil allow={["gerente", "conferente"]}>
              <Rotas />
            </RequirePerfil>
          }
        />

      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}
