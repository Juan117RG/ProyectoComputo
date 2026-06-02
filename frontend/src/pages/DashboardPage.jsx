import { useEffect, useState } from 'react'
import { Package, Users, Truck, Boxes, AlertTriangle, ClipboardList, History } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import api from '../api/api'

const emptySummary = {
  totals: {
    products: 0,
    activeProducts: 0,
    clients: 0,
    activeClients: 0,
    suppliers: 0,
    activeSuppliers: 0,
    users: 0,
    activeUsers: 0,
    recepciones: 0,
  },
  lowStockCount: 0,
  lowStockProducts: [],
  recepcionesRecientes: [],
  recentInventoryMovements: [],
  recentAudit: [],
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleString('es-MX')
}

function DashboardPage() {
  const [summary, setSummary] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async (silent = false) => {
      try {
        if (!silent) setLoading(true)
        const response = await api.get('/dashboard/summary')
        setSummary({ ...emptySummary, ...response.data })
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el dashboard.')
      } finally {
        if (!silent) setLoading(false)
      }
    }

    loadDashboard()
    const interval = setInterval(() => loadDashboard(true), 5000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { title: 'Productos', value: summary.totals.products, sub: `${summary.totals.activeProducts} activos`, icon: Package },
    { title: 'Inventario bajo', value: summary.lowStockCount, sub: 'Productos en mínimo', icon: AlertTriangle },
    { title: 'Proveedores', value: summary.totals.suppliers, sub: `${summary.totals.activeSuppliers} activos`, icon: Truck },
    { title: 'Clientes', value: summary.totals.clients, sub: `${summary.totals.activeClients} activos`, icon: Users },
    { title: 'Usuarios', value: summary.totals.users, sub: `${summary.totals.activeUsers} activos`, icon: Boxes },
    { title: 'Recepciones', value: summary.totals.recepciones, sub: 'Registradas', icon: ClipboardList },
  ]

  return (
    <AdminLayout title="Dashboard" subtitle="Resumen real del sistema conectado al backend.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <section className="rounded-2xl bg-white p-8 text-center shadow text-stone-500">Cargando dashboard...</section>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <article key={card.title} className="rounded-2xl bg-white p-5 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-500">{card.title}</p>
                      <p className="mt-2 text-3xl font-bold text-stone-900">{card.value}</p>
                      <p className="mt-1 text-sm text-stone-500">{card.sub}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-100 p-3 text-amber-900"><Icon size={26} /></div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl bg-white p-6 shadow">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="text-amber-900" />
                <h3 className="text-xl font-bold text-stone-800">Productos con stock bajo</h3>
              </div>
              <div className="space-y-3">
                {summary.lowStockProducts.length === 0 && <p className="text-stone-500">No hay productos con stock bajo.</p>}
                {summary.lowStockProducts.map((product) => (
                  <div key={product.id} className="rounded-xl border border-stone-200 p-4">
                    <p className="font-semibold text-stone-800">{product.nombre}</p>
                    <p className="text-sm text-stone-500">SKU: {product.sku} · Stock: {product.stock} · Mínimo: {product.stockMinimo}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow">
              <div className="mb-4 flex items-center gap-3">
                <History className="text-amber-900" />
                <h3 className="text-xl font-bold text-stone-800">Actividad reciente</h3>
              </div>
              <div className="space-y-3">
                {summary.recentAudit.length === 0 && <p className="text-stone-500">No hay actividad reciente.</p>}
                {summary.recentAudit.map((log) => (
                  <div key={log.id} className="rounded-xl border border-stone-200 p-4">
                    <p className="font-semibold text-stone-800">{log.action} · {log.resource}</p>
                    <p className="text-sm text-stone-500">Usuario: {log.usuario || 'Sistema'} · {formatDate(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default DashboardPage
