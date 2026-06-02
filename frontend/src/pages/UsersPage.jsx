import { useEffect, useState } from "react";
import { UserCog, Search, Plus, Mail, Shield, X, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../api/api";
import { getItems, getErrorMessage } from "../utils/apiResponse";
import { hasPermission } from "../utils/auth";

const emptyForm = { nombre: "", apellido: "", email: "", usuario: "", password: "", role: "", roleId: "", activo: true };

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const canCreate = hasPermission("users:create");
  const canUpdate = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        api.get("/users", { params: { limit: 100 } }),
        api.get("/roles", { params: { limit: 100 } }).catch(() => ({ data: { items: [] } })),
      ]);
      setUsers(getItems(usersResponse));
      setRoles(getItems(rolesResponse));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los usuarios."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter((user) =>
    `${user.nombre || ""} ${user.apellido || ""} ${user.usuario || ""} ${user.email || ""} ${user.role || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm(emptyForm); setEditingUser(null); setShowModal(false); };
  const openCreate = () => { setEditingUser(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (user) => { setEditingUser(user); setForm({ ...emptyForm, ...user, password: "" }); setShowModal(true); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => {
    const selectedRole = roles.find((role) => role.id === form.roleId);
    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      usuario: form.usuario,
      role: selectedRole?.nombre || form.role || null,
      roleId: form.roleId || null,
      activo: form.activo,
    };
    if (form.password) payload.password = form.password;
    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      if (!editingUser && !payload.password) {
        setError("La contraseña es obligatoria para crear un usuario.");
        return;
      }
      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, payload);
      } else {
        await api.post("/users", payload);
      }
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar el usuario."));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo eliminar el usuario."));
    }
  };

  return (
    <AdminLayout title="Usuarios" subtitle="Gestión real de usuarios del sistema.">
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5"><div><h3 className="text-xl font-bold text-stone-800">Usuarios registrados</h3><p className="text-sm text-stone-500">{filteredUsers.length} usuario(s) encontrados</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" /><input type="text" placeholder="Buscar usuario..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-72 rounded-xl border border-stone-300 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30" /></div>{canCreate && <button onClick={openCreate} className="flex items-center justify-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800"><Plus size={18} />Nuevo usuario</button>}</div></div>
        {loading ? <p className="text-center text-stone-500 py-8">Cargando usuarios...</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b text-stone-500"><th className="py-3 px-3">Usuario</th><th className="py-3 px-3">Correo</th><th className="py-3 px-3">Rol</th><th className="py-3 px-3">Estado</th><th className="py-3 px-3 text-right">Acciones</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id} className="border-b hover:bg-stone-50"><td className="py-4 px-3"><div className="flex items-center gap-3"><div className="bg-amber-100 text-amber-900 p-2 rounded-xl"><UserCog size={18} /></div><div><p className="font-medium text-stone-800">{user.nombre} {user.apellido}</p><p className="text-sm text-stone-500">@{user.usuario}</p></div></div></td><td className="py-4 px-3"><div className="flex items-center gap-2 text-stone-600"><Mail size={16} />{user.email}</div></td><td className="py-4 px-3"><div className="flex items-center gap-2 text-stone-700"><Shield size={16} className="text-amber-900" />{user.role || "Sin rol"}</div></td><td className="py-4 px-3"><span className={user.activo ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm" : "bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-sm"}>{user.activo ? "Activo" : "Inactivo"}</span></td><td className="py-4 px-3"><div className="flex justify-end gap-2">{canUpdate && <button onClick={() => openEdit(user)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Pencil size={17} /></button>}{canDelete && <button onClick={() => handleDelete(user.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}</div></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <p className="text-center text-stone-500 py-8">No se encontraron usuarios.</p>}</div>}
      </section>
      {showModal && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"><div className="flex items-center justify-between mb-5"><h3 className="text-xl font-bold text-stone-800">{editingUser ? "Editar usuario" : "Nuevo usuario"}</h3><button onClick={resetForm} className="text-stone-500 hover:text-stone-900"><X /></button></div><form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2"><input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="rounded-xl border px-4 py-2" required /><input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="rounded-xl border px-4 py-2" required /><input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="rounded-xl border px-4 py-2" required /><input name="usuario" value={form.usuario} onChange={handleChange} placeholder="Usuario" className="rounded-xl border px-4 py-2" required /><input type="password" name="password" value={form.password} onChange={handleChange} placeholder={editingUser ? "Nueva contraseña opcional" : "Contraseña"} className="rounded-xl border px-4 py-2" required={!editingUser} /><select name="roleId" value={form.roleId || ""} onChange={handleChange} className="rounded-xl border px-4 py-2"><option value="">Sin rol</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.nombre}</option>)}</select><div className="md:col-span-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-stone-700"><p className="font-semibold text-amber-900 mb-1">Permisos que recibirá este empleado:</p><p>{(roles.find((role) => role.id === form.roleId)?.permissions || []).join(", ") || "Sin permisos asignados"}</p></div><label className="md:col-span-2 flex items-center gap-2"><input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo</label><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2">Cancelar</button><button type="submit" className="rounded-xl bg-amber-900 text-white px-4 py-2 hover:bg-amber-800">Guardar</button></div></form></div></div>}
    </AdminLayout>
  );
}

export default UsersPage;
