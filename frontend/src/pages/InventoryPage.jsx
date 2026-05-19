import { Boxes, AlertTriangle } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function InventoryPage() {
  const inventory = [
    { id: 1, item: 'Granos de café', quantity: 12, unit: 'kg', status: 'Disponible' },
    { id: 2, item: 'Leche deslactosada', quantity: 4, unit: 'litros', status: 'Stock bajo' },
    { id: 3, item: 'Vasos medianos', quantity: 25, unit: 'piezas', status: 'Stock bajo' },
    { id: 4, item: 'Servilletas', quantity: 80, unit: 'piezas', status: 'Disponible' },
  ]

  return (
    <AdminLayout
      title="Inventario"
      subtitle="Control de existencias e insumos de la cafetería."
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 text-sm">
              <th className="py-3">Insumo</th>
              <th className="py-3">Cantidad</th>
              <th className="py-3">Unidad</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-stone-100">
                <td className="py-4 font-semibold text-stone-800 flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                    <Boxes size={20} />
                  </div>
                  {item.item}
                </td>
                <td className="py-4">{item.quantity}</td>
                <td className="py-4">{item.unit}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      item.status === 'Stock bajo'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.status === 'Stock bajo' && <AlertTriangle size={14} />}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default InventoryPage

