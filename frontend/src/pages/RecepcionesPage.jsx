import { ClipboardList } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const receptions = [
  {
    id: 1,
    folio: "REC-001",
    supplier: "Distribuidora del Bajío",
    products: 12,
    date: "2026-05-25",
    status: "Completada",
  },
  {
    id: 2,
    folio: "REC-002",
    supplier: "Café Selecto MX",
    products: 8,
    date: "2026-05-24",
    status: "Pendiente",
  },
  {
    id: 3,
    folio: "REC-003",
    supplier: "Insumos Universitarios",
    products: 15,
    date: "2026-05-23",
    status: "Completada",
  },
];

function RecepcionesPage() {
  return (
    <AdminLayout
      title="Recepciones"
      subtitle="Registro de entradas de productos al inventario."
    >
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h3 className="text-xl font-bold text-stone-800">
            Recepciones registradas
          </h3>

          <button className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800">
            Nueva recepción
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Folio</th>
                <th className="py-3 px-3">Proveedor</th>
                <th className="py-3 px-3">Productos</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {receptions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <ClipboardList size={20} className="text-amber-900" />
                      <span className="font-medium">{item.folio}</span>
                    </div>
                  </td>

                  <td className="py-4 px-3">{item.supplier}</td>
                  <td className="py-4 px-3">{item.products}</td>
                  <td className="py-4 px-3">{item.date}</td>

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
      </div>
    </AdminLayout>
  );
}

export default RecepcionesPage; 