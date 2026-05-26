import { useState } from "react";
import { ClipboardList, Search, Plus } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const receptions = [
  {
    id: 1,
    folio: "REC-001",
    supplier: "Café Selecto MX",
    products: 12,
    date: "2026-05-25",
    total: 2450,
    status: "Completada",
  },
  {
    id: 2,
    folio: "REC-002",
    supplier: "Insumos Universitarios",
    products: 8,
    date: "2026-05-24",
    total: 1380,
    status: "Pendiente",
  },
  {
    id: 3,
    folio: "REC-003",
    supplier: "Panadería La Central",
    products: 15,
    date: "2026-05-23",
    total: 980,
    status: "Completada",
  },
];

function RecepcionesPage() {
  const [search, setSearch] = useState("");

  const filteredReceptions = receptions.filter((item) =>
    `${item.folio} ${item.supplier}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Recepciones"
      subtitle="Registro de entradas de productos al inventario."
    >
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Recepciones registradas
            </h3>
            <p className="text-sm text-stone-500">
              {filteredReceptions.length} recepción(es) encontradas
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
                placeholder="Buscar recepción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
              <Plus size={18} />
              Nueva recepción
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Proveedor</th>
                <th className="py-3 px-3">Productos</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {filteredReceptions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                        <ClipboardList size={18} />
                      </div>

                      <span className="font-medium text-stone-800">
                        {item.folio}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-3">{item.supplier}</td>
                  <td className="py-4 px-3">{item.products}</td>
                  <td className="py-4 px-3">{item.date}</td>
                  <td className="py-4 px-3 font-semibold text-amber-900">
                    ${item.total}
                  </td>

                  <td className="py-4 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Completada"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
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

export default RecepcionesPage; 