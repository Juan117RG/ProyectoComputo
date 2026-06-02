import Header from "./Header";
import Sidebar from "./Sidebar";
import fondoCafe from "../../assets/UC8A1834.jpg";

function AdminLayout({ children, title, subtitle }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url(${fondoCafe})`,
      }}
    >
      <div className="min-h-screen flex">
        <Sidebar />

        <main className="flex-1">
          <Header title={title} subtitle={subtitle} />

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 