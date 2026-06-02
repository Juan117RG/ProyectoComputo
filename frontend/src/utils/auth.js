export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') || null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  if (!user) return
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('usuario', user.usuario || user.nombre || 'Usuario')
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('usuario')
}

export function hasPermission(permission, user = getStoredUser()) {
  if (!permission) return true
  if (user?.isAdmin === true) return true
  const permissions = Array.isArray(user?.permissions) ? user.permissions : []
  return permissions.includes(permission)
}

export function hasAnyPermission(permissions = [], user = getStoredUser()) {
  if (!permissions.length) return true
  if (user?.isAdmin === true) return true
  return permissions.some((permission) => hasPermission(permission, user))
}

export function getPermissions(user = getStoredUser()) {
  return Array.isArray(user?.permissions) ? user.permissions : []
}
