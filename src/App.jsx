import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';
import MainLayout from './components/layout/MainLayout';

// Lazy loading de componentes existentes
const Dashboard = lazy(() => import('./components/Dashboard'));
const MonthlySales = lazy(() => import('./components/MonthlySales'));
const ProductosLayout = lazy(() => import('./components/productos/ProductosLayout'));
const AnalyticsLayout = lazy(() => import('./components/analytics/AnalyticsLayout'));
const InventoryLayout = lazy(() => import('./components/inventory/InventoryLayout'));

// Lazy loading de nuevos componentes de Estadísticas Avanzadas
const InventarioDetallado = lazy(() => import('./components/estadisticas-avanzadas/InventarioDetallado'));
const VentasTotales = lazy(() => import('./components/estadisticas-avanzadas/VentasTotales'));
const DocumentosVenta = lazy(() => import('./components/estadisticas-avanzadas/DocumentosVenta'));

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Rutas compartidas (Admin y Sales) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'sales']}>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monthly-sales"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'sales']}>
                    <MainLayout>
                      <MonthlySales />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* NUEVAS RUTAS - Estadísticas Avanzadas (Solo Admin) */}
              <Route
                path="/estadisticas-avanzadas/inventario"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <InventarioDetallado />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas-avanzadas/ventas-totales"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <VentasTotales />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas-avanzadas/documentos"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <DocumentosVenta />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Estadísticas Estándar - Rutas reorganizadas (Solo Admin) */}
              <Route
                path="/estadisticas-estandar/productos"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <ProductosLayout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas-estandar/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <AnalyticsLayout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas-estandar/inventario"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <InventoryLayout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirecciones de URLs antiguas a nuevas */}
              <Route path="/productos" element={<Navigate to="/estadisticas-estandar/productos" replace />} />
              <Route path="/analytics" element={<Navigate to="/estadisticas-estandar/analytics" replace />} />
              <Route path="/inventario" element={<Navigate to="/estadisticas-estandar/inventario" replace />} />

              {/* Rutas por defecto */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
