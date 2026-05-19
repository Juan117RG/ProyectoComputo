import Sidebar from './Sidebar'
import Header from './Header'

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-stone-100 flex">
      <Sidebar />

      <main className="flex-1">
        <Header title={title} subtitle={subtitle} />
        <section className="p-6">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout

