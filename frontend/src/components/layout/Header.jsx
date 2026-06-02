import { getStoredUser } from '../../utils/auth'

function Header({ title, subtitle }) {
  const user = getStoredUser()
  const nombre = user ? `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.usuario : 'Administrador'

  return (
    <header className="bg-white shadow-sm px-6 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
        <p className="text-stone-500">{subtitle}</p>
      </div>
      <div className="hidden md:block text-right">
        <p className="text-sm text-stone-500">Usuario activo</p>
        <p className="font-semibold text-stone-800">{nombre}</p>
        <p className="text-xs text-stone-500">{user?.role || 'Sin rol'}</p>
      </div>
    </header>
  )
}

export default Header
