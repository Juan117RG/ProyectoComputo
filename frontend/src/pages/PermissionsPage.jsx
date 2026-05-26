import { LockKeyhole } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const permissions = [
  { module: "Productos", admin: true, cashier: false, warehouse: true },
  { module: "Inventario", admin: true, cashier: false, warehouse: true },
  { module: "Recepciones", admin: true, cashier: false, warehouse: true },
  { module: "Clientes", admin: true, cashier: true, warehouse: false },
  { module: "Proveedores", admin: true, cashier: false, warehouse: true },
  { module: "Usuarios", admin: true, cashier: false, warehouse: false },
];

function PermissionsPage() {
  const badge = (value) =>
    value ? (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        Permitido
      </span>
    ) : (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
        Denegado
      </span>
    );

  return (
    <AdminLayout title="Permisos" subtitle="Control de permisos por rol.">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
            <LockKeyhole size={22} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Matriz de permisos
            </h3>
            <p className="text-sm text-stone-500">
              Vista general de accesos por módulo.
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
                  <td className="py-4 px-3">{badge(item.admin)}</td>
                  <td className="py-4 px-3">{badge(item.cashier)}</td>
                  <td className="py-4 px-3">{badge(item.warehouse)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PermissionsPage; 