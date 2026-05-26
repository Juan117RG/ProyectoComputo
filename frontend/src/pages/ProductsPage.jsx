import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ImagePlus,
} from "lucide-react";
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
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Capuchino",
    category: "Bebidas calientes",
    price: 38,
    stock: 22,
    status: "Activo",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Croissant",
    category: "Panadería",
    price: 32,
    stock: 15,
    status: "Activo",
    image:
      "https://images.unsplash.com/photo-1620146344904-097a0002d797?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Sandwich universitario",
    category: "Alimentos",
    price: 45,
    stock: 18,
    status: "Activo",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80",
  },
];

function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const filteredProducts = products.filter((product) =>
    (product.name || product.nombre || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      try {
        const response = await api.get("/products");
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.log("Usando productos de ejemplo.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    });

    setEditingProduct(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setForm({
      ...form,
      image: imageUrl,
    });
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || product.nombre || "",
      category: product.category || product.categoria || "",
      price: product.price || product.precio || "",
      stock: product.stock || product.existencia || "",
      image: product.image || product.imagen || "",
    });

    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image,
        status: editingProduct.status || "Activo",
      };

      try {
        await api.put(`/products/${editingProduct.id}`, updatedProduct);
      } catch (error) {
        console.log("Producto actualizado solo en la vista local.");
      }

      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? updatedProduct : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: "Activo",
        image: form.image,
      };

      try {
        const response = await api.post("/products", newProduct);
        const savedProduct = response.data?.data || response.data || newProduct;

        setProducts([savedProduct, ...products]);
      } catch (error) {
        setProducts([newProduct, ...products]);
      }
    }

    resetForm();
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"
            >
              <Plus size={18} />
              Nuevo producto
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="h-40 bg-stone-100">
                {product.image || product.imagen ? (
                  <img
                    src={product.image || product.imagen}
                    alt={product.name || product.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-400">
                    <Package size={40} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-stone-800">
                      {product.name || product.nombre}
                    </h4>
                    <p className="text-sm text-stone-500">
                      {product.category || product.categoria || "Sin categoría"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {product.status || "Activo"}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-stone-50 p-3">
                    <p className="text-xs text-stone-500">Precio</p>
                    <p className="font-bold text-amber-900">
                      ${product.price || product.precio || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-stone-50 p-3">
                    <p className="text-xs text-stone-500">Stock</p>
                    <p className="font-bold text-stone-800">
                      {product.stock || product.existencia || 0}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="Editar producto"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500">
              No se encontraron productos.
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {editingProduct ? "Editar producto" : "Nuevo producto"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingProduct
                    ? "Modifica la información del producto seleccionado."
                    : "Agrega un producto al catálogo."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Foto del producto
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 text-center hover:bg-stone-100">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Vista previa"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus size={34} className="mb-2 text-amber-900" />
                      <span className="text-sm font-medium text-stone-700">
                        Seleccionar imagen
                      </span>
                      <span className="text-xs text-stone-500">
                        JPG, PNG o WEBP
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nombre del producto
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
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Categoría
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Bebidas calientes"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Ej. 35"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Ej. 20"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800"
                >
                  {editingProduct ? "Actualizar producto" : "Guardar producto"}
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