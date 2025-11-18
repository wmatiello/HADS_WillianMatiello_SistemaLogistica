// src/pages/Pedidos.jsx
import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { useUser } from "../context/UserContext";

export default function Pedidos() {
  const { pedidos, criarPedido, deletarPedido, loading } = usePedidos();
  const { perfil } = useUser();
  const [form, setForm] = useState({
    cliente: "", produto: "", quantidade: "", cidade: "", prioridade: "normal"
  });
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarPedido(form);
      setForm({ cliente: "", produto: "", quantidade: "", cidade: "", prioridade: "normal" });
      setMostrarForm(false);
      alert("Pedido criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar pedido: " + error.message);
    }
  };

  if (perfil !== "gerente") {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">
          Acesso restrito - apenas gerentes
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mostrarForm ? "Cancelar" : "Novo Pedido"}
        </button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Novo Pedido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cliente"
              value={form.cliente}
              onChange={(e) => setForm({...form, cliente: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Produto"
              value={form.produto}
              onChange={(e) => setForm({...form, produto: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={(e) => setForm({...form, quantidade: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({...form, cidade: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={form.prioridade}
              onChange={(e) => setForm({...form, prioridade: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
          >
            {loading ? "Criando..." : "Criar Pedido"}
          </button>
        </form>
      )}

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Pedidos Cadastrados</h3>
        <div className="p-4">
          {pedidos.length === 0 ? (
            <p className="text-gray-500">Nenhum pedido cadastrado</p>
          ) : (
            <div className="space-y-4">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{pedido.produto}</h4>
                      <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
                      <p className="text-sm text-gray-600">Cidade: {pedido.cidade}</p>
                      <p className="text-sm">Quantidade: {pedido.quantidade}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        pedido.prioridade === 'urgente' ? 'bg-red-100 text-red-800' :
                        pedido.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {pedido.prioridade}
                      </span>
                    </div>
                    <button
                      onClick={() => deletarPedido(pedido.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}