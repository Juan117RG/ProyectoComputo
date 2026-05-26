import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <section className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-amber-900 mb-3">404</h1>

        <h2 className="text-xl font-bold text-stone-800 mb-2">
          Página no encontrada
        </h2>

        <p className="text-stone-500 mb-6">
          La ruta que intentaste abrir no existe dentro del sistema.
        </p>

        <Link
          to="/dashboard"
          className="inline-block bg-amber-900 text-white px-5 py-2 rounded-lg hover:bg-amber-800"
        >
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage; 