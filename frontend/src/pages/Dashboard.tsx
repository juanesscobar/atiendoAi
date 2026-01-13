import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

interface Resumen {
  clientes: number;
  reservas_mes: number;
  ingresos_mes: number;
  conversaciones: number;
}

export default function Dashboard() {
  const { usuario, empresa } = useAuth();
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumen();
  }, []);

  async function fetchResumen() {
    try {
      const response = await axios.get('/api/dashboard/resumen');
      setResumen(response.data);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {usuario?.nombre}!</h1>
          <p className="text-gray-600">Empresa: {empresa?.nombre}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : resumen ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card: Clientes */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-medium">Clientes Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{resumen.clientes}</p>
            </div>

            {/* Card: Reservas */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm font-medium">Reservas Este Mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{resumen.reservas_mes}</p>
            </div>

            {/* Card: Ingresos */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
              <p className="text-gray-600 text-sm font-medium">Ingresos Este Mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${resumen.ingresos_mes.toFixed(2)}</p>
            </div>

            {/* Card: Conversaciones */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
              <p className="text-gray-600 text-sm font-medium">Conversaciones</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{resumen.conversaciones}</p>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/configurar-tienda" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
              ⚙️ Configurar Tienda
            </a>
            <a href="/productos" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition">
              📦 Productos
            </a>
            <a href="/servicios" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition">
              🛠️ Servicios
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
