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
  const [showRotaModal, setShowRotaModal] = useState(false);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [pedidoParaAdicionar, setPedidoParaAdicionar] = useState("");

  // ✅ FILTRAR APENAS PEDIDOS PRONTOS
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
      setShowRotaModal(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Rotas</h1>
            <p className="text-gray-600 mt-1">Organize e gerencie as rotas de entrega</p>
          </div>
          <button
            onClick={() => setShowRotaModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Nova Rota
          </button>
        </div>

        {/* Modal Criar Rota */}
        {showRotaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Criar Nova Rota</h3>
                <button 
                  onClick={() => setShowRotaModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCriarRota} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Rota</label>
                    <input
                      type="text"
                      placeholder="Ex: Rota 6"
                      value={formRota.nome}
                      onChange={(e) => setFormRota({...formRota, nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/Destino</label>
                    <input
                      type="text"
                      placeholder="Ex: SC, PR"
                      value={formRota.cidade}
                      onChange={(e) => setFormRota({...formRota, cidade: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <input
                      type="text"
                      placeholder="Ex: Transferência para Matriz"
                      value={formRota.descricao}
                      onChange={(e) => setFormRota({...formRota, descricao: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Criando..." : "Criar Rota"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowRotaModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Rotas */}
        <div className="space-y-6">
          {rotas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma rota cadastrada</h3>
              <p className="text-gray-500">Crie sua primeira rota para começar a organizar as entregas</p>
            </div>
          ) : (
            rotas.map(rota => (
              <div key={rota.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header da Rota */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{rota.nome}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rota.status === 'planejada' ? 'bg-yellow-100 text-yellow-800' :
                          rota.status === 'em_transporte' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rota.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{rota.cidade}</p>
                      {rota.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{rota.descricao}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRotaSelecionada(rotaSelecionada === rota.id ? null : rota.id)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm"
                      >
                        {rotaSelecionada === rota.id ? "Fechar" : "Gerenciar"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
                            deletarRota(rota.id);
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gestão de Pedidos da Rota */}
                {rotaSelecionada === rota.id && (
                  <div className="p-6 bg-gray-50">
                    {/* Adicionar Pedido à Rota */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Adicionar Pedido à Rota</h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={pedidoParaAdicionar}
                          onChange={(e) => setPedidoParaAdicionar(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    {/* Pedidos na Rota */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Pedidos na Rota 
                        <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                          {rota.pedidos?.length || 0}
                        </span>
                      </h4>
                      
                      {rota.pedidos?.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                          <p className="text-gray-500">Nenhum pedido nesta rota</p>
                          <p className="text-sm text-gray-400 mt-1">Adicione pedidos prontos à rota</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rota.pedidos?.map(pedidoId => {
                            const pedido = pedidos.find(p => p.id === pedidoId);
                            if (!pedido) return null;
                            
                            return (
                              <div key={pedidoId} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{pedido.cliente} - {pedido.produto}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      Produzido: {pedido.totalProduzido || 0}/{pedido.quantidade}
                                    </span>
                                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      {pedido.cidade}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removerPedidoDaRota(rota.id, pedidoId)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}