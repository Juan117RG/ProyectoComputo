import { useState } from "react";
import {
  UserCog,
  Search,
  Plus,
  Mail,
  Shield,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";

const initialUsers = [
  {
    id: 1,
    name: "Administrador",
    username: "proyecto",
    email: "admin@cafecampus.com",
    role: "Administrador",
    status: "Activo",
  },
  {
    id: 2,
    name: "Encargado de caja",
    username: "caja01",
    email: "caja@cafecampus.com",
    role: "Cajero",
    status: "Activo",
  },
  {
    id: 3,
    name: "Encargado de inventario",
    username: "inventario01",
    email: "inventario@cafecampus.com",
    role: "Almacén",
    status: "Activo",
  },
];

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "Cajero",
  });

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.username} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      name: "",
      username: "",
      email: "",
      role: "Cajero",
    });

    setEditingUser(null);
    setShowModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setForm({
      name: "",
      username: "",
      email: "",
      role: "Cajero",
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      role: user.role || "Cajero",
    });

    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmDelete) return;

    setUsers(users.filter((user) => user.id !== id));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        status: editingUser.status || "Activo",
      };

      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? updatedUser : user
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        status: "Activo",
      };

      setUsers([newUser, ...users]);
    }

    resetForm();
  };

  return (
    <AdminLayout title="Usuarios" subtitle="Gestión de usuarios del sistema.">
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-stone-800">
              Usuarios registrados
            </h3>
            <p className="text-sm text-stone-500">
              {filteredUsers.length} usuario(s) encontrados
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
                placeholder="Buscar usuario..."
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
              Nuevo usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-stone-500">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Correo</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-stone-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 p-2 rounded-xl">
                        <UserCog size={18} />
                      </div>

                      <div>
                        <p className="font-medium text-stone-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-stone-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Shield size={16} className="text-amber-900" />
                      {user.role}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Editar usuario"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {editingUser ? "Editar usuario" : "Nuevo usuario"}
                </h3>
                <p className="text-sm text-stone-500">
                  {editingUser
                    ? "Modifica la información del usuario seleccionado."
                    : "Registra un usuario para acceder al sistema."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nombre completo
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Usuario
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Ej. cajero02"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="usuario@correo.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Rol
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-800/30"
                >
                  <option>Administrador</option>
                  <option>Cajero</option>
                  <option>Almacén</option>
                </select>
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
                  {editingUser ? "Actualizar usuario" : "Guardar usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default UsersPage; 