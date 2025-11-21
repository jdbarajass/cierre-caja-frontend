import { createContext, useContext, useState, useEffect } from 'react';
import { secureGetItem, secureSetItem, secureRemoveItem } from '../utils/secureStorage';
import logger from '../utils/logger';

const AuthContext = createContext(null);

// Constantes de seguridad
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedToken = secureGetItem('authToken');
    const savedUser = secureGetItem('authUser');

    if (savedToken && savedUser) {
      try {
        const userData = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;

        // Verificar si la sesión ha expirado
        if (userData.loginTime) {
          const loginTime = new Date(userData.loginTime).getTime();
          const now = Date.now();

          if (now - loginTime > SESSION_TIMEOUT) {
            logger.warn('Sesión expirada');
            logout();
          } else {
            setToken(savedToken);
            setUser(userData);
          }
        }
      } catch (error) {
        logger.error('Error al restaurar sesión:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Valida el formato de email
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Verifica si el usuario está bloqueado por intentos fallidos
   */
  const isLockedOut = () => {
    if (!lockoutUntil) return false;
    const now = Date.now();
    if (now < lockoutUntil) {
      return true;
    } else {
      setLockoutUntil(null);
      setLoginAttempts(0);
      return false;
    }
  };

  const login = (email, password) => {
    // Verificar bloqueo por intentos fallidos
    if (isLockedOut()) {
      const timeLeft = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
      return {
        success: false,
        error: `Cuenta bloqueada. Intenta nuevamente en ${timeLeft} minutos.`
      };
    }

    // Validaciones básicas
    if (!email || !password) {
      return { success: false, error: 'Email y contraseña son requeridos' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'Formato de email inválido' };
    }

    if (password.length < 8) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // NOTA: Credenciales hardcoded - DEBE ser reemplazado por autenticación real en backend
    // TODO: Implementar autenticación con backend
    const validEmail = 'ventaspuertocarreno@gmail.com';
    const validPassword = 'VentasCarreno2025.*';

    if (email === validEmail && password === validPassword) {
      // Resetear intentos fallidos
      setLoginAttempts(0);
      setLockoutUntil(null);

      // Generar un token simple (en producción esto vendría del backend)
      // ADVERTENCIA: Este método NO es seguro para producción
      const generatedToken = btoa(`${email}:${Date.now()}`);
      const userData = {
        email: email,
        name: 'Usuario Ventas',
        loginTime: new Date().toISOString()
      };

      // Guardar en almacenamiento seguro
      secureSetItem('authToken', generatedToken);
      secureSetItem('authUser', userData);

      setToken(generatedToken);
      setUser(userData);

      logger.info('Login exitoso para:', email);
      return { success: true };
    } else {
      // Incrementar intentos fallidos
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockout = Date.now() + LOCKOUT_TIME;
        setLockoutUntil(lockout);
        logger.warn(`Cuenta bloqueada después de ${MAX_LOGIN_ATTEMPTS} intentos fallidos`);
        return {
          success: false,
          error: `Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.`
        };
      }

      logger.warn(`Intento de login fallido (${newAttempts}/${MAX_LOGIN_ATTEMPTS})`);
      return {
        success: false,
        error: `Credenciales incorrectas (${newAttempts}/${MAX_LOGIN_ATTEMPTS} intentos)`
      };
    }
  };

  const logout = () => {
    // Limpiar almacenamiento seguro
    secureRemoveItem('authToken');
    secureRemoveItem('authUser');

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
