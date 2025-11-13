import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Validar credenciales (por ahora hardcoded)
    const validEmail = 'ventaspuertocarreno@gmail.com';
    const validPassword = 'VentasCarreno2025.*';

    if (email === validEmail && password === validPassword) {
      // Generar un token simple (en producción esto vendría del backend)
      const generatedToken = btoa(`${email}:${Date.now()}`);
      const userData = {
        email: email,
        name: 'Usuario Ventas',
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('authToken', generatedToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      setToken(generatedToken);
      setUser(userData);

      return { success: true };
    } else {
      return { success: false, error: 'Credenciales incorrectas' };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
