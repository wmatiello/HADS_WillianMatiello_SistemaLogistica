// src/pages/Rotas.jsx - VERSÃO ATUALIZADA
import { useState } from "react";
import { useRotas } from "../hooks/useRotas";
import { usePedidos } from "../hooks/usePedidos";
import { useUser } from "../context/UserContext";

export default function Rotas() {
  const { rotas, criarRota, adicionarPedidoARota, removerPedidoDaRota, deletarRota, loading } = useRotas();
  const { pedidos, atualizarStatusPedido } = usePedidos();
  const { perfil } = useUser();
  
  const [formRota, setFormRota] = useState({
    nome: "", cidade: "", descricao: ""
  });
  const [mostrarFormRota, setMostrarFormRota] = useState(false);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [pedidoParaAdicionar, setPedidoParaAdicionar] = useState("");

  // ✅ FILTRAR APENAS PEDIDOS PRONTOS (totalProduzido >= quantidade)
  const pedidosProntos = pedidos.filter(pedido => {
    const produzido = pedido.totalProduzido || 0;
    const planejado = parseInt(pedido.quantidade);
    return produzido >= planejado && pedido.status !== "em_transporte";
  });

  const handleCriarRota = async (e) => {
    e.preventDefault();
    try {
      await criarRota(formRota);
      setFormRota({ nome: "", cidade: "", descricao: "" });
      setMostrarFormRota(false);
      alert("Rota criada com sucesso!");
    } catch (error) {
      alert("Erro ao criar rota: " + error.message);
    }
  };

  const handleAdicionarPedido = async (rotaId) => {
    if (!pedidoParaAdicionar) return;
    
    try {
      await adicionarPedidoARota(rotaId, pedidoParaAdicionar);
      setPedidoParaAdicionar("");
      alert("Pedido adicionado à rota!");
    } catch (error) {
      alert("Erro ao adicionar pedido: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Rotas</h2>
        <button
          onClick={() => setMostrarFormRota(!mostrarFormRota)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mostrarFormRota ? "Cancelar" : "Nova Rota"}
        </button>
      </div>

      {/* Formulário de Nova Rota */}
      {mostrarFormRota && (
        <form onSubmit={handleCriarRota} className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Criar Nova Rota</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome da Rota (ex: Rota 6)"
              value={formRota.nome}
              onChange={(e) => setFormRota({...formRota, nome: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Cidade/Destino (ex: SC, PR)"
              value={formRota.cidade}
              onChange={(e) => setFormRota({...formRota, cidade: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Descrição (ex: Transferência para Matriz)"
              value={formRota.descricao}
              onChange={(e) => setFormRota({...formRota, descricao: e.target.value})}
              className="border rounded px-3 py-2"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
          >
            {loading ? "Criando..." : "Criar Rota"}
          </button>
        </form>
      )}

      {/* Lista de Rotas */}
      <div className="space-y-6">
        {rotas.map(rota => (
          <div key={rota.id} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{rota.nome}</h3>
                <p className="text-sm text-gray-600">{rota.cidade} - {rota.descricao}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  rota.status === 'planejada' ? 'bg-yellow-100 text-yellow-800' :
                  rota.status === 'em_transporte' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rota.status}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setRotaSelecionada(rotaSelecionada === rota.id ? null : rota.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  {rotaSelecionada === rota.id ? "Fechar" : "Gerenciar"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
                      deletarRota(rota.id);
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>

            {/* Gestão de Pedidos da Rota */}
            {rotaSelecionada === rota.id && (
              <div className="p-4">
                {/* Adicionar Pedido à Rota */}
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-2">Adicionar Pedido Pronto à Rota</h4>
                  <div className="flex gap-2">
                    <select
                      value={pedidoParaAdicionar}
                      onChange={(e) => setPedidoParaAdicionar(e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    >
                      <option value="">Selecione um pedido pronto</option>
                      {pedidosProntos.map(pedido => (
                        <option key={pedido.id} value={pedido.id}>
                          {pedido.cliente} - {pedido.produto} 
                          (Produzido: {pedido.totalProduzido || 0}/{pedido.quantidade})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAdicionarPedido(rota.id)}
                      disabled={!pedidoParaAdicionar}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Pedidos na Rota */}
                <div>
                  <h4 className="font-semibold mb-2">Pedidos na Rota ({rota.pedidos?.length || 0})</h4>
                  {rota.pedidos?.length === 0 ? (
                    <p className="text-gray-500">Nenhum pedido nesta rota</p>
                  ) : (
                    <div className="space-y-2">
                      {rota.pedidos?.map(pedidoId => {
                        const pedido = pedidos.find(p => p.id === pedidoId);
                        if (!pedido) return null;
                        
                        return (
                          <div key={pedidoId} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <p className="font-medium">{pedido.cliente} - {pedido.produto}</p>
                              <p className="text-sm text-gray-600">
                                Produzido: {pedido.totalProduzido || 0}/{pedido.quantidade} | 
                                Cidade: {pedido.cidade}
                              </p>
                            </div>
                            <button
                              onClick={() => removerPedidoDaRota(rota.id, pedidoId)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Remover
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {rotas.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Nenhuma rota cadastrada</p>
          <p className="text-sm text-gray-400 mt-2">Crie sua primeira rota para começar</p>
        </div>
      )}
    </div>
  );
}