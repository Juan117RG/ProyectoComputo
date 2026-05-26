import { useState } from "react";
import { UserCog, Search, Plus, Mail, Shield } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const initialUsers = [
  {
    id: 1,
    name: "Administrador",
    username: "proyecto",
    email: "admin@cafecampus.com",
    role: "Administrador",
    status: "Activo",
  },
  {
    id: 2,
    name: "Encargado de caja",
    username: "caja01",
    email: "caja@cafecampus.com",
    role: "Cajero",
    status: "Activo",
  },
  {
    id: 3,
    name: "Encargado de inventario",
    username: "inventario01",
    email: "inventario@cafecampus.com",
    role: "Almacén",
    status: "Activo",
  },
];

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.username} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Usuarios" subtitle="Gestión de usuarios del sistema.">
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Usuarios registrados
            </h3>
            <p className="text-sm text-stone-500">
              {filteredUsers.length} usuario(s) encontrados
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
              <Plus size={18} />
              Nuevo usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Correo</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                        <UserCog size={18} />
                      </div>

                      <div>
                        <p className="font-medium text-stone-800">{user.name}</p>
                        <p className="text-sm text-stone-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Shield size={16} className="text-amber-900" />
                      {user.role}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export default UsersPage; 