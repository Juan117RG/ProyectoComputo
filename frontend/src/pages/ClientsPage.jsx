import { useEffect, useState } from "react";
import { Users, Search, Plus, Mail, Phone, X, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";
import { getItems, getErrorMessage } from "../utils/apiResponse";
import { hasPermission } from "../utils/auth";

const emptyForm = {
  nombre: "",
  email: "",
  telefono: "",
  contacto: "",
  activo: true,
};

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const canCreate = hasPermission("clients:create");
  const canUpdate = hasPermission("clients:update");
  const canDelete = hasPermission("clients:delete");

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients", { params: { limit: 100 } });
      setClients(getItems(response));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los clientes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    `${client.nombre || ""} ${client.email || ""} ${client.telefono || ""} ${client.contacto || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingClient(null);
    setShowModal(false);
    setSaving(false);
  };

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setForm({
      nombre: client.nombre || "",
      email: client.email || "",
      telefono: client.telefono || "",
      contacto: client.contacto || "",
      activo: client.activo ?? true,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => ({
    nombre: form.nombre.trim(),
    email: form.email.trim(),
    telefono: form.telefono.trim(),
    contacto: form.contacto.trim(),
    rfc: "",
    direccion: "",
    notas: "",
    activo: form.activo,
  });

  const handleSaveClient = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = buildPayload();

      if (editingClient) {
        await api.patch(`/clients/${editingClient.id}`, payload);
      } else {
        await api.post("/clients", payload);
      }

      await loadClients();
      resetForm();
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar el cliente."));
      setSaving(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await api.delete(`/clients/${id}`);
      await loadClients();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo eliminar el cliente."));
    }
  };

  return (
    <AdminLayout title="Clientes" subtitle="Gestión de clientes registrados en la cafetería.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">Clientes registrados</h3>
            <p className="text-sm text-stone-500">{filteredClients.length} cliente(s) encontrados</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            {canCreate && (
              <button onClick={handleOpenCreateModal} className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
                <Plus size={18} /> Nuevo cliente
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-stone-500 py-8">Cargando clientes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-stone-500">
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Contacto</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-stone-50">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-900 p-2 rounded-xl"><Users size={18} /></div>
                        <div>
                          <p className="font-medium text-stone-800">{client.nombre}</p>
                          <p className="text-sm text-stone-500">{client.contacto || "Sin contacto"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <p className="flex items-center gap-2"><Mail size={15} />{client.email || "Sin correo"}</p>
                      <p className="flex items-center gap-2 text-sm text-stone-500"><Phone size={15} />{client.telefono || "Sin teléfono"}</p>
                    </td>
                    <td className="py-4 px-3">
                      <span className={client.activo ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm" : "bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-sm"}>
                        {client.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && <button onClick={() => handleEditClient(client)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Pencil size={17} /></button>}
                        {canDelete && <button onClick={() => handleDeleteClient(client.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClients.length === 0 && <p className="text-center text-stone-500 py-8">No se encontraron clientes.</p>}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-stone-800">{editingClient ? "Editar cliente" : "Nuevo cliente"}</h3>
              <button onClick={resetForm} className="text-stone-500 hover:text-stone-900"><X /></button>
            </div>

            <form onSubmit={handleSaveClient} className="grid gap-4">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del cliente" className="rounded-xl border px-4 py-2" required />
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="rounded-xl border px-4 py-2" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Correo opcional" className="rounded-xl border px-4 py-2" />
              <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto opcional" className="rounded-xl border px-4 py-2" />
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

export default ClientsPage;
