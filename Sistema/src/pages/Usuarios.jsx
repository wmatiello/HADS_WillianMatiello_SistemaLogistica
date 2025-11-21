// src/pages/Usuarios.jsx
import { useState } from "react";
import { useUsuarios } from "../hooks/useUsuarios";
import { useUser } from "../context/UserContext";

export default function Usuarios() {
  const { usuarios, criarUsuario, atualizarUsuario, loading } = useUsuarios();
  const { perfil } = useUser();
  
  const [form, setForm] = useState({
    nome: "", email: "", senha: "", perfil: "conferente"
  });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    
    try {
      await criarUsuario(form);
      setForm({ nome: "", email: "", senha: "", perfil: "conferente" });
      setMostrarForm(false);
      setMensagem("✅ Usuário criado com sucesso!");
    } catch (error) {
      setMensagem("❌ Erro ao criar usuário: " + error.message);
    }
  };

  const handleAtivarDesativar = async (usuarioId, ativoAtual) => {
    try {
      await atualizarUsuario(usuarioId, { ativo: !ativoAtual });
      setMensagem(`✅ Usuário ${ativoAtual ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      setMensagem("❌ Erro ao atualizar usuário: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mostrarForm ? "Cancelar" : "Novo Usuário"}
        </button>
      </div>

      {mensagem && (
        <div className={`p-3 rounded mb-4 ${
          mensagem.includes("❌") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}>
          {mensagem}
        </div>
      )}

      {/* Formulário de Novo Usuário */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="Senha temporária"
              value={form.senha}
              onChange={(e) => setForm({...form, senha: e.target.value})}
              className="border rounded px-3 py-2"
              required
              minLength="6"
            />
            <select
              value={form.perfil}
              onChange={(e) => setForm({...form, perfil: e.target.value})}
              className="border rounded px-3 py-2"
            >
              <option value="conferente">Conferente</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Criando..." : "Criar Usuário"}
          </button>
        </form>
      )}

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Usuários do Sistema</h3>
        <div className="p-4">
          {usuarios.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário cadastrado</p>
          ) : (
            <div className="space-y-3">
              {usuarios.map(usuario => (
                <div key={usuario.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h4 className="font-semibold">{usuario.nome}</h4>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        usuario.perfil === 'gerente' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.perfil}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        usuario.ativo === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {usuario.ativo === false ? 'Inativo' : 'Ativo'}
                      </span>
                    </div>
                  </div>
                  {perfil === "gerente" && usuario.perfil !== "gerente" && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAtivarDesativar(usuario.id, usuario.ativo)}
                        className={`px-3 py-1 rounded text-sm ${
                          usuario.ativo === false 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                      >
                        {usuario.ativo === false ? 'Ativar' : 'Desativar'}
                      </button>
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