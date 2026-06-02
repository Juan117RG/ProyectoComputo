import { verifyAccessToken } from '../config/jwt.js'
import { usersRepository } from '../modules/users/users.repository.js'
import { rolesRepository } from '../modules/roles/roles.repository.js'

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

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    const userId = decoded.sub || decoded.id
    const user = userId ? await usersRepository.findById(userId) : null

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    if (user.activo === false) {
      return res.status(403).json({ message: 'Usuario inactivo' })
    }

    let role = null
    if (user.roleId) {
      role = await rolesRepository.findById(user.roleId)
    }

    const rolePermissions = Array.isArray(role?.permissions) ? role.permissions : []
    const userPermissions = Array.isArray(user.permissions) ? user.permissions : []
    const permissions = unique([...rolePermissions, ...userPermissions])

    req.user = {
      ...decoded,
      sub: user.id,
      id: user.id,
      usuario: user.usuario || decoded.usuario || '',
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      role: role?.nombre || user.role || null,
      roleId: user.roleId || null,
      permissions,
      isAdmin: isAdminLike(user, role)
    }

    next()
  } catch (error) {
    console.error('AUTH ERROR =>', error)
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
