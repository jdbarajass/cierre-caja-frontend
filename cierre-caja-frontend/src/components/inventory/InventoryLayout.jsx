import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, Package, AlertTriangle, TrendingUp, PieChart, Grid, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InventoryDashboard from './InventoryDashboard';
import DepartmentAnalysis from './DepartmentAnalysis';
import StockAlerts from './StockAlerts';
import ABCAnalysis from './ABCAnalysis';
import TopProducts from './TopProducts';
import CategorySizeAnalysis from './CategorySizeAnalysis';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const InventoryLayout = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Establecer título de la página según la sección activa
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Inventario - Dashboard';
      case 'departamentos':
        return 'Inventario - Departamentos';
      case 'alertas':
        return 'Inventario - Alertas de Stock';
      case 'abc':
        return 'Inventario - Análisis ABC';
      case 'top-productos':
        return 'Inventario - Top Productos';
      case 'categorias-tallas':
        return 'Inventario - Categorías y Tallas';
      default:
        return 'Inventario';
    }
  };

  useDocumentTitle(getSectionTitle());

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Resumen ejecutivo' },
    { id: 'departamentos', label: 'Departamentos', icon: Grid, description: 'Por departamento' },
    { id: 'alertas', label: 'Alertas de Stock', icon: AlertTriangle, description: 'Stock bajo y sin stock' },
    { id: 'abc', label: 'Análisis ABC', icon: PieChart, description: 'Clasificación Pareto' },
    { id: 'top-productos', label: 'Top Productos', icon: TrendingUp, description: 'Mayor valor' },
    { id: 'categorias-tallas', label: 'Categorías y Tallas', icon: Ruler, description: 'Análisis detallado' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <InventoryDashboard />;
      case 'departamentos':
        return <DepartmentAnalysis />;
      case 'alertas':
        return <StockAlerts />;
      case 'abc':
        return <ABCAnalysis />;
      case 'top-productos':
        return <TopProducts />;
      case 'categorias-tallas':
        return <CategorySizeAnalysis />;
      default:
        return <InventoryDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                  <Package className="w-7 h-7 text-green-600" />
                  Análisis de Inventario
                </h1>
                <p className="text-sm text-gray-600">Gestión y análisis de inventario desde Alegra</p>
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
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {section.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
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

export default InventoryLayout;
