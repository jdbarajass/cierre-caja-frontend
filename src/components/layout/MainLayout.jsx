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
  LogOut
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

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Cierre de Caja',
      path: '/dashboard',
      icon: Home,
      color: 'blue',
      roles: ['admin', 'sales'] // Accesible para admin y sales
    },
    {
      id: 'monthly-sales',
      label: 'Ventas Mensuales',
      path: '/monthly-sales',
      icon: ShoppingBag,
      color: 'purple',
      roles: ['admin', 'sales'] // Accesible para admin y sales
    },
    {
      id: 'productos',
      label: 'Análisis de Productos',
      path: '/productos',
      icon: Package,
      color: 'green',
      roles: ['admin'] // Solo admin
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      path: '/analytics',
      icon: TrendingUp,
      color: 'orange',
      roles: ['admin'] // Solo admin
    },
    {
      id: 'inventario',
      label: 'Análisis de Inventario',
      path: '/inventario',
      icon: BarChart3,
      color: 'teal',
      roles: ['admin'] // Solo admin
    }
  ];

  // Filtrar elementos de navegación según el rol del usuario
  const visibleNavigationItems = navigationItems.filter(item =>
    canAccess(item.roles)
  );

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

          {/* Navegación Principal */}
          <nav className="py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {visibleNavigationItems.map((item) => {
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
