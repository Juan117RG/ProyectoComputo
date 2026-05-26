import { useEffect, useState } from "react";
import { Boxes, Search, AlertTriangle, Plus } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";

const sampleInventory = [
  {
    id: 1,
    product: "Café americano",
    category: "Bebidas",
    stock: 35,
    minStock: 10,
    location: "Barra principal",
    status: "Disponible",
  },
  {
    id: 2,
    product: "Leche deslactosada",
    category: "Insumos",
    stock: 6,
    minStock: 12,
    location: "Refrigerador",
    status: "Stock bajo",
  },
  {
    id: 3,
    product: "Vasos medianos",
    category: "Desechables",
    stock: 8,
    minStock: 20,
    location: "Almacén",
    status: "Stock bajo",
  },
  {
    id: 4,
    product: "Croissant",
    category: "Panadería",
    stock: 15,
    minStock: 8,
    location: "Vitrina",
    status: "Disponible",
  },
];

function InventoryPage() {
  const [items, setItems] = useState(sampleInventory);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = items.filter((item) => item.stock <= item.minStock).length;

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await api.get("/inventory");
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch (error) {
        console.log("Usando inventario de ejemplo.");
      }
    };

    loadInventory();
  }, []);

  return (
    <AdminLayout
      title="Inventario"
      subtitle="Control de existencias y disponibilidad de productos."
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-stone-500 text-sm">Productos en inventario</p>
          <h3 className="text-3xl font-bold text-stone-800">{items.length}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-stone-500 text-sm">Alertas de stock</p>
          <h3 className="text-3xl font-bold text-red-600">{lowStock}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-stone-500 text-sm">Estado general</p>
          <h3 className="text-3xl font-bold text-green-700">Activo</h3>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Existencias registradas
            </h3>
            <p className="text-sm text-stone-500">
              {filteredItems.length} registro(s) encontrados
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
                placeholder="Buscar inventario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
              <Plus size={18} />
              Nuevo movimiento
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Producto</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Mínimo</th>
                <th className="py-3 px-3">Ubicación</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                        <Boxes size={18} />
                      </div>
                      <span className="font-medium text-stone-800">
                        {item.product || item.producto}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    {item.category || item.categoria || "Sin categoría"}
                  </td>

                  <td className="py-4 px-3 font-bold">{item.stock}</td>
                  <td className="py-4 px-3">{item.minStock || item.minimo}</td>
                  <td className="py-4 px-3">{item.location || item.ubicacion}</td>

                  <td className="py-4 px-3">
                    {item.stock <= item.minStock ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        <AlertTriangle size={14} />
                        Stock bajo
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Disponible
                      </span>
                    )}
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

export default InventoryPage; 