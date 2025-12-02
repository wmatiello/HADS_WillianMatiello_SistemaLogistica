<<<<<<< HEAD
=======
// src/pages/Dashboard.jsx
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
import { usePedidos } from "../hooks/usePedidos";
import { usePallets } from "../hooks/usePallets";
import { useRotas } from "../hooks/useRotas";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { pedidos, loading: loadingPedidos } = usePedidos();
  const { pallets, loading: loadingPallets } = usePallets();
  const { rotas, loading: loadingRotas } = useRotas();
  const { user, perfil, loading: loadingUser } = useUser();

<<<<<<< HEAD
  // Estatísticas calculadas
  const totalProduzido = pedidos.reduce((acc, pedido) => acc + (pedido.totalProduzido || 0), 0);
  const totalPeso = pedidos.reduce((acc, pedido) => acc + (pedido.totalPesoLiquido || 0), 0);
  const pedidosEmProducao = pedidos.filter(p => p.status === 'producao').length;
  const pedidosConcluidos = pedidos.filter(p => p.status === 'pronto').length;

=======
  // Debug no console
  // console.log("🎯 Dashboard - Dados:", {
  //   user: user?.email,
  //   perfil,
  //   pedidos: pedidos.length,
  //   pallets: pallets.length,
  //   rotas: rotas.length
  // });

  if (loadingUser || loadingPedidos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-red-600">Usuário não autenticado</h2>
      </div>
    );
  }

  // Estatísticas simples
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
  const estatisticas = {
    totalPedidos: pedidos.length,
    palletsRegistrados: pallets.length,
    rotasAtivas: rotas.length,
<<<<<<< HEAD
    totalProduzido,
    totalPeso: Math.round(totalPeso * 100) / 100,
    pedidosEmProducao,
    pedidosConcluidos
  };

  if (loadingUser || loadingPedidos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acesso não autorizado</h2>
          <p className="text-gray-600">Faça login para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
              <p className="text-gray-600 mt-2">
                Bem-vindo, <span className="font-semibold text-gray-800">{user.email}</span> 
                <span className="mx-2">•</span>
                Perfil: <span className="font-semibold text-blue-600 capitalize">{perfil || "usuário"}</span>
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
                <p className="text-sm text-gray-600">
                  Atualizado em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Pedidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total de Pedidos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estatisticas.totalPedidos}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {estatisticas.pedidosConcluidos} concluídos
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                {estatisticas.pedidosEmProducao} em produção
              </span>
            </div>
          </div>

          {/* Pallets Registrados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pallets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estatisticas.palletsRegistrados}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Total produzido: <span className="font-semibold text-gray-700">{estatisticas.totalProduzido} unidades</span>
              </p>
            </div>
          </div>

          {/* Rotas Ativas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Rotas Ativas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estatisticas.rotasAtivas}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Em operação no sistema
              </p>
            </div>
          </div>

          {/* Peso Total */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Peso Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estatisticas.totalPeso} kg</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Peso líquido total
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h3>
            </div>
            <div className="p-6">
              {pedidos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Nenhum pedido cadastrado</p>
                  <p className="text-sm text-gray-400 mt-1">Comece criando seu primeiro pedido</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.slice(0, 5).map(pedido => (
                    <div key={pedido.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{pedido.produto}</h4>
                        <p className="text-sm text-gray-600 mt-1">{pedido.cliente}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {pedido.cidade}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            pedido.status === 'pronto' ? 'bg-green-100 text-green-800' :
                            pedido.status === 'producao' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {pedido.status === 'pronto' ? 'Concluído' : 
                             pedido.status === 'producao' ? 'Em produção' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{pedido.quantidade} un</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {pedido.criadoEm?.toDate ? 
                            new Date(pedido.criadoEm.toDate()).toLocaleDateString('pt-BR') : 
                            'Data não disponível'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Aviso do Sistema */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200">
            <div className="px-6 py-4 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Informações do Sistema</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-2 mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Dados em Tempo Real</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Todas as informações são atualizadas automaticamente conforme novos dados são registrados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 rounded-lg p-2 mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Próximos Passos</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Para começar, navegue até a aba "Pedidos" e crie seu primeiro pedido.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 text-center">
                    Sistema de gestão logística • Versão 1.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
=======
    divergencias: pallets.reduce((acc, p) => acc + (p.divergencia || 0), 0)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Sistema de Logística 🚚</h1>
      <p className="text-gray-600 mb-6">
        Logado como: <strong>{user.email}</strong> | Perfil: <strong>{perfil || "Não definido"}</strong>
      </p>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-600">TOTAL DE PEDIDOS</h3>
          <p className="text-2xl font-bold text-blue-600">{estatisticas.totalPedidos}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600">PALLETS</h3>
          <p className="text-2xl font-bold text-green-600">{estatisticas.palletsRegistrados}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-600">ROTAS</h3>
          <p className="text-2xl font-bold text-purple-600">{estatisticas.rotasAtivas}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-sm font-semibold text-gray-600">DIVERGÊNCIAS</h3>
          <p className="text-2xl font-bold text-orange-600">{estatisticas.divergencias}</p>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Pedidos Recentes</h3>
        {pedidos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum pedido cadastrado</p>
        ) : (
          <div className="space-y-3">
            {pedidos.slice(0, 5).map(pedido => (
              <div key={pedido.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{pedido.produto}</h4>
                    <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
                    <p className="text-sm text-gray-600">Cidade: {pedido.cidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{pedido.quantidade} un.</p>
                    <p className="text-xs text-gray-500">
                      {new Date(pedido.criadoEm?.toDate?.() || pedido.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensagem importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800">⚠️ Aviso Importante</h3>
        <p className="text-yellow-700 text-sm mt-1">
          Seus dados estão sendo carregados diretamente do Firebase. 
          Para começar, crie alguns pedidos na aba "Pedidos".
        </p>
      </div>
>>>>>>> ed01cd36b54e742dfad1471c227a452587b61212
    </div>
  );
}