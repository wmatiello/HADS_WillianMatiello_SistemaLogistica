// src/pages/LoginPage.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // Autentica no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);

      // Pega o ID token atualizado
      const token = await userCredential.user.getIdToken(true);

      // Chama o backend passando o token
      const response = await fetch("http://localhost:4000/api/pedidos", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token inválido ou usuário não autorizado");
      }

      const data = await response.json();
      console.log("Resposta do backend:", data);
      alert("Login realizado com sucesso!");
    } catch (error) {
      console.error(error);
      setErro("E-mail ou senha incorretos / token inválido.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
          Sistema Logístico
        </h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 text-left">
            <label className="block text-gray-700 font-semibold mb-1">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
