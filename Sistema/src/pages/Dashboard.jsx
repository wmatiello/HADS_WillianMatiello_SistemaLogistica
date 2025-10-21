import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bem-vindo ao Sistema de Logística 🚚</h1>
      <p>Gerencie pedidos, rotas e entregas com eficiência.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#dc2626",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  );
}
