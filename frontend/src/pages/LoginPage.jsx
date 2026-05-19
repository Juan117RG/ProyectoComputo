import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, Eye, EyeOff } from 'lucide-react'
import api from '../api/api'

function LoginPage() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        usuario,
        password,
      })

      const token = response.data?.data?.accessToken || response.data?.accessToken || response.data?.token

      if (!token) {
        throw new Error('No se recibió token del servidor')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('usuario', usuario)

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Usuario o contraseña incorrectos. Verifica tus datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="hidden md:flex flex-col justify-between bg-amber-800 text-white p-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Coffee size={34} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Café Campus</h1>
                <p className="text-amber-100">Panel administrativo</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-5">
              Administra tu cafetería universitaria de forma inteligente.
            </h2>

            <p className="text-amber-100 text-lg">
              Controla productos, inventario, proveedores, clientes y recepciones desde un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-amber-100">Productos</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-amber-100">Proveedores</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-amber-100">Alertas</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="bg-amber-800 text-white p-3 rounded-2xl">
              <Coffee size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">Café Campus</h1>
              <p className="text-stone-500">Panel administrativo</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Iniciar sesión
          </h2>
          <p className="text-stone-500 mb-8">
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ejemplo: proyecto"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-stone-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Entrar al sistema'}
            </button>
          </form>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-stone-700">
            <p className="font-semibold mb-1">Credenciales de prueba:</p>
            <p>Usuario: <span className="font-mono">proyecto</span></p>
            <p>Contraseña: <span className="font-mono">Hello2U"</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage