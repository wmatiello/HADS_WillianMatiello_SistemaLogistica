import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, Package, Truck, Box, Users, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import { auth } from "../firebase";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { perfil } = useUser() || {}; // corrigido

  const links = [
    { to: "/", label: "Dashboard", icon: <Menu size={20} /> }, // corrigido
    { to: "/pedidos", label: "Pedidos", icon: <Package size={20} /> },
    { to: "/rotas", label: "Rotas", icon: <Truck size={20} /> },
    { to: "/pallets", label: "Pallets", icon: <Box size={20} /> }, // corrigido
    { to: "/usuarios", label: "Usuários", icon: <Users size={20} />, roles: ["gerente"] },
  ];

  const visibleLinks = links.filter(
    (link) => !link.roles || link.roles.includes(perfil)
  );

  return (
    <div className={`bg-blue-700 text-white ${isOpen ? "w-64" : "w-20"} duration-300 flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-600">
        <h2 className={`text-lg font-bold ${!isOpen && "hidden"}`}>Logística</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <Menu />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md hover:bg-blue-600 transition ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            {link.icon}
            <span className={`${!isOpen && "hidden"} text-sm font-medium`}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-600">
        <button
          className="flex items-center gap-3 p-2 w-full rounded hover:bg-blue-600 transition"
          onClick={() => auth.signOut()}
        >
          <LogOut size={20} />
          <span className={`${!isOpen && "hidden"} text-sm`}>Sair</span>
        </button>
      </div>
    </div>
  );
}
