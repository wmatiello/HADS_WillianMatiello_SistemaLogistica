// src/App.jsx - VERSÃO FINAL
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

function ProtectedLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* ✅ ISSO RENDERIZA AS PÁGINAS FILHAS */}
      </main>
    </div>
  );
}

function AppRoutes() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={user ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="pallets" element={<Pallets />} />
        <Route path="rotas" element={<Rotas />} />
        <Route path="usuarios" element={<Usuarios />} />
      </Route>
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