import { useEffect, useState } from "react";
import { Truck, Search, Plus, Phone, Mail } from "lucide-react";
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

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
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

            <button className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800">
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
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}

export default SuppliersPage; 