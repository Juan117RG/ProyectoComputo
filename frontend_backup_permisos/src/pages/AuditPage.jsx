import { useState } from "react";
import { History, Search } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const logs = [
  {
    id: 1,
    user: "proyecto",
    action: "Inicio de sesión",
    module: "Autenticación",
    date: "2026-05-25 21:40",
    type: "Sistema",
  },
  {
    id: 2,
    user: "proyecto",
    action: "Actualizó un producto",
    module: "Productos",
    date: "2026-05-25 21:20",
    type: "Edición",
  },
  {
    id: 3,
    user: "inventario01",
    action: "Registró una recepción",
    module: "Recepciones",
    date: "2026-05-24 18:15",
    type: "Registro",
  },
  {
    id: 4,
    user: "caja01",
    action: "Registró un cliente",
    module: "Clientes",
    date: "2026-05-23 12:05",
    type: "Registro",
  },
];

function AuditPage() {
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) =>
    `${log.user} ${log.action} ${log.module}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Auditoría" subtitle="Historial de actividad del sistema.">
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
              <History size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800">
                Movimientos recientes
              </h3>
              <p className="text-sm text-stone-500">
                Registro de acciones realizadas por los usuarios.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <article
              key={log.id}
              className="border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-stone-50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-stone-800">{log.action}</p>
                  <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs">
                    {log.type}
                  </span>
                </div>

                <p className="text-sm text-stone-500">
                  Usuario: {log.user} · Módulo: {log.module}
                </p>
              </div>

              <span className="text-sm text-stone-500">{log.date}</span>
            </article>
          ))}

          {filteredLogs.length === 0 && (
            <p className="text-center text-stone-500 py-8">
              No se encontraron movimientos.
            </p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

export default AuditPage; 