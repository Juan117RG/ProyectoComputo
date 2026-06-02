import { useEffect, useState } from "react";
import { Package, Search, Plus, X, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";
import { getErrorMessage, getItems } from "../utils/apiResponse";
import { hasPermission } from "../utils/auth";

const emptyForm = {
  sku: "",
  nombre: "",
  categoria: "",
  precioVenta: "0",
  stock: "0",
  stockMinimo: "0",
  activo: true,
};

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const canCreate = hasPermission("products:create");
  const canUpdate = hasPermission("products:update");
  const canDelete = hasPermission("products:delete");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", { params: { limit: 100 } });
      setProducts(getItems(response));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los productos."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    `${product.sku || ""} ${product.nombre || ""} ${product.categoria || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setForm({
      sku: product.sku || "",
      nombre: product.nombre || "",
      categoria: product.categoria || "",
      precioVenta: String(product.precioVenta ?? 0),
      stock: String(product.stock ?? 0),
      stockMinimo: String(product.stockMinimo ?? 0),
      activo: product.activo ?? true,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => ({
    sku: form.sku.trim(),
    nombre: form.nombre.trim(),
    categoria: form.categoria.trim(),
    unidad: "pieza",
    descripcion: "",
    marca: "",
    modelo: "",
    precioCompra: 0,
    precioVenta: Number(form.precioVenta || 0),
    stock: Number(form.stock || 0),
    stockMinimo: Number(form.stockMinimo || 0),
    activo: form.activo,
  });

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = buildPayload();
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar el producto."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await api.delete(`/products/${id}`);
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo eliminar el producto."));
    }
  };

  return (
    <AdminLayout title="Productos" subtitle="Gestión real de productos conectada al backend.">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">Productos registrados</h3>
            <p className="text-sm text-stone-500">{filteredProducts.length} producto(s) encontrados</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>
            {canCreate && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"
              >
                <Plus size={18} /> Nuevo producto
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-stone-500 py-8">Cargando productos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-stone-500">
                  <th className="py-3 px-3">Producto</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Precio</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-stone-50">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-900 p-2 rounded-xl"><Package size={18} /></div>
                        <div>
                          <p className="font-medium text-stone-800">{product.nombre}</p>
                          <p className="text-sm text-stone-500">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">{product.categoria || "Sin categoría"}</td>
                    <td className="py-4 px-3">${Number(product.precioVenta || 0).toFixed(2)}</td>
                    <td className="py-4 px-3">
                      <span className={Number(product.stock) <= Number(product.stockMinimo) ? "text-red-600 font-semibold" : "text-stone-700"}>
                        {product.stock}
                      </span>
                      <span className="text-stone-400"> / mín. {product.stockMinimo}</span>
                    </td>
                    <td className="py-4 px-3">
                      <span className={product.activo ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm" : "bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-sm"}>
                        {product.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && <button onClick={() => handleEditProduct(product)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Pencil size={17} /></button>}
                        {canDelete && <button onClick={() => handleDeleteProduct(product.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <p className="text-center text-stone-500 py-8">No se encontraron productos.</p>}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-stone-800">{editingProduct ? "Editar producto" : "Nuevo producto"}</h3>
                <p className="text-sm text-stone-500">Solo llena los datos básicos del producto.</p>
              </div>
              <button onClick={resetForm} className="text-stone-500 hover:text-stone-900"><X /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid gap-4 md:grid-cols-2">
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="rounded-xl border px-4 py-2" required />
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" className="rounded-xl border px-4 py-2" required />
              <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="rounded-xl border px-4 py-2" />
              <input type="number" min="0" step="0.01" name="precioVenta" value={form.precioVenta} onChange={handleChange} placeholder="Precio venta" className="rounded-xl border px-4 py-2" />
              <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock inicial" className="rounded-xl border px-4 py-2" />
              <input type="number" min="0" name="stockMinimo" value={form.stockMinimo} onChange={handleChange} placeholder="Stock mínimo" className="rounded-xl border px-4 py-2" />

              <label className="md:col-span-2 flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                Activo
              </label>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2">Cancelar</button>
                <button disabled={saving} type="submit" className="rounded-xl bg-amber-900 text-white px-4 py-2 hover:bg-amber-800 disabled:opacity-60">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ProductsPage;
