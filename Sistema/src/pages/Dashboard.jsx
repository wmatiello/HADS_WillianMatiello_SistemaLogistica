import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function loadPedidos() {
      try {
        // Buscar todos os pedidos
        const pedidosData = await apiFetch("http://localhost:4000/api/pedidos");

        const pedidosComDetalhes = await Promise.all(
          pedidosData.map(async (pedido) => {
            // Buscar info do usuário que cadastrou
            let usuarioNome = "Desconhecido";
            if (pedido.criadoPor) {
              try {
                const usuario = await apiFetch(`http://localhost:4000/api/usuarios/${pedido.criadoPor}`);
                usuarioNome = usuario.nome || "Desconhecido";
              } catch (err) {
                console.warn(`Não foi possível carregar usuário ${pedido.criadoPor}`);
              }
            }

            // Buscar pallets do pedido
            let pallets = [];
            try {
              pallets = await apiFetch(`http://localhost:4000/api/pallets/${pedido.id}`);
            } catch (err) {
              console.warn(`Não foi possível carregar pallets do pedido ${pedido.id}`);
            }

            // Buscar rotas do pedido
            let rotas = [];
            try {
              rotas = await apiFetch(`http://localhost:4000/api/rotas`);
            } catch (err) {
              console.warn(`Não foi possível carregar rotas`);
            }

            return { ...pedido, usuarioNome, pallets, rotas };
          })
        );

        setPedidos(pedidosComDetalhes);
      } catch (err) {
        console.error(err);
      }
    }

    loadPedidos();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bem-vindo ao Sistema de Logística 🚚</h1>

      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            margin: "1rem auto",
            padding: "1rem",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          <p><strong>Pedido ID:</strong> {pedido.id}</p>
          <p><strong>Cadastrado por:</strong> {pedido.usuarioNome}</p>
          <p><strong>Data de criação:</strong> {pedido.criadoEm}</p>

          <p><strong>Pallets:</strong></p>
          <ul>
            {pedido.pallets.map((pl) => (
              <li key={pl.id}>
                {pl.codigo} - Quantidade: {pl.quantidade} - Peso: {pl.peso}
              </li>
            ))}
          </ul>

          <p><strong>Rotas:</strong></p>
          <ul>
            {pedido.rotas.map((r) => (
              <li key={r.id}>
                {r.nome} - {r.cidade}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
