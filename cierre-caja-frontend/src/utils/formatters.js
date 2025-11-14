/**
 * Formatea un número como moneda colombiana
 * @param {number} value - Valor a formatear
 * @returns {string} - Valor formateado como $X,XXX,XXX
 */
export const formatCurrency = (value) => {
  return `$${parseInt(value || 0).toLocaleString('es-CO')}`;
};

/**
 * Parsea un valor a entero, retornando 0 si es inválido
 * @param {string|number} value - Valor a parsear
 * @returns {number} - Valor parseado o 0
 */
export const parseAmount = (value) => {
  return parseInt(value || 0);
};

/**
 * Limpia un string dejando solo números
 * @param {string} value - String a limpiar
 * @returns {string} - String solo con números
 */
export const cleanNumericInput = (value) => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * Formatea una fecha para el input date
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Valida que una fecha no sea futura
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si la fecha es válida
 */
export const isValidDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return selectedDate <= today;
};
