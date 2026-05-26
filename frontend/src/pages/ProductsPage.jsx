import { useEffect, useState } from "react";
import { Package, Plus, Search, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";

const sampleProducts = [
  {
    id: 1,
    name: "Café americano",
    category: "Bebidas calientes",
    price: 28,
    stock: 35,
    status: "Activo",
  },
  {
    id: 2,
    name: "Capuchino",
    category: "Bebidas calientes",
    price: 38,
    stock: 22,
    status: "Activo",
  },
  {
    id: 3,
    name: "Croissant",
    category: "Panadería",
    price: 32,
    stock: 15,
    status: "Activo",
  },
  {
    id: 4,
    name: "Sandwich universitario",
    category: "Alimentos",
    price: 45,
    stock: 18,
    status: "Activo",
  },
];

function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await api.get("/products");

      const data = response.data?.data || response.data;

      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (error) {
      console.log("Usando productos de ejemplo porque el backend no respondió.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: "Activo",
    };

    try {
      const response = await api.post("/products", newProduct);
      const savedProduct = response.data?.data || response.data || newProduct;

      setProducts([savedProduct, ...products]);
    } catch (error) {
      setProducts([newProduct, ...products]);
    }

    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
    });
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este producto?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.log("Producto eliminado solo en la vista local.");
    }

    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <AdminLayout
      title="Productos"
      subtitle="Gestión del catálogo de productos de la cafetería."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-stone-800">
                Productos registrados
              </h3>
              <p className="text-sm text-stone-500">
                {loading
                  ? "Cargando productos..."
                  : `${filteredProducts.length} producto(s) encontrados`}
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>
          </div>

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
                        <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                          <Package size={18} />
                        </div>
                        <span className="font-medium text-stone-800">
                          {product.name || product.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      {product.category || product.categoria || "Sin categoría"}
                    </td>

                    <td className="py-4 px-3 font-semibold text-amber-900">
                      ${product.price || product.precio || 0}
                    </td>

                    <td className="py-4 px-3">
                      {product.stock || product.existencia || 0}
                    </td>

                    <td className="py-4 px-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {product.status || "Activo"}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-stone-500">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-100 text-amber-900 p-3 rounded-xl">
              <Plus size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-800">
                Nuevo producto
              </h3>
              <p className="text-sm text-stone-500">
                Agrega productos al catálogo.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Nombre
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ej. Café latte"
                className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Categoría
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Ej. Bebidas"
                className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-3 rounded-xl font-semibold hover:bg-amber-800"
            >
              Guardar producto
            </button>
          </form>
        </aside>
      </div>
    </AdminLayout>
  );
}

export default ProductsPage; 