import { useEffect, useState } from "react";
import {
  Truck,
  Search,
  Plus,
  Phone,
  Mail,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";

const sampleSuppliers = [
  {
    id: 1,
    name: "Café Selecto MX",
    contact: "María López",
    phone: "464 123 4567",
    email: "ventas@cafeselecto.mx",
    products: "Café, granos y molido",
    status: "Activo",
  },
  {
    id: 2,
    name: "Insumos Universitarios",
    contact: "Carlos Pérez",
    phone: "464 765 4321",
    email: "contacto@insumosuni.mx",
    products: "Vasos, servilletas y empaques",
    status: "Activo",
  },
  {
    id: 3,
    name: "Panadería La Central",
    contact: "Ana Torres",
    phone: "464 222 1900",
    email: "pedidos@lacentral.mx",
    products: "Pan dulce y repostería",
    status: "Activo",
  },
];

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    products: "",
  });

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.name || supplier.nombre || ""} ${
      supplier.contact || supplier.contacto || ""
    } ${supplier.email || supplier.correo || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await api.get("/suppliers");
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setSuppliers(data);
        }
      } catch (error) {
        console.log("Usando proveedores de ejemplo.");
      }
    };

    loadSuppliers();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      contact: "",
      phone: "",
      email: "",
      products: "",
    });

    setEditingSupplier(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setForm({
      name: "",
      contact: "",
      phone: "",
      email: "",
      products: "",
    });
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);

    setForm({
      name: supplier.name || supplier.nombre || "",
      contact: supplier.contact || supplier.contacto || "",
      phone: supplier.phone || supplier.telefono || "",
      email: supplier.email || supplier.correo || "",
      products: supplier.products || supplier.productos || "",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();

    if (editingSupplier) {
      const updatedSupplier = {
        ...editingSupplier,
        name: form.name,
        contact: form.contact,
        phone: form.phone,
        email: form.email,
        products: form.products,
        status: editingSupplier.status || "Activo",
      };

      try {
        await api.put(`/suppliers/${editingSupplier.id}`, updatedSupplier);
      } catch (error) {
        console.log("Proveedor actualizado solo en la vista local.");
      }

      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingSupplier.id ? updatedSupplier : supplier
        )
      );
    } else {
      const newSupplier = {
        id: Date.now(),
        name: form.name,
        contact: form.contact,
        phone: form.phone,
        email: form.email,
        products: form.products,
        status: "Activo",
      };

      try {
        const response = await api.post("/suppliers", newSupplier);
        const savedSupplier = response.data?.data || response.data || newSupplier;
        setSuppliers([savedSupplier, ...suppliers]);
      } catch (error) {
        setSuppliers([newSupplier, ...suppliers]);
      }
    }

    resetForm();
  };

  const handleDeleteSupplier = async (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este proveedor?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/suppliers/${id}`);
    } catch (error) {
      console.log("Proveedor eliminado solo en la vista local.");
    }

    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <AdminLayout
      title="Proveedores"
      subtitle="Administración de proveedores de la cafetería."
    >
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Proveedores registrados
            </h3>
            <p className="text-sm text-stone-500">
              {filteredSuppliers.length} proveedor(es) encontrados
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
                placeholder="Buscar proveedor..."
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
              Nuevo proveedor
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <article
              key={supplier.id}
              className="border border-stone-200 rounded-2xl p-5 hover:shadow-md transition bg-white"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
                    <Truck size={22} />
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-800">
                      {supplier.name || supplier.nombre}
                    </h4>
                    <p className="text-sm text-stone-500">
                      {supplier.contact || supplier.contacto}
                    </p>
                  </div>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {supplier.status || "Activo"}
                </span>
              </div>

              <p className="text-sm text-stone-600 mb-4">
                {supplier.products || supplier.productos}
              </p>

              <div className="space-y-2 text-sm text-stone-500">
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {supplier.phone || supplier.telefono}
                </p>

                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {supplier.email || supplier.correo}
                </p>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => handleEditSupplier(supplier)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  title="Editar proveedor"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  title="Eliminar proveedor"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}

          {filteredSuppliers.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500">
              No se encontraron proveedores.
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {editingSupplier ? "Editar proveedor" : "Nuevo proveedor"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingSupplier
                    ? "Modifica la información del proveedor seleccionado."
                    : "Registra un nuevo proveedor en el sistema."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nombre del proveedor
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Café Selecto MX"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Persona de contacto
                </label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  placeholder="Ej. María López"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Ej. 464 123 4567"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="proveedor@correo.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Productos que suministra
                </label>
                <textarea
                  name="products"
                  value={form.products}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Ej. Café, vasos, servilletas..."
                  className="w-full resize-none rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
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
                  {editingSupplier
                    ? "Actualizar proveedor"
                    : "Guardar proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default SuppliersPage; 