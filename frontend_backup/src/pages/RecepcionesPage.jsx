import { useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const initialReceptions = [
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
  const [receptions, setReceptions] = useState(initialReceptions);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingReception, setEditingReception] = useState(null);

  const [form, setForm] = useState({
    folio: "",
    supplier: "",
    products: "",
    date: "",
    total: "",
    status: "Pendiente",
  });

  const filteredReceptions = receptions.filter((item) =>
    `${item.folio} ${item.supplier} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      folio: "",
      supplier: "",
      products: "",
      date: "",
      total: "",
      status: "Pendiente",
    });

    setEditingReception(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingReception(null);
    setForm({
      folio: `REC-${String(receptions.length + 1).padStart(3, "0")}`,
      supplier: "",
      products: "",
      date: new Date().toISOString().slice(0, 10),
      total: "",
      status: "Pendiente",
    });
    setShowModal(true);
  };

  const handleEditReception = (reception) => {
    setEditingReception(reception);

    setForm({
      folio: reception.folio || "",
      supplier: reception.supplier || "",
      products: reception.products || "",
      date: reception.date || "",
      total: reception.total || "",
      status: reception.status || "Pendiente",
    });

    setShowModal(true);
  };

  const handleDeleteReception = (id) => {
    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar esta recepción?"
    );

    if (!confirmDelete) return;

    setReceptions(receptions.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveReception = (e) => {
    e.preventDefault();

    if (editingReception) {
      const updatedReception = {
        ...editingReception,
        folio: form.folio,
        supplier: form.supplier,
        products: Number(form.products),
        date: form.date,
        total: Number(form.total),
        status: form.status,
      };

      setReceptions(
        receptions.map((item) =>
          item.id === editingReception.id ? updatedReception : item
        )
      );
    } else {
      const newReception = {
        id: Date.now(),
        folio: form.folio,
        supplier: form.supplier,
        products: Number(form.products),
        date: form.date,
        total: Number(form.total),
        status: form.status,
      };

      setReceptions([newReception, ...receptions]);
    }

    resetForm();
  };

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

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"
            >
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
                <th className="py-3 px-3 text-right">Acciones</th>
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

                  <td className="py-4 px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditReception(item)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Editar recepción"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteReception(item.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Eliminar recepción"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReceptions.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No se encontraron recepciones.
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
                  {editingReception ? "Editar recepción" : "Nueva recepción"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingReception
                    ? "Modifica la información de la recepción seleccionada."
                    : "Registra una nueva entrada de productos."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveReception} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Folio
                </label>
                <input
                  name="folio"
                  value={form.folio}
                  onChange={handleChange}
                  required
                  placeholder="Ej. REC-004"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Proveedor
                </label>
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Café Selecto MX"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Cantidad de productos
                  </label>
                  <input
                    type="number"
                    name="products"
                    value={form.products}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Ej. 10"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Total
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={form.total}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Ej. 1500"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  >
                    <option>Pendiente</option>
                    <option>Completada</option>
                  </select>
                </div>
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
                  {editingReception
                    ? "Actualizar recepción"
                    : "Guardar recepción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default RecepcionesPage; 