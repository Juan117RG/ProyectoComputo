export function requirePermissions(requiredPermissions = []) {
  return (req, res, next) => {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    if (user.isAdmin === true) {
      return next()
    }

    const userPermissions = Array.isArray(user.permissions) ? user.permissions : []
    const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission))

    if (!hasAllPermissions) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
    }

    next()
  }
}
