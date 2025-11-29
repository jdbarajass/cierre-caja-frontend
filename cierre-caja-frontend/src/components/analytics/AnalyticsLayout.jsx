import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Clock, Users, Trophy, RefreshCw, TrendingUp, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnalyticsDashboard from './AnalyticsDashboard';
import PeakHours from './PeakHours';
import TopCustomers from './TopCustomers';
import TopSellers from './TopSellers';
import CustomerRetention from './CustomerRetention';
import SalesTrends from './SalesTrends';
import CrossSelling from './CrossSelling';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AnalyticsLayout = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Establecer título de la página según la sección activa
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Analytics - Dashboard Completo';
      case 'peak-hours':
        return 'Analytics - Horas Pico';
      case 'top-customers':
        return 'Analytics - Top Clientes';
      case 'top-sellers':
        return 'Analytics - Top Vendedoras';
      case 'retention':
        return 'Analytics - Retención de Clientes';
      case 'trends':
        return 'Analytics - Tendencias de Ventas';
      case 'cross-selling':
        return 'Analytics - Cross-Selling';
      default:
        return 'Analytics Avanzado';
    }
  };

  useDocumentTitle(getSectionTitle());

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard Completo', icon: LayoutDashboard, description: 'Vista unificada de KPIs' },
    { id: 'peak-hours', label: 'Horas Pico', icon: Clock, description: 'Mejores horas de venta' },
    { id: 'top-customers', label: 'Top Clientes', icon: Users, description: 'Clientes que más compran' },
    { id: 'top-sellers', label: 'Top Vendedoras', icon: Trophy, description: 'Vendedoras destacadas' },
    { id: 'retention', label: 'Retención', icon: RefreshCw, description: 'Análisis RFM' },
    { id: 'trends', label: 'Tendencias', icon: TrendingUp, description: 'Patrones de venta' },
    { id: 'cross-selling', label: 'Cross-Selling', icon: ShoppingBag, description: 'Productos relacionados' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'peak-hours':
        return <PeakHours />;
      case 'top-customers':
        return <TopCustomers />;
      case 'top-sellers':
        return <TopSellers />;
      case 'retention':
        return <CustomerRetention />;
      case 'trends':
        return <SalesTrends />;
      case 'cross-selling':
        return <CrossSelling />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Principal */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Volver al Dashboard"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                  Analytics Avanzado
                </h1>
                <p className="text-sm text-gray-600">Análisis inteligente de ventas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Secciones */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {section.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido de la Sección Activa */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderSection()}
      </div>
    </div>
  );
};

export default AnalyticsLayout;
