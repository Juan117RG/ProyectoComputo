import { Truck, Phone, Mail } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function SuppliersPage() {
  const suppliers = [
    { id: 1, name: 'Distribuidora Café del Bajío', phone: '464 123 4567', email: 'ventas@cafebajio.com' },
    { id: 2, name: 'Panadería La Universitaria', phone: '464 222 3344', email: 'contacto@panuni.com' },
    { id: 3, name: 'Lácteos San Miguel', phone: '464 555 6677', email: 'pedidos@lacteos.com' },
  ]

  return (
    <AdminLayout
      title="Proveedores"
      subtitle="Gestiona los proveedores principales de la cafetería."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="bg-amber-100 text-amber-800 p-3 rounded-xl w-fit mb-4">
              <Truck size={26} />
            </div>

            <h3 className="text-lg font-bold text-stone-800 mb-3">
              {supplier.name}
            </h3>

            <p className="flex items-center gap-2 text-stone-600 mb-2">
              <Phone size={18} />
              {supplier.phone}
            </p>

            <p className="flex items-center gap-2 text-stone-600">
              <Mail size={18} />
              {supplier.email}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default SuppliersPage

