import { Plus, Search, Coffee } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function ProductsPage() {
  const products = [
    { id: 1, name: 'Café americano', category: 'Bebidas calientes', price: '$28.00', stock: 35 },
    { id: 2, name: 'Capuchino', category: 'Bebidas calientes', price: '$38.00', stock: 22 },
    { id: 3, name: 'Croissant', category: 'Panadería', price: '$32.00', stock: 15 },
    { id: 4, name: 'Sandwich universitario', category: 'Alimentos', price: '$45.00', stock: 18 },
  ]

  return (
    <AdminLayout
      title="Productos"
      subtitle="Administra los productos disponibles en la cafetería."
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          <button className="flex items-center justify-center gap-2 bg-amber-800 text-white px-5 py-3 rounded-xl hover:bg-amber-900">
            <Plus size={20} />
            Nuevo producto
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-sm">
                <th className="py-3">Producto</th>
                <th className="py-3">Categoría</th>
                <th className="py-3">Precio</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-stone-100">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                        <Coffee size={20} />
                      </div>
                      <span className="font-semibold text-stone-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-stone-600">{product.category}</td>
                  <td className="py-4 font-semibold text-amber-800">{product.price}</td>
                  <td className="py-4 text-stone-600">{product.stock}</td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Disponible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProductsPage


