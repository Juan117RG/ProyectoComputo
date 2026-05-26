import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import fondoCafe from "../assets/UC8A1834.jpg";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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
      const response = await api.post("/auth/login", form);

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      const user =
        response.data?.user ||
        response.data?.data?.user || {
          name: form.username,
          role: "Administrador",
        };

      if (!token) {
        throw new Error("No se recibió token del servidor");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
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
        backgroundImage: `linear-gradient(rgba(20, 15, 10, 0.35), rgba(20, 15, 10, 0.35)), url(${fondoCafe})`,
      }}
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-10 backdrop-blur-[1px]">
        <section className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a94700] text-2xl text-white">
              ☕
            </div>

            <h1 className="text-3xl font-bold text-[#2b1a10]">
              Café Campus
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Panel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Usuario
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a94700] focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#a94700] focus:ring-2 focus:ring-orange-200"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#a94700] px-4 py-3 font-semibold text-white transition hover:bg-[#8f3d00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Entrar al sistema"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50/80 px-4 py-3 text-sm text-gray-700">
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