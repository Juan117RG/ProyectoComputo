import { useEffect, useState } from "react";
import {
  Users,
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

const sampleClients = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "464 100 2000",
    email: "juanperez@mail.com",
    type: "Estudiante",
    visits: 12,
    status: "Activo",
  },
  {
    id: 2,
    name: "María García",
    phone: "464 333 4567",
    email: "maria@mail.com",
    type: "Docente",
    visits: 8,
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos Torres",
    phone: "464 555 7890",
    email: "carlos@mail.com",
    type: "Administrativo",
    visits: 5,
    status: "Activo",
  },
];

function ClientsPage() {
  const [clients, setClients] = useState(sampleClients);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "Estudiante",
  });

  const filteredClients = clients.filter((client) =>
    `${client.name || client.nombre || ""} ${client.email || client.correo || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await api.get("/clients");
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setClients(data);
        }
      } catch (error) {
        console.log("Usando clientes de ejemplo.");
      }
    };

    loadClients();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      type: "Estudiante",
    });

    setEditingClient(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      type: "Estudiante",
    });
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);

    setForm({
      name: client.name || client.nombre || "",
      phone: client.phone || client.telefono || "",
      email: client.email || client.correo || "",
      type: client.type || client.tipo || "General",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();

    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        name: form.name,
        phone: form.phone,
        email: form.email,
        type: form.type,
        status: editingClient.status || "Activo",
        visits: editingClient.visits || editingClient.visitas || 0,
      };

      try {
        await api.put(`/clients/${editingClient.id}`, updatedClient);
      } catch (error) {
        console.log("Cliente actualizado solo en la vista local.");
      }

      setClients(
        clients.map((client) =>
          client.id === editingClient.id ? updatedClient : client
        )
      );
    } else {
      const newClient = {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        email: form.email,
        type: form.type,
        visits: 0,
        status: "Activo",
      };

      try {
        const response = await api.post("/clients", newClient);
        const savedClient = response.data?.data || response.data || newClient;

        setClients([savedClient, ...clients]);
      } catch (error) {
        setClients([newClient, ...clients]);
      }
    }

    resetForm();
  };

  const handleDeleteClient = async (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este cliente?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      console.log("Cliente eliminado solo en la vista local.");
    }

    setClients(clients.filter((client) => client.id !== id));
  };

  return (
    <AdminLayout
      title="Clientes"
      subtitle="Gestión de clientes registrados en la cafetería."
    >
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Clientes registrados
            </h3>
            <p className="text-sm text-stone-500">
              {filteredClients.length} cliente(s) encontrados
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
                placeholder="Buscar cliente..."
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
              Nuevo cliente
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Contacto</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Visitas</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                        <Users size={18} />
                      </div>

                      <span className="font-medium text-stone-800">
                        {client.name || client.nombre}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="space-y-1 text-sm text-stone-500">
                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {client.phone || client.telefono}
                      </p>

                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {client.email || client.correo}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    {client.type || client.tipo || "General"}
                  </td>

                  <td className="py-4 px-3 font-semibold">
                    {client.visits || client.visitas || 0}
                  </td>

                  <td className="py-4 px-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {client.status || "Activo"}
                    </span>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Editar cliente"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Eliminar cliente"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No se encontraron clientes.
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
                  {editingClient ? "Editar cliente" : "Nuevo cliente"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingClient
                    ? "Modifica la información del cliente seleccionado."
                    : "Registra un nuevo cliente en el sistema."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nombre completo
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  placeholder="Ej. Juan Pérez"
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  placeholder="Ej. 464 123 4567"
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  placeholder="cliente@correo.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Tipo de cliente
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                >
                  <option>Estudiante</option>
                  <option>Docente</option>
                  <option>Administrativo</option>
                  <option>General</option>
                </select>
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
                  {editingClient ? "Actualizar cliente" : "Guardar cliente"}
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