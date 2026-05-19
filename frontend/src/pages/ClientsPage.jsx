import { Users, Mail, BadgeCheck } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'

function ClientsPage() {
  const clients = [
    { id: 1, name: 'Alumno frecuente', email: 'alumno@universidad.edu', type: 'Estudiante' },
    { id: 2, name: 'Profesor registrado', email: 'profesor@universidad.edu', type: 'Docente' },
    { id: 3, name: 'Personal administrativo', email: 'admin@universidad.edu', type: 'Administrativo' },
  ]

  return (
    <AdminLayout
      title="Clientes"
      subtitle="Consulta clientes frecuentes registrados en Café Campus."
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <div key={client.id} className="border border-stone-200 rounded-2xl p-5">
              <div className="bg-amber-100 text-amber-800 p-3 rounded-xl w-fit mb-4">
                <Users size={26} />
              </div>

              <h3 className="text-lg font-bold text-stone-800">{client.name}</h3>

              <p className="flex items-center gap-2 text-stone-600 mt-3">
                <Mail size={18} />
                {client.email}
              </p>

              <p className="flex items-center gap-2 text-green-700 mt-3">
                <BadgeCheck size={18} />
                {client.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default ClientsPage


