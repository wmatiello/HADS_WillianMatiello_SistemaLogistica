// src/pages/Pallets.jsx
import { useState } from "react";
import { usePallets } from "../hooks/usePallets";
import { usePedidos } from "../hooks/usePedidos";
import { useUser } from "../context/UserContext";

export default function Pallets() {
  const { pallets, criarPallet, editarPallet, deletarPallet, loading } = usePallets();
  const { pedidos } = usePedidos();
  const { perfil } = useUser();

  const [form, setForm] = useState({
    pedidoId: "",
    codigo: "",
    quantidade: "",
    peso: "",
    tipoEmbalagem: "caixa",
  });

  const [mostrarForm, setMostrarForm] = useState(false);

  // 🔧 Controle do modal de edição
  const [editando, setEditando] = useState(null);
  const [formEditar, setFormEditar] = useState({
    codigo: "",
    quantidade: "",
    peso: "",
    tipoEmbalagem: "",
  });

  const abrirEdicao = (pallet) => {
    setEditando(pallet);
    setFormEditar({
      codigo: pallet.codigo,
      quantidade: pallet.quantidade,
      peso: pallet.peso,
      tipoEmbalagem: pallet.tipoEmbalagem,
    });
  };

  const salvarEdicao = async () => {
    await editarPallet(editando.id, formEditar);
    setEditando(null);
    alert("Pallet atualizado!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarPallet(form);
      setForm({
        pedidoId: "",
        codigo: "",
        quantidade: "",
        peso: "",
        tipoEmbalagem: "caixa",
      });
      setMostrarForm(false);
      alert("Pallet registrado com sucesso!");
    } catch (error) {
      alert("Erro ao registrar pallet: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Controle de Pallets</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {mostrarForm ? "Cancelar" : "Novo Pallet"}
        </button>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Registrar Pallet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.pedidoId}
              onChange={(e) => setForm({ ...form, pedidoId: e.target.value })}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Selecione um pedido</option>
              {pedidos.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  {pedido.cliente} - {pedido.produto} (
                  {pedido.totalProduzido || 0}/{pedido.quantidade} {pedido.unidade})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Código do Pallet"
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />

            <input
              type="number"
              placeholder="Quantidade Real"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />

            <input
              type="number"
              step="0.01"
              placeholder="Peso (kg)"
              value={form.peso}
              onChange={(e) => setForm({ ...form, peso: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />

            <select
              value={form.tipoEmbalagem}
              onChange={(e) => setForm({ ...form, tipoEmbalagem: e.target.value })}
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
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
          >
            {loading ? "Registrando..." : "Registrar Pallet"}
          </button>
        </form>
      )}

      {/* Lista de pallets */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Pallets Registrados</h3>
        <div className="p-4">
          {pallets.length === 0 ? (
            <p className="text-gray-500">Nenhum pallet registrado</p>
          ) : (
            <div className="space-y-4">
              {pallets.map((pallet) => {
                const pedido = pedidos.find((p) => p.id === pallet.pedidoId);

                return (
                  <div key={pallet.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">Código: {pallet.codigo}</h4>
                        <p className="text-sm text-gray-600">
                          Pedido: {pedido?.cliente} - {pedido?.produto}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-sm">Quantidade: {pallet.quantidade}</p>
                            <p className="text-sm">Peso: {pallet.peso} kg</p>
                            <p className="text-sm">Tipo: {pallet.tipoEmbalagem}</p>
                          </div>

                          {pedido && (
                            <div>
                              <p className="text-sm text-gray-600">
                                Progresso: {pedido.totalProduzido || 0}/{pedido.quantidade}{" "}
                                {pedido.unidade}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {/* Botão Editar */}
                        <button
                          onClick={() => abrirEdicao(pallet)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Editar
                        </button>

                        {/* Botão Excluir */}
                        <button
                          onClick={() => {
                            if (window.confirm("Tem certeza que deseja excluir este pallet?")) {
                              deletarPallet(pallet.id);
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Editar Pallet</h3>

            <label className="text-sm">Código:</label>
            <input
              className="border rounded w-full px-3 py-2 mb-3"
              value={formEditar.codigo}
              onChange={(e) => setFormEditar({ ...formEditar, codigo: e.target.value })}
            />

            <label className="text-sm">Quantidade:</label>
            <input
              className="border rounded w-full px-3 py-2 mb-3"
              type="number"
              value={formEditar.quantidade}
              onChange={(e) => setFormEditar({ ...formEditar, quantidade: e.target.value })}
            />

            <label className="text-sm">Peso (kg):</label>
            <input
              className="border rounded w-full px-3 py-2 mb-3"
              type="number"
              value={formEditar.peso}
              onChange={(e) => setFormEditar({ ...formEditar, peso: e.target.value })}
            />

            <label className="text-sm">Tipo:</label>
            <select
              className="border rounded w-full px-3 py-2 mb-4"
              value={formEditar.tipoEmbalagem}
              onChange={(e) =>
                setFormEditar({ ...formEditar, tipoEmbalagem: e.target.value })
              }
            >
              <option value="caixa">Caixa</option>
              <option value="saco">Saco</option>
              <option value="unidade">Unidade</option>
              <option value="pallet">Pallet</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvarEdicao}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
