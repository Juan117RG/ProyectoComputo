import { History } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const logs = [
  {
    id: 1,
    user: "proyecto",
    action: "Inicio de sesión",
    module: "Autenticación",
    date: "2026-05-25 21:40",
  },
  {
    id: 2,
    user: "proyecto",
    action: "Actualizó un producto",
    module: "Productos",
    date: "2026-05-25 21:20",
  },
  {
    id: 3,
    user: "inventario01",
    action: "Registró una recepción",
    module: "Recepciones",
    date: "2026-05-24 18:15",
  },
  {
    id: 4,
    user: "caja01",
    action: "Registró un cliente",
    module: "Clientes",
    date: "2026-05-23 12:05",
  },
];

function AuditPage() {
  return (
    <AdminLayout title="Auditoría" subtitle="Historial de actividad del sistema.">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
            <History size={22} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Movimientos recientes
            </h3>
            <p className="text-sm text-stone-500">
              Acciones realizadas por los usuarios.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-stone-50"
            >
              <div>
                <p className="font-semibold text-stone-800">{log.action}</p>
                <p className="text-sm text-stone-500">
                  Usuario: {log.user} · Módulo: {log.module}
                </p>
              </div>

              <span className="text-sm text-stone-500">{log.date}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AuditPage; 