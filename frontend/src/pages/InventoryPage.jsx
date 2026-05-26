import { useEffect, useState } from "react";
import {
  Boxes,
  Search,
  AlertTriangle,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    product: "",
    category: "",
    stock: "",
    minStock: "",
    location: "",
  });

  const filteredItems = items.filter((item) =>
    `${item.product || item.producto || ""} ${item.category || item.categoria || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const lowStock = items.filter(
    (item) => Number(item.stock) <= Number(item.minStock || item.minimo)
  ).length;

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

  const resetForm = () => {
    setForm({
      product: "",
      category: "",
      stock: "",
      minStock: "",
      location: "",
    });

    setEditingItem(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setForm({
      product: "",
      category: "",
      stock: "",
      minStock: "",
      location: "",
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);

    setForm({
      product: item.product || item.producto || "",
      category: item.category || item.categoria || "",
      stock: item.stock || "",
      minStock: item.minStock || item.minimo || "",
      location: item.location || item.ubicacion || "",
    });

    setShowModal(true);
  };

  const handleDeleteItem = async (id) => {
    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar este registro de inventario?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`);
    } catch (error) {
      console.log("Inventario eliminado solo en la vista local.");
    }

    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getStatus = (stock, minStock) => {
    return Number(stock) <= Number(minStock) ? "Stock bajo" : "Disponible";
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();

    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        product: form.product,
        category: form.category,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        location: form.location,
        status: getStatus(form.stock, form.minStock),
      };

      try {
        await api.put(`/inventory/${editingItem.id}`, updatedItem);
      } catch (error) {
        console.log("Inventario actualizado solo en la vista local.");
      }

      setItems(
        items.map((item) =>
          item.id === editingItem.id ? updatedItem : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        product: form.product,
        category: form.category,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        location: form.location,
        status: getStatus(form.stock, form.minStock),
      };

      try {
        const response = await api.post("/inventory", newItem);
        const savedItem = response.data?.data || response.data || newItem;
        setItems([savedItem, ...items]);
      } catch (error) {
        setItems([newItem, ...items]);
      }
    }

    resetForm();
  };

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

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"
            >
              <Plus size={18} />
              Nuevo registro
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
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const stock = Number(item.stock || 0);
                const minStock = Number(item.minStock || item.minimo || 0);
                const isLow = stock <= minStock;

                return (
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

                    <td className="py-4 px-3 font-bold">{stock}</td>
                    <td className="py-4 px-3">{minStock}</td>
                    <td className="py-4 px-3">
                      {item.location || item.ubicacion}
                    </td>

                    <td className="py-4 px-3">
                      {isLow ? (
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

                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Editar inventario"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Eliminar inventario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No se encontraron registros de inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {editingItem ? "Editar inventario" : "Nuevo registro"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingItem
                    ? "Modifica el registro de inventario seleccionado."
                    : "Agrega un nuevo registro al inventario."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Producto
                </label>
                <input
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Café americano"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Categoría
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Bebidas"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Stock actual
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Ej. 35"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={form.minStock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Ej. 10"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Ubicación
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Almacén"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800"
                >
                  {editingItem ? "Actualizar registro" : "Guardar registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default InventoryPage; 