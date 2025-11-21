// src/pages/Pedidos.jsx
import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { useUser } from "../context/UserContext";import { usePallets } from "../hooks/usePallets";

export default function Pedidos() {
  const { criarPallet } = usePallets();
  const { pedidos, criarPedido, deletarPedido, loading } = usePedidos();
  const { perfil } = useUser();
  const [form, setForm] = useState({
    cliente: "", 
    produto: "", 
    quantidade: "", 
    unidade: "unidades", // ✅ unidades, kg, mil
    cidade: "", 
    prioridade: "normal"
  });
  const [mostrarForm, setMostrarForm] = useState(false);

  const [formPallet, setFormPallet] = useState({
    pedidoId: "",
    quantidade: "",
    peso: ""
  });
  const [abrirPalletForm, setAbrirPalletForm] = useState(false);

  const abrirCriacaoPallet = (pedido) => {
    setFormPallet({
      pedidoId: pedido.id,
      codigo: "",
      quantidade: "",
      peso: "",
      tipoEmbalagem: "caixa"
    });
  
    setAbrirPalletForm(true);
  };   

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarPedido(form);
      setForm({ 
        cliente: "", 
        produto: "", 
        quantidade: "", 
        unidade: "unidades",
        cidade: "", 
        prioridade: "normal" 
      });
      setMostrarForm(false);
      alert("Pedido criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar pedido: " + error.message);
    }
  };

  return (
    <div className="p-6">

    {abrirPalletForm && (
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          await criarPallet(formPallet);
          alert("Pallet registrado com sucesso!");
          setAbrirPalletForm(false);
        }}
        className="bg-white p-6 rounded-lg shadow mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Registrar Pallet</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* pedidoId fixo (sem select) */}
          <input 
            type="text"
            value={formPallet.pedidoId}
            disabled
            className="border rounded px-3 py-2 bg-gray-100 text-gray-500"
          />

          <input
            type="text"
            placeholder="Código do Pallet"
            value={formPallet.codigo}
            onChange={(e) => setFormPallet({ ...formPallet, codigo: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            type="number"
            placeholder="Quantidade Real"
            value={formPallet.quantidade}
            onChange={(e) => setFormPallet({ ...formPallet, quantidade: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Peso (kg)"
            value={formPallet.peso}
            onChange={(e) => setFormPallet({ ...formPallet, peso: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <select
            value={formPallet.tipoEmbalagem}
            onChange={(e) => setFormPallet({ ...formPallet, tipoEmbalagem: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="caixa">Caixa</option>
            <option value="saco">Saco</option>
            <option value="unidade">Unidade</option>
            <option value="pallet">Pallet</option>
          </select>

        </div>

        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
        >
          Registrar Pallet
        </button>

        <button 
          type="button"
          onClick={() => setAbrirPalletForm(false)}
          className="bg-gray-400 text-white px-6 py-2 rounded mt-4 ml-4 hover:bg-gray-500"
        >
          Cancelar
        </button>
      </form>
    )}

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
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Quantidade estimada"
                value={form.quantidade}
                onChange={(e) => setForm({...form, quantidade: e.target.value})}
                className="border rounded px-3 py-2 flex-1"
                required
              />
              <select
                value={form.unidade}
                onChange={(e) => setForm({...form, unidade: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="unidades">Unidades</option>
                <option value="kg">KG</option>
                <option value="mil">Mil</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Cidade destino"
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
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{pedido.produto}</h4>
                      <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
                      <p className="text-sm text-gray-600">Cidade: {pedido.cidade}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm font-medium">Estimado: {pedido.quantidade} {pedido.unidade}</p>
                          <p className="text-sm">Produzido: {pedido.totalProduzido || 0} {pedido.unidade}</p>
                          <p className="text-sm">Peso total: {pedido.totalPeso || 0} kg</p>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            pedido.divergencia > 0 ? 'bg-green-100 text-green-800' :
                            pedido.divergencia < 0 ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            Divergência: {pedido.divergencia || 0}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded block mt-1 ${
                            pedido.status === 'pronto' ? 'bg-green-100 text-green-800' :
                            pedido.status === 'producao' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {pedido.status === 'pronto' ? '✅ Pronto' : 
                             pedido.status === 'producao' ? '🔄 Em produção' : '⏳ Pendente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                        onClick={() => abrirCriacaoPallet(pedido)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm ml-4"
                      >
                        Criar Pallet
                    </button>
                    {perfil === "gerente" && (
                      <button
                        onClick={() => {
                          if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
                            deletarPedido(pedido.id);
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 ml-4"
                      >
                        Excluir
                      </button>
                    )} 
                  </div>
                  {pedido.pallets?.length > 0 && (
                    <div className="mt-3 bg-gray-100 p-3 rounded">
                      <h4 className="font-semibold mb-2">Pallets do Pedido:</h4>

                      {pedido.pallets.map(p => (
                        <div key={p.id} className="border rounded p-2 mb-2">
                          <p><strong>Código:</strong> {p.codigo}</p>
                          <p><strong>Quantidade:</strong> {p.quantidade}</p>
                          <p><strong>Peso:</strong> {p.peso} kg</p>
                          <p><strong>Tipo:</strong> {p.tipoEmbalagem}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}