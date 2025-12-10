/**
 * Logger configurable que se desactiva en producción
 * Proporciona métodos para logging con niveles (log, warn, error, info)
 */

const isDevelopment = import.meta.env.DEV;

class Logger {
  /**
   * Log normal - solo en desarrollo
   */
  log(...args) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Warning - solo en desarrollo
   */
  warn(...args) {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  /**
   * Error - siempre se muestra (incluso en producción)
   */
  error(...args) {
    console.error(...args);
  }

  /**
   * Info - solo en desarrollo
   */
  info(...args) {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  /**
   * Debug - solo en desarrollo
   */
  debug(...args) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }

  /**
   * Grupo de logs - solo en desarrollo
   */
  group(label) {
    if (isDevelopment) {
      console.group(label);
    }
  }

  /**
   * Finaliza grupo de logs
   */
  groupEnd() {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Tabla - solo en desarrollo
   */
  table(data) {
    if (isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Timer - solo en desarrollo
   */
  time(label) {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * Finaliza timer
   */
  timeEnd(label) {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Exportar instancia única (Singleton)
const logger = new Logger();

export default logger;
