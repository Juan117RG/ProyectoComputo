import {
  Coffee,
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  Users,
  LogOut,
  UserCog,
  ShieldCheck,
  LockKeyhole,
  ClipboardList,
  History,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/productos", text: "Productos", icon: <Package size={20} /> },
    { path: "/inventario", text: "Inventario", icon: <Boxes size={20} /> },
    { path: "/recepciones", text: "Recepciones", icon: <ClipboardList size={20} /> },
    { path: "/proveedores", text: "Proveedores", icon: <Truck size={20} /> },
    { path: "/clientes", text: "Clientes", icon: <Users size={20} /> },
    { path: "/usuarios", text: "Usuarios", icon: <UserCog size={20} /> },
    { path: "/roles", text: "Roles", icon: <ShieldCheck size={20} /> },
    { path: "/permisos", text: "Permisos", icon: <LockKeyhole size={20} /> },
    { path: "/auditoria", text: "Auditoría", icon: <History size={20} /> },
  ];

  return (
    <aside className="w-72 bg-amber-900 text-white hidden md:flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 p-3 rounded-2xl">
            <Coffee size={30} />
          </div>

          <div>
            <h1 className="text-xl font-bold">Café Campus</h1>
            <p className="text-sm text-amber-100">Admin ERP</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-white text-amber-900 font-bold"
                  : "hover:bg-white/10 text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar; 