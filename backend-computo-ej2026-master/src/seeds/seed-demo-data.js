import bcrypt from 'bcryptjs'
import { db } from '../config/firebase.js'

const now = () => new Date().toISOString()

const products = [
  { id: 'prod_cafe_americano', sku: 'CAF-001', nombre: 'Café americano', categoria: 'Bebidas calientes', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Café americano 12 oz', precioCompra: 12, precioVenta: 28, stock: 35, stockMinimo: 10, activo: true },
  { id: 'prod_latte', sku: 'CAF-002', nombre: 'Latte vainilla', categoria: 'Bebidas calientes', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Latte con jarabe de vainilla', precioCompra: 18, precioVenta: 45, stock: 22, stockMinimo: 8, activo: true },
  { id: 'prod_moka', sku: 'CAF-003', nombre: 'Moka frío', categoria: 'Bebidas frías', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Bebida fría sabor moka', precioCompra: 20, precioVenta: 48, stock: 5, stockMinimo: 8, activo: true },
  { id: 'prod_chai', sku: 'BEB-001', nombre: 'Té chai', categoria: 'Bebidas calientes', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Té chai 12 oz', precioCompra: 15, precioVenta: 38, stock: 14, stockMinimo: 6, activo: true },
  { id: 'prod_agua', sku: 'BEB-002', nombre: 'Agua natural', categoria: 'Bebidas frías', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Botella de agua 600 ml', precioCompra: 8, precioVenta: 18, stock: 42, stockMinimo: 12, activo: true },
  { id: 'prod_croissant', sku: 'PAN-001', nombre: 'Croissant', categoria: 'Panadería', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Croissant de mantequilla', precioCompra: 14, precioVenta: 32, stock: 3, stockMinimo: 5, activo: true },
  { id: 'prod_muffin', sku: 'PAN-002', nombre: 'Muffin chocolate', categoria: 'Panadería', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Muffin con chispas de chocolate', precioCompra: 13, precioVenta: 30, stock: 16, stockMinimo: 6, activo: true },
  { id: 'prod_brownie', sku: 'PAN-003', nombre: 'Brownie', categoria: 'Postres', unidad: 'pieza', marca: '', modelo: '', descripcion: 'Brownie individual', precioCompra: 15, precioVenta: 35, stock: 4, stockMinimo: 6, activo: true }
]

const suppliers = [
  { id: 'sup_cafe_sierra', nombre: 'Café Sierra', rfc: '', email: 'ventas@cafesierra.local', telefono: '464 123 4501', direccion: '', contacto: 'María López', giro: 'Café y granos', notas: '', activo: true },
  { id: 'sup_pan_espiga', nombre: 'Panadería La Espiga', rfc: '', email: 'pedidos@laespiga.local', telefono: '464 123 4502', direccion: '', contacto: 'Carlos Méndez', giro: 'Panadería', notas: '', activo: true },
  { id: 'sup_lacteos_bajio', nombre: 'Lácteos del Bajío', rfc: '', email: 'contacto@lacteosbajio.local', telefono: '464 123 4503', direccion: '', contacto: 'Ana Torres', giro: 'Lácteos', notas: '', activo: true },
  { id: 'sup_desechables_centro', nombre: 'Desechables Centro', rfc: '', email: 'ventas@desechablescentro.local', telefono: '464 123 4504', direccion: '', contacto: 'Roberto García', giro: 'Insumos', notas: '', activo: true }
]

const clients = [
  { id: 'cli_mostrador', nombre: 'Cliente mostrador', rfc: '', email: '', telefono: '', direccion: '', contacto: 'Venta directa', notas: '', activo: true },
  { id: 'cli_oficina_rivera', nombre: 'Oficina Contable Rivera', rfc: '', email: 'compras@rivera.local', telefono: '464 555 1001', direccion: '', contacto: 'Lic. Rivera', notas: '', activo: true },
  { id: 'cli_universidad_local', nombre: 'Universidad Local', rfc: '', email: 'eventos@universidad.local', telefono: '464 555 1002', direccion: '', contacto: 'Coordinación', notas: '', activo: true },
  { id: 'cli_eventos_salamanca', nombre: 'Eventos Salamanca', rfc: '', email: 'contacto@eventossalamanca.local', telefono: '464 555 1003', direccion: '', contacto: 'Diana Pérez', notas: '', activo: true }
]

const roles = [
  {
    id: 'role_caja_demo',
    nombre: 'Caja',
    descripcion: 'Rol de ejemplo para vender y consultar inventario básico',
    permissions: ['dashboard:read', 'products:read', 'inventory:read', 'clients:read', 'clients:create']
  },
  {
    id: 'role_inventario_demo',
    nombre: 'Inventario',
    descripcion: 'Rol de ejemplo para administrar productos, proveedores e inventario',
    permissions: ['dashboard:read', 'products:read', 'products:create', 'products:update', 'inventory:read', 'inventory:update', 'suppliers:read', 'suppliers:create', 'recepciones:read', 'recepciones:create']
  }
]

const users = [
  { id: 'user_caja_demo', nombre: 'Empleado', apellido: 'Caja', email: 'caja@erp.local', usuario: 'caja', password: '123456', role: 'Caja', roleId: 'role_caja_demo', activo: true },
  { id: 'user_inventario_demo', nombre: 'Empleado', apellido: 'Inventario', email: 'inventario@erp.local', usuario: 'inventario', password: '123456', role: 'Inventario', roleId: 'role_inventario_demo', activo: true }
]

const movements = [
  { id: 'mov_demo_001', productId: 'prod_cafe_americano', sku: 'CAF-001', productNombre: 'Café americano', tipo: 'ENTRADA', cantidad: 25, stockAnterior: 10, stockNuevo: 35, motivo: 'Carga inicial de demostración', referencia: 'DEMO-001' },
  { id: 'mov_demo_002', productId: 'prod_croissant', sku: 'PAN-001', productNombre: 'Croissant', tipo: 'SALIDA', cantidad: 7, stockAnterior: 10, stockNuevo: 3, motivo: 'Venta de mostrador', referencia: 'DEMO-002' },
  { id: 'mov_demo_003', productId: 'prod_moka', sku: 'CAF-003', productNombre: 'Moka frío', tipo: 'SALIDA', cantidad: 4, stockAnterior: 9, stockNuevo: 5, motivo: 'Venta de turno', referencia: 'DEMO-003' },
  { id: 'mov_demo_004', productId: 'prod_brownie', sku: 'PAN-003', productNombre: 'Brownie', tipo: 'AJUSTE', cantidad: 4, stockAnterior: 8, stockNuevo: 4, motivo: 'Ajuste físico de inventario', referencia: 'DEMO-004' }
]

const recepciones = [
  {
    id: 'rec_demo_001',
    supplierId: 'sup_pan_espiga',
    supplierNombre: 'Panadería La Espiga',
    fecha: new Date().toISOString().slice(0, 10),
    folio: 'REC-DEMO-001',
    comentarios: 'Recepción de panadería para demostración',
    status: 'DRAFT',
    items: [
      { productId: 'prod_croissant', sku: 'PAN-001', productNombre: 'Croissant', cantidad: 12, costoUnitario: 14, subtotal: 168 },
      { productId: 'prod_muffin', sku: 'PAN-002', productNombre: 'Muffin chocolate', cantidad: 10, costoUnitario: 13, subtotal: 130 }
    ],
    total: 298,
    confirmedAt: null,
    confirmedBy: '',
    confirmedByUserId: '',
    createdBy: 'proyecto',
    createdByUserId: 'seed',
  }
]

async function setDoc(collection, id, data) {
  const ref = db.collection(collection).doc(id)
  await ref.set({ ...data, updatedAt: now(), createdAt: data.createdAt || now() }, { merge: true })
}

async function seedDemoData() {
  console.log('Sembrando datos de demostración...')

  for (const role of roles) {
    await setDoc('roles', role.id, role)
  }

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const { password, ...safeUser } = user
    await setDoc('users', user.id, { ...safeUser, passwordHash, permissions: [] })
  }

  for (const supplier of suppliers) {
    await setDoc('suppliers', supplier.id, supplier)
  }

  for (const client of clients) {
    await setDoc('clients', client.id, client)
  }

  for (const product of products) {
    await setDoc('products', product.id, product)
  }

  for (const movement of movements) {
    await setDoc('inventoryMovements', movement.id, {
      ...movement,
      userId: 'seed',
      usuario: 'proyecto',
      createdAt: now()
    })
  }

  for (const recepcion of recepciones) {
    await setDoc('recepciones', recepcion.id, recepcion)
  }

  const auditItems = [
    { id: 'audit_demo_001', action: 'SEED', resource: 'demo', resourceId: 'seed-demo-data', details: { message: 'Datos de demostración cargados' }, userId: 'seed', usuario: 'proyecto' },
    { id: 'audit_demo_002', action: 'CREATE', resource: 'products', resourceId: 'prod_cafe_americano', details: { sku: 'CAF-001', nombre: 'Café americano' }, userId: 'seed', usuario: 'proyecto' },
    { id: 'audit_demo_003', action: 'CREATE', resource: 'suppliers', resourceId: 'sup_pan_espiga', details: { nombre: 'Panadería La Espiga' }, userId: 'seed', usuario: 'proyecto' }
  ]

  for (const item of auditItems) {
    await setDoc('audit', item.id, { ...item, createdAt: now() })
  }

  console.log('Listo. Se agregaron productos, proveedores, clientes, movimientos, recepción, roles y usuarios demo.')
  console.log('Usuarios demo: caja / 123456 e inventario / 123456')
}

seedDemoData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error al sembrar datos demo:', error)
    process.exit(1)
  })
