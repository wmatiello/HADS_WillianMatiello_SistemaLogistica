import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { useUser } from "../context/UserContext";
import { usePallets } from "../hooks/usePallets";

export default function Pedidos() {
  const palletsHook = usePallets();
  const { criarPallet, editarPallet, deletarPallet } = palletsHook;
  
  const { pedidos, criarPedido, deletarPedido, atualizarStatusPedido, loading } = usePedidos();
  const { perfil } = useUser();
  
  // Estados para modals
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showPalletModal, setShowPalletModal] = useState(false);
  
  // Estados para formulários
  const [formPedido, setFormPedido] = useState({
    cliente: "", 
    produto: "", 
    quantidade: "", 
    unidade: "unidades",
    cidade: "", 
    prioridade: "normal"
  });

  const [formPallet, setFormPallet] = useState({
    pedidoId: "",
    codigo: "",
    tipoItem: "unidade",
    quantidade: "",
    pesoLiquido: "",
    pesoBruto: ""
  });
  
  const [editandoPallet, setEditandoPallet] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Função para calcular nível de divergência
  const calcularNivelDivergencia = (pedido) => {
    if (!pedido.quantidade || pedido.quantidade === 0) return { nivel: 'neutro', percentual: 0 };
    
    const percentual = Math.abs((pedido.divergencia || 0) / pedido.quantidade * 100);
    
    if (percentual <= 5) return { nivel: 'baixo', percentual };
    if (percentual <= 10) return { nivel: 'medio', percentual };
    return { nivel: 'alto', percentual };
  };

  // Finalizar pedido
  const handleFinalizarPedido = async (pedidoId) => {
    if (window.confirm("Tem certeza que deseja finalizar este pedido?")) {
      try {
        await atualizarStatusPedido(pedidoId, 'finalizado');
        alert("Pedido finalizado com sucesso!");
      } catch (error) {
        alert("Erro ao finalizar pedido: " + error.message);
      }
    }
  };

  // Abrir modal para criar pallet
  const abrirCriacaoPallet = (pedido, palletParaEditar = null) => {
    setPedidoSelecionado(pedido);
    
    if (palletParaEditar) {
      setFormPallet({
        pedidoId: pedido.id,
        codigo: palletParaEditar.codigo,
        tipoItem: palletParaEditar.tipoItem || "unidade",
        quantidade: palletParaEditar.quantidade,
        pesoLiquido: palletParaEditar.pesoLiquido,
        pesoBruto: palletParaEditar.pesoBruto
      });
      setEditandoPallet(palletParaEditar.id);
    } else {
      setFormPallet({
        pedidoId: pedido.id,
        codigo: "",
        tipoItem: "unidade",
        quantidade: "",
        pesoLiquido: "",
        pesoBruto: ""
      });
      setEditandoPallet(null);
    }
    setShowPalletModal(true);
  };

  // Enviar formulário de pallet
  const handleSubmitPallet = async (e) => {
    e.preventDefault();
    try {
      if (editandoPallet) {
        await editarPallet(editandoPallet, formPallet);
        alert("Pallet atualizado com sucesso!");
      } else {
        await criarPallet(formPallet);
        alert("Pallet criado com sucesso!");
      }
      setShowPalletModal(false);
      setEditandoPallet(null);
      setPedidoSelecionado(null);
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  // Enviar formulário de pedido
  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    try {
      await criarPedido(formPedido);
      setFormPedido({ 
        cliente: "", 
        produto: "", 
        quantidade: "", 
        unidade: "unidades",
        cidade: "", 
        prioridade: "normal" 
      });
      setShowPedidoModal(false);
      alert("Pedido criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar pedido: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* MODAL CRIAR PEDIDO */}
      {showPedidoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Novo Pedido</h3>
              <button 
                onClick={() => setShowPedidoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitPedido} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={formPedido.cliente}
                    onChange={(e) => setFormPedido({...formPedido, cliente: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={formPedido.produto}
                    onChange={(e) => setFormPedido({...formPedido, produto: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Quantidade estimada"
                      value={formPedido.quantidade}
                      onChange={(e) => setFormPedido({...formPedido, quantidade: e.target.value})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <select
                      value={formPedido.unidade}
                      onChange={(e) => setFormPedido({...formPedido, unidade: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="unidades">Unidades</option>
                      <option value="kg">KG</option>
                      <option value="mil">Mil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade Destino</label>
                  <input
                    type="text"
                    placeholder="Cidade destino"
                    value={formPedido.cidade}
                    onChange={(e) => setFormPedido({...formPedido, cidade: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    value={formPedido.prioridade}
                    onChange={(e) => setFormPedido({...formPedido, prioridade: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Criando..." : "Criar Pedido"}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPedidoModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRIAR/EDITAR PALLET */}
      {showPalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {editandoPallet ? "Editar Pallet" : "Criar Pallet"}
              </h3>
              <button 
                onClick={() => {
                  setShowPalletModal(false);
                  setEditandoPallet(null);
                  setPedidoSelecionado(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitPallet} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pedido</label>
                  <input 
                    type="text"
                    value={pedidoSelecionado ? `${pedidoSelecionado.cliente} - ${pedidoSelecionado.produto}` : ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código do Pallet</label>
                  <input
                    type="text"
                    placeholder="Código único"
                    value={formPallet.codigo}
                    onChange={(e) => setFormPallet({ ...formPallet, codigo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Item</label>
                  <select
                    value={formPallet.tipoItem}
                    onChange={(e) => setFormPallet({ ...formPallet, tipoItem: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="unidade">Unidade</option>
                    <option value="saco">Saco</option>
                    <option value="caixa">Caixa</option>
                    <option value="fardo">Fardo</option>
                    <option value="pallet">Pallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={formPallet.quantidade}
                    onChange={(e) => setFormPallet({ ...formPallet, quantidade: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso Líquido (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Peso líquido"
                    value={formPallet.pesoLiquido}
                    onChange={(e) => setFormPallet({ ...formPallet, pesoLiquido: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso Bruto (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Peso bruto"
                    value={formPallet.pesoBruto}
                    onChange={(e) => setFormPallet({ ...formPallet, pesoBruto: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editandoPallet ? "Atualizar" : "Criar Pallet"}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowPalletModal(false);
                    setEditandoPallet(null);
                    setPedidoSelecionado(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
            <p className="text-gray-600 mt-1">Controle completo de pedidos e produção</p>
          </div>
          { perfil === "gerente" &&
            <button
              onClick={() => setShowPedidoModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Novo Pedido
            </button>
          }
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Pedidos Cadastrados
                <span className="ml-2 bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded">
                  {pedidos.length}
                </span>
              </h3>
              <div className="text-sm text-gray-500">
                {pedidos.filter(p => p.status === 'finalizado').length} finalizados
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {pedidos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido cadastrado</h3>
                <p className="text-gray-500">Comece criando seu primeiro pedido</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pedidos.map(pedido => {
                  const divergenciaInfo = calcularNivelDivergencia(pedido);
                  
                  return (
                    <div key={pedido.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-800">{pedido.produto}</h4>
                              <p className="text-sm text-gray-600 mt-1">Cliente: {pedido.cliente}</p>
                              <p className="text-sm text-gray-600">Cidade: {pedido.cidade}</p>
                            </div>
                            
                            {/* Status do Pedido */}
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                pedido.status === 'finalizado' ? 'bg-green-100 text-green-800' :
                                pedido.status === 'producao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {pedido.status === 'finalizado' ? 'Finalizado' : 
                                 pedido.status === 'producao' ? 'Em produção' : 'Pendente'}
                              </span>
                              
                              {/* Alerta de Divergência */}
                              {divergenciaInfo.nivel !== 'neutro' && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  divergenciaInfo.nivel === 'alto' ? 'bg-red-100 text-red-800' :
                                  divergenciaInfo.nivel === 'medio' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {divergenciaInfo.nivel === 'alto' ? '⚠️ ' : ''}
                                  Divergência: {pedido.divergencia > 0 ? '+' : ''}{pedido.divergencia || 0} 
                                  ({divergenciaInfo.percentual.toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Estimado:</span>{' '}
                                {pedido.quantidade} {pedido.unidade}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Produzido:</span>{' '}
                                {pedido.totalProduzido || 0} {pedido.unidade}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Peso Líquido:</span>{' '}
                                {pedido.totalPesoLiquido || 0} kg
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Peso Bruto:</span>{' '}
                                {pedido.totalPesoBruto || 0} kg
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Botões de Ação */}
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <button
                            onClick={() => abrirCriacaoPallet(pedido)}
                            disabled={pedido.status === 'finalizado'}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                          >
                            Criar Pallet
                          </button>
                          
                          {pedido.status !== 'finalizado' && (
                            <button
                              onClick={() => handleFinalizarPedido(pedido.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                            >
                              Finalizar Pedido
                            </button>
                          )}
                          
                          {perfil === "gerente" && (
                            <button
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
                                  deletarPedido(pedido.id);
                                }
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                            >
                              Excluir Pedido
                            </button>
                          )}
                        </div>
                      </div>

                      {/* LISTA DE PALLETS DO PEDIDO */}
                      {pedido.pallets && pedido.pallets.length > 0 && (
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-3">
                            Pallets do Pedido 
                            <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                              {pedido.pallets.length}
                            </span>
                          </h5>
                          
                          <div className="space-y-3">
                            {pedido.pallets.map(p => (
                              <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">Código: {p.codigo}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                      <p className="text-sm text-gray-600">Quantidade: {p.quantidade} {p.tipoItem}</p>
                                      <p className="text-sm text-gray-600">Peso Líquido: {p.pesoLiquido} kg</p>
                                      <p className="text-sm text-gray-600">Peso Bruto: {p.pesoBruto} kg</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => abrirCriacaoPallet(pedido, p)}
                                      disabled={pedido.status === 'finalizado'}
                                      className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                                    >
                                      Editar
                                    </button>

                                    <button
                                      onClick={async () => {
                                        if (window.confirm("Tem certeza que deseja excluir este pallet?")) {
                                          await deletarPallet(p.id);
                                        }
                                      }}
                                      disabled={pedido.status === 'finalizado'}
                                      className="bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}