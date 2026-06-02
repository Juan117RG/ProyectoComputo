import { useEffect, useState } from "react";
import { Truck, Search, Plus, Mail, Phone, X, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";
import { getItems, getErrorMessage } from "../utils/apiResponse.js";
import { hasPermission } from "../utils/auth";

const emptyForm = {
  nombre: "",
  telefono: "",
  email: "",
  contacto: "",
  giro: "",
  activo: true,
};

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const canCreate = hasPermission("suppliers:create");
  const canUpdate = hasPermission("suppliers:update");
  const canDelete = hasPermission("suppliers:delete");

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/suppliers", { params: { limit: 100 } });
      setSuppliers(getItems(response));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los proveedores."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.nombre || ""} ${supplier.email || ""} ${supplier.telefono || ""} ${supplier.contacto || ""} ${supplier.giro || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSupplier(null);
    setShowModal(false);
    setSaving(false);
  };

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      nombre: supplier.nombre || "",
      telefono: supplier.telefono || "",
      email: supplier.email || "",
      contacto: supplier.contacto || "",
      giro: supplier.giro || "",
      activo: supplier.activo ?? true,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => ({
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    email: form.email.trim(),
    contacto: form.contacto.trim(),
    giro: form.giro.trim(),
    rfc: "",
    direccion: "",
    notas: "",
    activo: form.activo,
  });

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = buildPayload();

      if (editingSupplier) {
        await api.patch(`/suppliers/${editingSupplier.id}`, payload);
      } else {
        await api.post("/suppliers", payload);
      }

      await loadSuppliers();
      resetForm();
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar el proveedor."));
      setSaving(false);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      await loadSuppliers();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo eliminar el proveedor."));
    }
  };

  return (
    <AdminLayout title="Proveedores" subtitle="Gestión de proveedores registrados en la cafetería.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">Proveedores registrados</h3>
            <p className="text-sm text-stone-500">{filteredSuppliers.length} proveedor(es) encontrados</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar proveedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            {canCreate && (
              <button onClick={handleOpenCreateModal} className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
                <Plus size={18} /> Nuevo proveedor
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-stone-500 py-8">Cargando proveedores...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-stone-500">
                  <th className="py-3 px-3">Proveedor</th>
                  <th className="py-3 px-3">Contacto</th>
                  <th className="py-3 px-3">Giro</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-stone-50">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-900 p-2 rounded-xl"><Truck size={18} /></div>
                        <div>
                          <p className="font-medium text-stone-800">{supplier.nombre}</p>
                          <p className="text-sm text-stone-500">{supplier.contacto || "Sin contacto"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <p className="flex items-center gap-2"><Mail size={15} />{supplier.email || "Sin correo"}</p>
                      <p className="flex items-center gap-2 text-sm text-stone-500"><Phone size={15} />{supplier.telefono || "Sin teléfono"}</p>
                    </td>
                    <td className="py-4 px-3">{supplier.giro || "General"}</td>
                    <td className="py-4 px-3">
                      <span className={supplier.activo ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm" : "bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-sm"}>
                        {supplier.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && <button onClick={() => handleEditSupplier(supplier)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Pencil size={17} /></button>}
                        {canDelete && <button onClick={() => handleDeleteSupplier(supplier.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSuppliers.length === 0 && <p className="text-center text-stone-500 py-8">No se encontraron proveedores.</p>}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-stone-800">{editingSupplier ? "Editar proveedor" : "Nuevo proveedor"}</h3>
              <button onClick={resetForm} className="text-stone-500 hover:text-stone-900"><X /></button>
            </div>

            <form onSubmit={handleSaveSupplier} className="grid gap-4">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del proveedor" className="rounded-xl border px-4 py-2" required />
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="rounded-xl border px-4 py-2" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Correo opcional" className="rounded-xl border px-4 py-2" />
              <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Persona de contacto opcional" className="rounded-xl border px-4 py-2" />
              <input name="giro" value={form.giro} onChange={handleChange} placeholder="Giro opcional, ejemplo: Panadería" className="rounded-xl border px-4 py-2" />
              <label className="flex items-center gap-2"><input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo</label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2">Cancelar</button>
                <button disabled={saving} type="submit" className="rounded-xl bg-amber-900 text-white px-4 py-2 hover:bg-amber-800 disabled:opacity-60">
                  {saving ? "Guardando..." : "Guardar"}
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
