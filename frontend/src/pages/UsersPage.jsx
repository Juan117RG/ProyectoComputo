import { UserCog } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const users = [
  {
    id: 1,
    name: "Administrador",
    username: "proyecto",
    role: "Admin",
    status: "Activo",
  },
  {
    id: 2,
    name: "Encargado de caja",
    username: "caja01",
    role: "Cajero",
    status: "Activo",
  },
  {
    id: 3,
    name: "Encargado de inventario",
    username: "inventario01",
    role: "Almacén",
    status: "Activo",
  },
];

function UsersPage() {
  return (
    <AdminLayout title="Usuarios" subtitle="Gestión de usuarios del sistema.">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h3 className="text-xl font-bold text-stone-800">
            Usuarios registrados
          </h3>

          <button className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800">
            Nuevo usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Nombre</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <UserCog size={20} className="text-amber-900" />
                      <span>{user.username}</span>
                    </div>
                  </td>

                  <td className="py-4 px-3">{user.name}</td>
                  <td className="py-4 px-3">{user.role}</td>

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
      </div>
    </AdminLayout>
  );
}

export default UsersPage; 