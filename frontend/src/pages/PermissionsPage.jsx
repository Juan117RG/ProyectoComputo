import { LockKeyhole } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const permissions = [
  { module: "Dashboard", admin: true, cashier: true, warehouse: true },
  { module: "Productos", admin: true, cashier: true, warehouse: true },
  { module: "Inventario", admin: true, cashier: false, warehouse: true },
  { module: "Recepciones", admin: true, cashier: false, warehouse: true },
  { module: "Proveedores", admin: true, cashier: false, warehouse: true },
  { module: "Clientes", admin: true, cashier: true, warehouse: false },
  { module: "Usuarios", admin: true, cashier: false, warehouse: false },
  { module: "Roles", admin: true, cashier: false, warehouse: false },
  { module: "Permisos", admin: true, cashier: false, warehouse: false },
  { module: "Auditoría", admin: true, cashier: false, warehouse: false },
];

function PermissionBadge({ allowed }) {
  return allowed ? (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
      Permitido
    </span>
  ) : (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
      Denegado
    </span>
  );
}

function PermissionsPage() {
  return (
    <AdminLayout title="Permisos" subtitle="Control de permisos por rol.">
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
            <LockKeyhole size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Matriz de permisos
            </h3>
            <p className="text-sm text-stone-500">
              Acceso permitido o denegado según el rol del usuario.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Módulo</th>
                <th className="py-3 px-3">Administrador</th>
                <th className="py-3 px-3">Cajero</th>
                <th className="py-3 px-3">Almacén</th>
              </tr>
            </thead>

            <tbody>
              {permissions.map((item) => (
                <tr key={item.module} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3 font-medium text-stone-800">
                    {item.module}
                  </td>
                  <td className="py-4 px-3">
                    <PermissionBadge allowed={item.admin} />
                  </td>
                  <td className="py-4 px-3">
                    <PermissionBadge allowed={item.cashier} />
                  </td>
                  <td className="py-4 px-3">
                    <PermissionBadge allowed={item.warehouse} />
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

export default PermissionsPage; 