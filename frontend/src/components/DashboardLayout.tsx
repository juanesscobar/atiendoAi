import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { logout, usuario, empresa } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ChatBot SaaS</h1>
            <p className="text-sm text-gray-600">{empresa?.nombre}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow min-h-screen">
          <nav className="p-4 space-y-2">
            <NavLink href="/dashboard" label="📊 Dashboard" />
            <NavLink href="/configurar-tienda" label="⚙️ Configurar Tienda" />
            <NavLink href="/productos" label="📦 Productos" />
            <NavLink href="/servicios" label="🛠️ Servicios" />
            <NavLink href="/horarios" label="📅 Horarios" />
            <NavLink href="/pagos" label="💳 Medios de Pago" />
            <NavLink href="/clientes" label="👥 Clientes" />
            <NavLink href="/reportes" label="📈 Reportes" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const isActive = window.location.pathname === href;
  return (
    <a
      href={href}
      className={`block px-4 py-3 rounded-lg font-medium transition ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </a>
  );
}
