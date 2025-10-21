// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route
          path="/"
          element={usuario ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        {/* Rota do dashboard */}
        <Route
          path="/dashboard"
          element={usuario ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* Redirecionamento de qualquer rota desconhecida */}
        <Route
          path="*"
          element={<Navigate to={usuario ? "/dashboard" : "/"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
