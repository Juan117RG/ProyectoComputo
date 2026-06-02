import { useEffect, useMemo, useState } from 'react'
import { Shield, Search, Plus, X, Pencil, Trash2, Eye, Save } from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import api from '../api/api'
import { getItems, getItem, getErrorMessage } from '../utils/apiResponse'
import { hasPermission } from '../utils/auth'

const emptyForm = { nombre: '', descripcion: '', permissions: [] }

function RolesPage() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [editingRole, setEditingRole] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const canCreate = hasPermission('roles:create')
  const canUpdate = hasPermission('roles:update')
  const canDelete = hasPermission('roles:delete')

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const [rolesResponse, permissionsResponse] = await Promise.all([
        api.get('/roles', { params: { limit: 100 } }),
        api.get('/permissions', { params: { limit: 200 } }).catch(() => ({ data: { items: [] } }))
      ])
      setRoles(getItems(rolesResponse))
      setPermissions(getItems(permissionsResponse))
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los roles.'))
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(() => loadData(true), 10000)
    return () => clearInterval(interval)
  }, [])

  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      const modulo = permission.modulo || 'general'
      if (!acc[modulo]) acc[modulo] = []
      acc[modulo].push(permission)
      return acc
    }, {})
  }, [permissions])

  const filteredRoles = roles.filter((role) => `${role.nombre || ''} ${role.descripcion || ''}`.toLowerCase().includes(search.toLowerCase()))

  const resetForm = () => {
    setForm(emptyForm)
    setEditingRole(null)
    setShowModal(false)
  }

  const openCreate = () => {
    setEditingRole(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (role) => {
    setEditingRole(role)
    setForm({ nombre: role.nombre || '', descripcion: role.descripcion || '', permissions: role.permissions || [] })
    setShowModal(true)
  }

  const openDetails = async (role) => {
    try {
      const response = await api.get(`/roles/${role.id}`)
      setSelectedRole(getItem(response))
    } catch {
      setSelectedRole(role)
    }
    setShowDetails(true)
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const togglePermission = (code) => {
    setForm((prev) => {
      const current = Array.isArray(prev.permissions) ? prev.permissions : []
      return {
        ...prev,
        permissions: current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
      }
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() || '',
        permissions: form.permissions || []
      }

      if (editingRole) {
        await api.patch(`/roles/${editingRole.id}`, payload)
      } else {
        await api.post('/roles', payload)
      }

      resetForm()
      await loadData()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el rol.'))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este rol?')) return
    try {
      await api.delete(`/roles/${id}`)
      await loadData()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el rol.'))
    }
  }

  return (
    <AdminLayout title="Roles" subtitle="El admin puede crear roles y asignar permisos por módulo.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">Roles registrados</h3>
            <p className="text-sm text-stone-500">{filteredRoles.length} rol(es) encontrados</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Buscar rol..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30" />
            </div>
            {canCreate && <button onClick={openCreate} className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"><Plus size={18} />Nuevo rol</button>}
          </div>
        </div>

        {loading ? <p className="text-center text-stone-500 py-8">Cargando roles...</p> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRoles.map((role) => (
              <article key={role.id} className="border border-stone-200 rounded-2xl p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><Shield size={18} className="text-amber-900" /><p className="font-bold text-stone-800">{role.nombre}</p></div>
                    <p className="text-sm text-stone-500 mt-2">{role.descripcion || 'Sin descripción'}</p>
                    <p className="text-sm text-stone-500 mt-2">Permisos: {(role.permissions || []).length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openDetails(role)} className="h-9 rounded-lg p-2 text-stone-600 hover:bg-stone-100" title="Ver detalles"><Eye size={17} /></button>
                    {canUpdate && <button onClick={() => openEdit(role)} className="h-9 rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Editar"><Pencil size={17} /></button>}
                    {canDelete && <button onClick={() => handleDelete(role.id)} className="h-9 rounded-lg p-2 text-red-600 hover:bg-red-50" title="Eliminar"><Trash2 size={17} /></button>}
                  </div>
                </div>
              </article>
            ))}
            {filteredRoles.length === 0 && <p className="text-stone-500">No se encontraron roles.</p>}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-stone-800">{editingRole ? 'Editar rol' : 'Nuevo rol'}</h3>
              <button onClick={resetForm} className="text-stone-500 hover:text-stone-900"><X /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del rol" className="w-full rounded-xl border px-4 py-2" required />
                <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full rounded-xl border px-4 py-2" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 mb-2">Permisos del rol</h4>
                <p className="text-sm text-stone-500 mb-4">Marca solo los permisos que podrá ver o ejecutar el empleado asignado a este rol.</p>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(groupedPermissions).map(([modulo, list]) => (
                    <div key={modulo} className="rounded-2xl border border-stone-200 p-4">
                      <p className="font-bold text-amber-900 capitalize mb-3">{modulo}</p>
                      <div className="space-y-2">
                        {list.map((permission) => (
                          <label key={permission.code} className="flex items-start gap-2 text-sm text-stone-700">
                            <input type="checkbox" checked={(form.permissions || []).includes(permission.code)} onChange={() => togglePermission(permission.code)} className="mt-1" />
                            <span><b>{permission.code}</b><br /><span className="text-stone-500">{permission.nombre}</span></span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2">Cancelar</button>
                <button type="submit" className="rounded-xl bg-amber-900 text-white px-4 py-2 hover:bg-amber-800 flex items-center gap-2"><Save size={17} />Guardar rol</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedRole && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="text-xl font-bold text-stone-800">Detalles del rol</h3><button onClick={() => setShowDetails(false)} className="text-stone-500 hover:text-stone-900"><X /></button></div>
            <p className="text-lg font-bold text-stone-800">{selectedRole.nombre}</p>
            <p className="text-stone-500 mb-4">{selectedRole.descripcion || 'Sin descripción'}</p>
            <h4 className="font-bold text-stone-800 mb-2">Permisos asignados</h4>
            <div className="flex flex-wrap gap-2">
              {(selectedRole.permissions || []).map((permission) => <span key={permission} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-900 border border-amber-200">{permission}</span>)}
              {(selectedRole.permissions || []).length === 0 && <p className="text-stone-500">Este rol no tiene permisos.</p>}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default RolesPage
