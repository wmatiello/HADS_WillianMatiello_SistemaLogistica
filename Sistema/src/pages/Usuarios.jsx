import { useState } from "react";
import { useUsuarios } from "../hooks/useUsuarios";
import { useUser } from "../context/UserContext";

export default function Usuarios() {
  const { usuarios, criarUsuario, atualizarUsuario, loading } = useUsuarios();
  const { perfil } = useUser();
  
  const [form, setForm] = useState({
    nome: "", email: "", senha: "", perfil: "conferente"
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    
    try {
      await criarUsuario(form);
      setForm({ nome: "", email: "", senha: "", perfil: "conferente" });
      setShowUserModal(false);
      setMensagem("Usuário criado com sucesso!");
    } catch (error) {
      setMensagem("Erro ao criar usuário: " + error.message);
    }
  };

  const handleAtivarDesativar = async (usuarioId, ativoAtual) => {
    try {
      await atualizarUsuario(usuarioId, { ativo: !ativoAtual });
      setMensagem(`Usuário ${ativoAtual ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      setMensagem("Erro ao atualizar usuário: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600 mt-1">Controle de acesso e permissões do sistema</p>
          </div>
          {perfil === "gerente" && (
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Novo Usuário
            </button>
          )}
        </div>

        {/* Mensagem de Feedback */}
        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg border ${
            mensagem.includes("Erro") ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-3 ${
                mensagem.includes("Erro") ? "text-red-500" : "text-green-500"
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{mensagem}</span>
            </div>
          </div>
        )}

        {/* Modal Criar Usuário */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Cadastrar Novo Usuário</h3>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Nome completo do usuário"
                      value={form.nome}
                      onChange={(e) => setForm({...form, nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      placeholder="E-mail de acesso"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha Temporária</label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={form.senha}
                      onChange={(e) => setForm({...form, senha: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Perfil</label>
                    <select
                      value={form.perfil}
                      onChange={(e) => setForm({...form, perfil: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="conferente">Conferente</option>
                      <option value="gerente">Gerente</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Criando..." : "Criar Usuário"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuários do Sistema
                <span className="ml-2 bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded">
                  {usuarios.length}
                </span>
              </h3>
              <div className="text-sm text-gray-500">
                {usuarios.filter(u => u.ativo !== false).length} ativos
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {usuarios.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário cadastrado</h3>
                <p className="text-gray-500">Comece criando o primeiro usuário do sistema</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuarios.map(usuario => (
                  <div key={usuario.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{usuario.nome}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.perfil === 'gerente' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {usuario.perfil}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.ativo === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {usuario.ativo === false ? 'Inativo' : 'Ativo'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600">{usuario.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Criado em: {usuario.criadoEm?.toDate ? 
                          new Date(usuario.criadoEm.toDate()).toLocaleDateString('pt-BR') : 
                          'Data não disponível'
                        }
                      </p>
                    </div>
                    
                    {/* Ações - Apenas gerentes podem gerenciar outros usuários */}
                    {perfil === "gerente" && usuario.perfil !== "gerente" && (
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <button
                          onClick={() => handleAtivarDesativar(usuario.id, usuario.ativo)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            usuario.ativo === false 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-yellow-600 text-white hover:bg-yellow-700'
                          }`}
                        >
                          {usuario.ativo === false ? 'Ativar Usuário' : 'Desativar Usuário'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Informação sobre permissões */}
        {perfil !== "gerente" && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-900">Permissões Limitadas</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Apenas usuários com perfil de Gerente podem criar e gerenciar outros usuários do sistema.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}