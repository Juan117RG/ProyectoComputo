import bcrypt from 'bcryptjs'
import { signAccessToken } from '../../config/jwt.js'
import { authRepository } from './auth.repository.js'
import { rolesRepository } from '../roles/roles.repository.js'

function unique(list = []) {
  return [...new Set(list.filter(Boolean))]
}

function isAdminLike(user = {}, role = {}) {
  return String(user.usuario || '').toLowerCase() === 'proyecto' ||
    String(user.role || '').toLowerCase() === 'administrador' ||
    String(user.role || '').toLowerCase() === 'admin' ||
    String(role.nombre || '').toLowerCase() === 'administrador' ||
    String(role.nombre || '').toLowerCase() === 'admin'
}

export class AuthService {
  async hydrateUser(user) {
    let role = null
    if (user?.roleId) {
      role = await rolesRepository.findById(user.roleId)
    }

    const rolePermissions = Array.isArray(role?.permissions) ? role.permissions : []
    const userPermissions = Array.isArray(user?.permissions) ? user.permissions : []

    return {
      ...user,
      role: role?.nombre || user?.role || null,
      permissions: unique([...rolePermissions, ...userPermissions]),
      isAdmin: isAdminLike(user, role)
    }
  }

  async login(payload) {
    const { usuario, password } = payload

    const user = await authRepository.findByUsuario(usuario)

    if (!user) {
      const error = new Error('Credenciales inválidas')
      error.statusCode = 401
      throw error
    }

    if (user.activo === false) {
      const error = new Error('Usuario inactivo')
      error.statusCode = 403
      throw error
    }

    const passwordHash = user.passwordHash || user.password

    if (!passwordHash) {
      const error = new Error('El usuario no tiene contraseña configurada')
      error.statusCode = 500
      throw error
    }

    const isValidPassword = await bcrypt.compare(password, passwordHash)

    if (!isValidPassword) {
      const error = new Error('Credenciales inválidas')
      error.statusCode = 401
      throw error
    }

    const hydratedUser = await this.hydrateUser(user)

    const token = signAccessToken({
      sub: hydratedUser.id,
      usuario: hydratedUser.usuario,
      role: hydratedUser.role || null,
      roleId: hydratedUser.roleId || null,
      permissions: hydratedUser.permissions || []
    })

    return {
      token,
      user: this.sanitizeUser(hydratedUser)
    }
  }

  async me(userId) {
    const user = await authRepository.findById(userId)

    if (!user) {
      const error = new Error('Usuario no encontrado')
      error.statusCode = 404
      throw error
    }

    if (user.activo === false) {
      const error = new Error('Usuario inactivo')
      error.statusCode = 403
      throw error
    }

    const hydratedUser = await this.hydrateUser(user)
    return this.sanitizeUser(hydratedUser)
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      usuario: user.usuario || '',
      role: user.role || null,
      roleId: user.roleId || null,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      isAdmin: user.isAdmin === true,
      activo: user.activo ?? true
    }
  }
}

export const authService = new AuthService()
