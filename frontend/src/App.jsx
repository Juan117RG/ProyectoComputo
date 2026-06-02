import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/InventoryPage'
import SuppliersPage from './pages/SuppliersPage'
import ClientsPage from './pages/ClientsPage'
import UsersPage from './pages/UsersPage'
import RolesPage from './pages/RolesPage'
import PermissionsPage from './pages/PermissionsPage'
import RecepcionesPage from './pages/RecepcionesPage'
import AuditPage from './pages/AuditPage'
import NotFoundPage from './pages/NotFoundPage'
import api from './api/api'
import { hasPermission, setStoredUser, clearSession } from './utils/auth'

function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Sin permiso</h1>
        <p className="text-stone-600 mb-6">
          Tu rol no tiene permiso para ver este módulo.
        </p>
        <button
          onClick={() => {
            clearSession()
            window.location.href = '/login'
          }}
          className="bg-amber-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-amber-900"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, permission }) {
  const token = localStorage.getItem('token')
  const [checking, setChecking] = useState(Boolean(token))
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let alive = true

    async function verifySession() {
      if (!token) {
        if (alive) {
          setAllowed(false)
          setChecking(false)
        }
        return
      }

      try {
        const response = await api.get('/auth/me')
        const user = response.data?.user || response.data?.item || response.data
        setStoredUser(user)

        if (alive) {
          if (!permission) {
            setAllowed(true)
          } else {
            setAllowed(hasPermission(permission, user))
          }
        }
      } catch (error) {
        console.error('Error validando sesión:', error)
        clearSession()
        if (alive) setAllowed(false)
      } finally {
        if (alive) setChecking(false)
      }
    }

    verifySession()
    const interval = setInterval(verifySession, 15000)

    return () => {
      alive = false
      clearInterval(interval)
    }
  }, [token, permission])

  if (!token) return <Navigate to="/login" replace />

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">
        Validando permisos...
      </div>
    )
  }

  if (!allowed) return <AccessDenied />

  return children
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute permission="products:read">
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <ProtectedRoute permission="inventory:read">
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores"
          element={
            <ProtectedRoute permission="suppliers:read">
              <SuppliersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute permission="clients:read">
              <ClientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute permission="users:read">
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <ProtectedRoute permission="roles:read">
              <RolesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/permisos"
          element={
            <ProtectedRoute permission="permissions:read">
              <PermissionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepciones"
          element={
            <ProtectedRoute permission="recepciones:read">
              <RecepcionesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auditoria"
          element={
            <ProtectedRoute permission="audit:read">
              <AuditPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
