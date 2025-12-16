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
  Zap,
  ChevronDown,
  DollarSign,
  Calendar,
  BookOpen
} from 'lucide-react';
import { getColombiaTimeString } from '../../utils/dateUtils';
import { canAccess } from '../../utils/auth';
import { useSalesStats } from '../../hooks/useSalesStats';
import { useSalesComparison } from '../../hooks/useSalesComparison';
import { getApiDocsUrl } from '../../services/api';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(getColombiaTimeString());
  const { dailySales, monthlySales, loading: salesLoading } = useSalesStats();
  const { dailyComparison, monthlyComparison, loading: comparisonLoading } = useSalesComparison();

  // Función para formatear moneda
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'Cargando...';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getColombiaTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Estado para menús desplegables
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

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

  // Sección 2: Estadísticas Unificadas (Solo Admin)
  const statsSection = [
    {
      id: 'ventas-totales',
      label: 'Totales de Ventas',
      description: 'Ventas agrupadas por día/mes',
      path: '/estadisticas-avanzadas/ventas-totales',
      icon: TrendingUp,
      color: 'purple',
      roles: ['admin']
    },
    {
      id: 'documentos-venta',
      label: 'Documentos de Venta',
      description: 'Facturas detalladas',
      path: '/estadisticas-avanzadas/documentos',
      icon: FileText,
      color: 'blue',
      roles: ['admin']
    },
    {
      id: 'analytics',
      label: 'Analytics Avanzado',
      description: 'Análisis inteligente de ventas',
      path: '/estadisticas-estandar/analytics',
      icon: BarChart3,
      color: 'orange',
      roles: ['admin']
    },
    {
      id: 'productos',
      label: 'Análisis de Productos',
      description: 'Reportes desde Alegra',
      path: '/estadisticas-estandar/productos',
      icon: ShoppingBag,
      color: 'green',
      roles: ['admin']
    },
    {
      id: 'inventario',
      label: 'Análisis de Inventario',
      description: 'Estado del inventario',
      path: '/estadisticas-estandar/inventario',
      icon: Package,
      color: 'teal',
      roles: ['admin']
    }
  ];

  // Filtrar secciones según el rol del usuario
  const visibleDashboardItems = dashboardSection.filter(item => canAccess(item.roles));
  const visibleStatsItems = statsSection.filter(item => canAccess(item.roles));


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
          {/* Header Reorganizado - Estructura de 2 Filas */}
          <div className="py-3">
            {/* FILA 1: Logo + Título | Usuario + Acciones */}
            <div className="flex items-center justify-between mb-4">
              {/* Logo y Título */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Sistema de Gestión Koaj Puerto Carreño</h1>
                  <p className="text-xs text-gray-500">Panel de Control</p>
                </div>
              </div>

              {/* Info de Usuario y Acciones */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Avatar */}
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Info y Acciones */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{user?.name || user?.email || 'Administrador KOAJ'}</p>
                    {user?.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                        {user.role === 'admin' ? 'Admin' : user.role === 'sales' ? 'Ventas' : user.role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={getApiDocsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      title="Ver documentación de la API"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Docs API
                    </a>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Salir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FILA 2: Tarjetas de Ventas (Centradas) */}
            <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100">
              {/* Venta del Día */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 px-6 py-3 rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow min-w-[280px]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {salesLoading ? (
                      <p className="text-sm font-bold text-green-700 animate-pulse">Cargando...</p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-600 font-semibold mb-1">VENTA DEL DÍA</p>
                        <p className="text-xl font-bold text-green-700 mb-0.5">{formatCurrency(dailySales)}</p>
                        {!comparisonLoading && dailyComparison && (
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-500 font-medium">2024: {dailyComparison.previous.formatted}</span>
                            <span className={`font-bold flex items-center gap-1 ${
                              dailyComparison.isGrowth ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {dailyComparison.isGrowth ? '↑' : '↓'} {Math.abs(dailyComparison.percentageChange)}%
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Venta del Mes */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 px-6 py-3 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow min-w-[280px]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {salesLoading ? (
                      <p className="text-sm font-bold text-blue-700 animate-pulse">Cargando...</p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-600 font-semibold mb-1">VENTA DEL MES</p>
                        <p className="text-xl font-bold text-blue-700 mb-0.5">{formatCurrency(monthlySales)}</p>
                        {!comparisonLoading && monthlyComparison && (
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-500 font-medium">2024: {monthlyComparison.previous.formatted}</span>
                            <span className={`font-bold flex items-center gap-1 ${
                              monthlyComparison.isGrowth ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {monthlyComparison.isGrowth ? '↑' : '↓'} {Math.abs(monthlyComparison.percentageChange)}%
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación Principal - Todo en una línea horizontal */}
          <nav className="py-3">
            <div className="flex items-center gap-2 pb-2">
              {/* Botones principales (Cierre de Caja, Ventas Mensuales para Sales) */}
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

              {/* Dropdown: Estadísticas (Solo Admin) */}
              {canAccess(['admin']) && visibleStatsItems.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => toggleMenu('stats')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${expandedMenu === 'stats'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                      }`}
                  >
                    <BarChart3 className={`w-4 h-4 ${expandedMenu === 'stats' ? 'text-white' : ''}`} />
                    <span className="text-sm">📊 Estadísticas</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'stats' ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedMenu === 'stats' && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] min-w-[280px]">
                      <div className="py-2">
                        {visibleStatsItems.map((item) => {
                          const Icon = item.icon;
                          const colorClasses = {
                            purple: 'text-purple-600',
                            blue: 'text-blue-600',
                            orange: 'text-orange-600',
                            green: 'text-green-600',
                            teal: 'text-teal-600'
                          };

                          return (
                            <button
                              key={item.id}
                              onClick={() => { handleNavigation(item.path); toggleMenu('stats'); }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                              <Icon className={`w-5 h-5 ${colorClasses[item.color] || 'text-gray-600'}`} />
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
