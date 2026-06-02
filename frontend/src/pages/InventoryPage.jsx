import { useEffect, useState } from "react";
import { Boxes, Search, SlidersHorizontal, X } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";
import { getItems, getErrorMessage, formatDate } from "../utils/apiResponse";
import { hasPermission } from "../utils/auth";

const emptyForm = { tipo: "ENTRADA", cantidad: "1", motivo: "Ajuste manual", referencia: "" };

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const canUpdate = hasPermission("inventory:update");

  const loadInventory = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [inventoryResponse, movementsResponse] = await Promise.all([
        api.get("/inventory", { params: { limit: 100 } }),
        api.get("/inventory/movements", { params: { limit: 10 } }),
      ]);
      setItems(getItems(inventoryResponse));
      setMovements(getItems(movementsResponse));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el inventario."));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
    const interval = setInterval(() => loadInventory(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = items.filter((item) =>
    `${item.sku || ""} ${item.nombre || ""} ${item.categoria || ""} ${item.marca || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdjustModal = (item) => { setSelectedItem(item); setForm(emptyForm); };
  const closeAdjustModal = () => { setSelectedItem(null); setForm(emptyForm); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdjustInventory = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const payload = {
        tipo: form.tipo,
        cantidad: Number(form.cantidad || 0),
        motivo: form.motivo,
        referencia: form.referencia,
      };
      await api.patch(`/inventory/${selectedItem.productId || selectedItem.id}/adjust`, payload);
      await loadInventory();
      closeAdjustModal();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo ajustar el inventario."));
    }
  };

  return (
    <AdminLayout title="Inventario" subtitle="Consulta productos y realiza ajustes reales de inventario.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div><h3 className="text-xl font-bold text-stone-800">Inventario actual</h3><p className="text-sm text-stone-500">{filteredItems.length} producto(s) encontrados</p></div>
          <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><input type="text" placeholder="Buscar en inventario..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30" /></div>
        </div>
        {loading ? <p className="text-center text-stone-500 py-8">Cargando inventario...</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b text-stone-500"><th className="py-3 px-3">Producto</th><th className="py-3 px-3">Categoría</th><th className="py-3 px-3">Stock</th><th className="py-3 px-3">Estado</th><th className="py-3 px-3 text-right">Acción</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b hover:bg-stone-50"><td className="py-4 px-3"><div className="flex items-center gap-3"><div className="bg-amber-100 text-amber-900 p-2 rounded-xl"><Boxes size={18} /></div><div><p className="font-medium text-stone-800">{item.nombre}</p><p className="text-sm text-stone-500">SKU: {item.sku}</p></div></div></td><td className="py-4 px-3">{item.categoria || "Sin categoría"}</td><td className="py-4 px-3"><span className={item.lowStock ? "text-red-600 font-semibold" : "text-stone-700"}>{item.stock}</span> / mín. {item.stockMinimo}</td><td className="py-4 px-3"><span className={item.lowStock ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm" : "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"}>{item.lowStock ? "Stock bajo" : "Correcto"}</span></td><td className="py-4 px-3 text-right"><button onClick={() => openAdjustModal(item)} className="inline-flex items-center gap-2 rounded-xl bg-amber-900 px-3 py-2 text-white hover:bg-amber-800"><SlidersHorizontal size={16} />Ajustar</button></td></tr>)}</tbody></table>{filteredItems.length === 0 && <p className="text-center text-stone-500 py-8">No se encontraron productos.</p>}</div>}
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-bold text-stone-800 mb-4">Últimos movimientos</h3>
        <div className="space-y-3">{movements.length === 0 && <p className="text-stone-500">No hay movimientos registrados.</p>}{movements.map((movement) => <article key={movement.id} className="rounded-xl border border-stone-200 p-4"><p className="font-semibold text-stone-800">{movement.tipo} · {movement.productNombre}</p><p className="text-sm text-stone-500">Cantidad: {movement.cantidad} · Stock {movement.stockAnterior} → {movement.stockNuevo} · {formatDate(movement.createdAt)}</p><p className="text-sm text-stone-500">Motivo: {movement.motivo}</p></article>)}</div>
      </section>

      {selectedItem && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"><div className="flex items-center justify-between mb-5"><h3 className="text-xl font-bold text-stone-800">Ajustar inventario</h3><button onClick={closeAdjustModal} className="text-stone-500 hover:text-stone-900"><X /></button></div><p className="mb-4 text-sm text-stone-600">Producto: <b>{selectedItem.nombre}</b> · Stock actual: <b>{selectedItem.stock}</b></p><form onSubmit={handleAdjustInventory} className="space-y-4"><select name="tipo" value={form.tipo} onChange={handleChange} className="w-full rounded-xl border px-4 py-2"><option value="ENTRADA">Entrada</option><option value="SALIDA">Salida</option><option value="AJUSTE">Ajuste exacto</option></select><input type="number" min="1" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" className="w-full rounded-xl border px-4 py-2" required /><input name="motivo" value={form.motivo} onChange={handleChange} placeholder="Motivo" className="w-full rounded-xl border px-4 py-2" required /><input name="referencia" value={form.referencia} onChange={handleChange} placeholder="Referencia opcional" className="w-full rounded-xl border px-4 py-2" /><div className="flex justify-end gap-3"><button type="button" onClick={closeAdjustModal} className="rounded-xl border px-4 py-2">Cancelar</button><button type="submit" className="rounded-xl bg-amber-900 text-white px-4 py-2 hover:bg-amber-800">Guardar ajuste</button></div></form></div></div>}
    </AdminLayout>
  );
}

export default InventoryPage;
