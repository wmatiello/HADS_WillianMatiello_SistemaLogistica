// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [pallets, setPallets] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [carregando, setCarregando] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  useEffect(() => {
    async function loadData() {
      try {
        setCarregando(true);

        // Usuários
        const usuariosData = await apiFetch("http://localhost:4000/api/usuarios");
        setUsuarios(usuariosData);

        // Pedidos
        const pedidosData = await apiFetch("http://localhost:4000/api/pedidos");
        setPedidos(pedidosData);

        // Rotas
        const rotasData = await apiFetch("http://localhost:4000/api/rotas");
        setRotas(rotasData);

        // Pallets
        const allPallets = [];
        for (const pedido of pedidosData) {
          const palletsData = await apiFetch(`http://localhost:4000/api/pallets/${pedido.id}`);
          allPallets.push(...palletsData.map(p => ({ ...p, pedidoId: pedido.id })));
        }
        setPallets(allPallets);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setCarregando(false);
      }
    }

    loadData();
  }, []);

  const getNomeUsuario = (uid) => {
    const user = usuarios.find(u => u.id === uid);
    return user ? user.nome : "Desconhecido";
  };

  const filtrarPorUsuario = (uid) => setFiltroUsuario(uid);

  if (carregando) return <p>Carregando dados...</p>;

  // Filtra itens pelo usuário selecionado
  const pedidosFiltrados = filtroUsuario ? pedidos.filter(p => p.criadoPor === filtroUsuario) : pedidos;
  const palletsFiltrados = filtroUsuario ? pallets.filter(p => p.criadoPor === filtroUsuario) : pallets;
  const rotasFiltradas = filtroUsuario ? rotas.filter(r => r.criadoPor === filtroUsuario) : rotas;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard Logístico 🚚</h1>
      <button
        onClick={handleLogout}
        style={{ margin: "1rem 0", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#dc2626", color: "#fff", border: "none" }}
      >
        Sair
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <label>Filtrar por usuário: </label>
        <select value={filtroUsuario} onChange={e => filtrarPorUsuario(e.target.value)}>
          <option value="">Todos</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
      </div>

      {/* Pedidos */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Pedidos</h2>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Criado por</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{getNomeUsuario(p.criadoPor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pallets */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Pallets</h2>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Quantidade</th>
              <th>Peso</th>
              <th>Pedido ID</th>
              <th>Criado por</th>
            </tr>
          </thead>
          <tbody>
            {palletsFiltrados.map(p => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.quantidade}</td>
                <td>{p.peso}</td>
                <td>{p.pedidoId}</td>
                <td>{getNomeUsuario(p.criadoPor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Rotas */}
      <section>
        <h2>Rotas</h2>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Criado por</th>
            </tr>
          </thead>
          <tbody>
            {rotasFiltradas.map(r => (
              <tr key={r.id}>
                <td>{r.nome}</td>
                <td>{r.cidade}</td>
                <td>{getNomeUsuario(r.criadoPor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
