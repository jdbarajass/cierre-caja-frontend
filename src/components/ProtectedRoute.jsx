import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { canAccess } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar un loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar si el usuario tiene acceso
  if (allowedRoles && !canAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y tiene el rol correcto (o no se requiere rol específico), mostrar el contenido
  return children;
};

export default ProtectedRoute;
