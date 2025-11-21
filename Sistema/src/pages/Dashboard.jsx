// src/pages/Dashboard.jsx
import { usePedidos } from "../hooks/usePedidos";
import { usePallets } from "../hooks/usePallets";
import { useRotas } from "../hooks/useRotas";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { pedidos, loading: loadingPedidos } = usePedidos();
  const { pallets, loading: loadingPallets } = usePallets();
  const { rotas, loading: loadingRotas } = useRotas();
  const { user, perfil, loading: loadingUser } = useUser();

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
  const estatisticas = {
    totalPedidos: pedidos.length,
    palletsRegistrados: pallets.length,
    rotasAtivas: rotas.length,
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
    </div>
  );
}