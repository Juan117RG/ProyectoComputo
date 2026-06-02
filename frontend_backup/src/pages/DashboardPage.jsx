import { Package, Users, Truck, Boxes, AlertTriangle } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function DashboardPage() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bienvenido, aquí tienes el resumen de la cafetería."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Productos"
          value="24"
          description="Registrados"
          icon={<Package size={28} />}
        />
        <StatCard
          title="Inventario"
          value="156"
          description="Unidades disponibles"
          icon={<Boxes size={28} />}
        />
        <StatCard
          title="Proveedores"
          value="8"
          description="Activos"
          icon={<Truck size={28} />}
        />
        <StatCard
          title="Clientes"
          value="42"
          description="Registrados"
          icon={<Users size={28} />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-stone-800 mb-4">
            Productos destacados
          </h3>

          <div className="space-y-4">
            <ProductRow name="Café americano" stock="35 unidades" price="$28.00" />
            <ProductRow name="Capuchino" stock="22 unidades" price="$38.00" />
            <ProductRow name="Croissant" stock="15 unidades" price="$32.00" />
            <ProductRow name="Sandwich universitario" stock="18 unidades" price="$45.00" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 text-red-700 p-3 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800">Alertas</h3>
              <p className="text-sm text-stone-500">Stock bajo</p>
            </div>
          </div>

          <div className="space-y-3">
            <AlertItem text="Leche deslactosada baja en inventario" />
            <AlertItem text="Vasos medianos por agotarse" />
            <AlertItem text="Pan dulce requiere reposición" />
            <AlertItem text="Servilletas con existencia mínima" />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-stone-500 text-sm">{title}</p>
          <h3 className="text-3xl font-bold text-stone-800">{value}</h3>
        </div>
        <div className="bg-amber-100 text-amber-800 p-3 rounded-xl">
          {icon}
        </div>
      </div>
      <p className="text-stone-500 text-sm">{description}</p>
    </div>
  )
}

function ProductRow({ name, stock, price }) {
  return (
    <div className="flex justify-between items-center border border-stone-200 rounded-xl px-4 py-3">
      <div>
        <p className="font-semibold text-stone-800">{name}</p>
        <p className="text-sm text-stone-500">{stock}</p>
      </div>
      <p className="font-bold text-amber-800">{price}</p>
    </div>
  )
}

function AlertItem({ text }) {
  return (
    <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
      {text}
    </div>
  )
}

export default DashboardPage

