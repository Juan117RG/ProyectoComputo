import { useEffect, useState } from 'react'
import { Plus, Search, Coffee, AlertCircle } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { getProducts } from '../services/productsService'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getProducts()

      const data =
        response?.data ||
        response?.products ||
        response?.items ||
        response ||
        []

      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los productos desde el backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const name = product.name || product.nombre || ''
    const category = product.category || product.categoria || ''

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    )
  })

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          <button className="flex items-center justify-center gap-2 bg-amber-800 text-white px-5 py-3 rounded-xl hover:bg-amber-900">
            <Plus size={20} />
            Nuevo producto
          </button>
        </div>

        {loading && (
          <div className="text-center py-10 text-stone-500">
            Cargando productos...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 mb-5">
            <AlertCircle size={22} />
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-10 text-stone-500">
            No hay productos registrados todavía.
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
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
                {filteredProducts.map((product) => {
                  const id = product.id || product._id
                  const name = product.name || product.nombre || 'Sin nombre'
                  const category = product.category || product.categoria || 'Sin categoría'
                  const price = product.price || product.precio || 0
                  const stock = product.stock || product.existencia || product.quantity || 0

                  return (
                    <tr key={id || name} className="border-b border-stone-100">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                            <Coffee size={20} />
                          </div>
                          <span className="font-semibold text-stone-800">
                            {name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-stone-600">
                        {category}
                      </td>

                      <td className="py-4 font-semibold text-amber-800">
                        ${Number(price).toFixed(2)}
                      </td>

                      <td className="py-4 text-stone-600">
                        {stock}
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            Number(stock) > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {Number(stock) > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ProductsPage 