import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/dashboard"); // redireciona após login
    } catch (error) {
      console.error(error);
      setErro("E-mail ou senha incorretos.");
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
            <label className="block text-gray-700 font-semibold mb-1">E-mail</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 text-left">
            <label className="block text-gray-700 font-semibold mb-1">Senha</label>
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
