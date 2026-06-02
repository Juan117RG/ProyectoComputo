import { ShieldCheck, Plus } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const roles = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo a todos los módulos del sistema.",
    users: 1,
    permissions: 10,
  },
  {
    id: 2,
    name: "Cajero",
    description: "Acceso a clientes, ventas y consulta de productos.",
    users: 2,
    permissions: 4,
  },
  {
    id: 3,
    name: "Almacén",
    description: "Acceso a inventario, recepciones, productos y proveedores.",
    users: 1,
    permissions: 6,
  },
];

function RolesPage() {
  return (
    <AdminLayout title="Roles" subtitle="Administración de roles del sistema.">
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Roles registrados
            </h3>
            <p className="text-sm text-stone-500">
              Perfiles de acceso disponibles en el sistema.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
            <Plus size={18} />
            Nuevo rol
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.id}
              className="border border-stone-200 rounded-2xl p-5 hover:shadow-md transition bg-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h4 className="font-bold text-stone-800">{role.name}</h4>
                  <p className="text-sm text-stone-500">
                    {role.users} usuario(s)
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-600 mb-5">
                {role.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm">
                  {role.permissions} permisos
                </span>

                <button className="text-sm font-semibold text-amber-900 hover:underline">
                  Ver detalle
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}

export default RolesPage; 