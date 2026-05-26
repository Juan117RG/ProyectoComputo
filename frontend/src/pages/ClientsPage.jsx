import { useEffect, useState } from "react";
import { Users, Search, Plus, Phone, Mail } from "lucide-react";
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

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
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

            <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export default ClientsPage; 