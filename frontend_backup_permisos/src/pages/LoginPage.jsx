import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Coffee } from "lucide-react";
import api from "../api/api";
import fondoCafe from "../assets/UC8A1834.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        usuario: form.usuario,
        password: form.password,
      });

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      const user =
        response.data?.user ||
        response.data?.usuario ||
        response.data?.data?.user ||
        response.data?.data?.usuario || {
          name: form.usuario || "Administrador",
          role: "Administrador",
        };

      if (!token) {
        throw new Error("No se recibió token del servidor");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "No fue posible iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 15, 10, 0.42), rgba(20, 15, 10, 0.42)), url(${fondoCafe})`,
      }}
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900 text-white">
              <Coffee size={30} />
            </div>

            <h1 className="text-3xl font-bold text-stone-900">
              Café Campus
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Panel administrativo
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Usuario
              </label>

              <input
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-900 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Entrar al sistema"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-stone-700">
            <p className="font-semibold">Credenciales de prueba:</p>
            <p>Usuario: proyecto</p>
            <p>Contraseña: Hello2U"</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage; 