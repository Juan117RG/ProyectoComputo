import { ShieldCheck } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const roles = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo al sistema",
    users: 1,
  },
  {
    id: 2,
    name: "Cajero",
    description: "Gestión de ventas y clientes",
    users: 2,
  },
  {
    id: 3,
    name: "Almacén",
    description: "Control de inventario y recepciones",
    users: 1,
  },
];

function RolesPage() {
  return (
    <AdminLayout title="Roles" subtitle="Administración de roles del sistema.">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h3 className="text-xl font-bold text-stone-800">Roles registrados</h3>

          <button className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800">
            Nuevo rol
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-stone-200 rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
                  <ShieldCheck size={22} />
                </div>

                <h4 className="font-bold text-stone-800">{role.name}</h4>
              </div>

              <p className="text-sm text-stone-500 mb-4">{role.description}</p>

              <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                {role.users} usuario(s)
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default RolesPage;