import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Package,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  Clock,
  User,
  LogOut,
  FileText,
  Zap
} from 'lucide-react';
import { getColombiaTimeString } from '../../utils/dateUtils';
import { canAccess } from '../../utils/auth';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(getColombiaTimeString());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getColombiaTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Estructura de navegación con 3 secciones
  // Sección 1: Cierre de Caja (Admin y Sales)
  const dashboardSection = [
    {
      id: 'dashboard',
      label: 'Cierre de Caja',
      path: '/dashboard',
      icon: Home,
      color: 'blue',
      roles: ['admin', 'sales']
    },
    {
      id: 'monthly-sales',
      label: 'Ventas Mensuales',
      path: '/monthly-sales',
      icon: ShoppingBag,
      color: 'purple',
      roles: ['sales'] // Solo sales, admin ve esto en otra sección si es necesario
    }
  ];

  // Sección 2: Estadísticas Avanzadas (Solo Admin - APIs directas)
  const advancedStatsSection = [
    {
      id: 'inventario-detallado',
      label: 'Inventario Detallado',
      path: '/estadisticas-avanzadas/inventario',
      icon: Package,
      color: 'green',
      roles: ['admin']
    },
    {
      id: 'ventas-totales',
      label: 'Totales de Ventas',
      path: '/estadisticas-avanzadas/ventas-totales',
      icon: TrendingUp,
      color: 'purple',
      roles: ['admin']
    },
    {
      id: 'documentos-venta',
      label: 'Documentos de Venta',
      path: '/estadisticas-avanzadas/documentos',
      icon: FileText,
      color: 'blue',
      roles: ['admin']
    }
  ];

  // Sección 3: Estadísticas Estándar (Solo Admin - APIs documentadas)
  const standardStatsSection = [
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/estadisticas-estandar/analytics',
      icon: BarChart3,
      color: 'orange',
      roles: ['admin']
    },
    {
      id: 'inventario',
      label: 'Inventario',
      path: '/estadisticas-estandar/inventario',
      icon: Package,
      color: 'teal',
      roles: ['admin']
    },
    {
      id: 'productos',
      label: 'Productos',
      path: '/estadisticas-estandar/productos',
      icon: ShoppingBag,
      color: 'green',
      roles: ['admin']
    }
  ];

  // Filtrar secciones según el rol del usuario
  const visibleDashboardItems = dashboardSection.filter(item => canAccess(item.roles));
  const visibleAdvancedStatsItems = advancedStatsSection.filter(item => canAccess(item.roles));
  const visibleStandardStatsItems = standardStatsSection.filter(item => canAccess(item.roles));


  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActiveColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white',
      purple: 'bg-purple-600 text-white',
      green: 'bg-green-600 text-white',
      orange: 'bg-orange-600 text-white',
      teal: 'bg-teal-600 text-white'
    };
    return colors[color] || 'bg-gray-600 text-white';
  };

  const getHoverColor = (color) => {
    const colors = {
      blue: 'hover:bg-blue-50 hover:text-blue-700',
      purple: 'hover:bg-purple-50 hover:text-purple-700',
      green: 'hover:bg-green-50 hover:text-green-700',
      orange: 'hover:bg-orange-50 hover:text-orange-700',
      teal: 'hover:bg-teal-50 hover:text-teal-700'
    };
    return colors[color] || 'hover:bg-gray-50 hover:text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Header Principal - Navegación */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo y Título */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Gestión Koaj Puerto Carreño</h1>
                <p className="text-xs text-gray-500">Panel de Control</p>
              </div>
            </div>

            {/* Info de Usuario (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Usuario</p>
                <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email || 'Administrador'}</p>
                {user?.role && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user.role === 'admin' ? 'Administrador' : user.role === 'sales' ? 'Ventas' : user.role}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="mt-1 flex items-center gap-2 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Cerrar Sesión
                </button>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Navegación Principal - Estructura con 3 Secciones */}
          <nav className="py-3">
            <div className="space-y-4">
              {/* Sección 1: Dashboard/Cierre de Caja (Admin y Sales) */}
              {visibleDashboardItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {visibleDashboardItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${active
                              ? `${getActiveColor(item.color)} shadow-md transform scale-105`
                              : `text-gray-700 ${getHoverColor(item.color)} border border-gray-200`
                            }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección 2: Estadísticas Avanzadas (Solo Admin) */}
              {visibleAdvancedStatsItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Estadísticas Avanzadas</h3>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {visibleAdvancedStatsItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${active
                              ? `${getActiveColor(item.color)} shadow-md transform scale-105`
                              : `text-gray-700 ${getHoverColor(item.color)} border border-gray-200`
                            }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección 3: Estadísticas Estándar (Solo Admin) */}
              {visibleStandardStatsItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Estadísticas Estándar</h3>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {visibleStandardStatsItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${active
                              ? `${getActiveColor(item.color)} shadow-md transform scale-105`
                              : `text-gray-700 ${getHoverColor(item.color)} border border-gray-200`
                            }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Navbar Secundario - Reloj */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-center">
              {/* Reloj */}
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm font-semibold">{currentTime}</p>
                  <p className="text-xs text-white opacity-90">Hora de Colombia (UTC-5)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Sistema de Gestión. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Versión 2.0 | Desarrollado con ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
