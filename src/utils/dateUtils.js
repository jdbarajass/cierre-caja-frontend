/**
 * Utilidades para manejar fechas y horas en zona horaria de Colombia (America/Bogota)
 * Colombia está en UTC-5 todo el año (no usa horario de verano)
 */

const COLOMBIA_TIMEZONE = 'America/Bogota';

/**
 * Obtiene la fecha actual en zona horaria de Colombia
 * @returns {Date} Objeto Date representando la hora actual de Colombia
 */
export const getColombiaDate = () => {
  // Obtener la fecha/hora actual en zona horaria de Colombia usando toLocaleString
  const now = new Date();

  // Obtener la representación de la fecha en Colombia
  const colombiaDateString = now.toLocaleString('en-US', {
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Parsear el string a un objeto Date
  // Formato: "MM/DD/YYYY, HH:mm:ss"
  return new Date(colombiaDateString);
};

/**
 * Obtiene la fecha actual de Colombia en formato YYYY-MM-DD para inputs tipo date
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const getColombiaTodayString = () => {
  const colombiaDate = getColombiaDate();
  const year = colombiaDate.getFullYear();
  const month = String(colombiaDate.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la hora actual de Colombia en formato HH:MM:SS
 * @returns {string} Hora en formato HH:MM:SS
 */
export const getColombiaTimeString = () => {
  const colombiaDate = getColombiaDate();
  const hours = String(colombiaDate.getHours()).padStart(2, '0');
  const minutes = String(colombiaDate.getMinutes()).padStart(2, '0');
  const seconds = String(colombiaDate.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Formatea una fecha en español colombiano
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada en español
 */
export const formatColombiaDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Formatea fecha y hora en español colombiano
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatColombiaDateTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Obtiene información completa de la zona horaria de Colombia
 * @returns {object} Información de fecha, hora y zona horaria
 */
export const getColombiaDateTimeInfo = () => {
  const now = getColombiaDate();
  return {
    date: getColombiaTodayString(),
    time: getColombiaTimeString(),
    dateFormatted: formatColombiaDate(now),
    dateTimeFormatted: formatColombiaDateTime(now),
    timezone: COLOMBIA_TIMEZONE,
    utcOffset: '-05:00',
  };
};

/**
 * Obtiene un timestamp ISO 8601 con zona horaria de Colombia
 * @returns {string} Timestamp en formato ISO 8601
 */
export const getColombiaTimestamp = () => {
  // Usar la función getColombiaDate para obtener la hora correcta
  const colombiaTime = getColombiaDate();

  // Formatear en ISO 8601 con offset -05:00
  const year = colombiaTime.getFullYear();
  const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaTime.getDate()).padStart(2, '0');
  const hours = String(colombiaTime.getHours()).padStart(2, '0');
  const minutes = String(colombiaTime.getMinutes()).padStart(2, '0');
  const seconds = String(colombiaTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-05:00`;
};

/**
 * Formatea una fecha desde string YYYY-MM-DD a formato legible en español
 * Esta función evita problemas de zona horaria al parsear directamente el string
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada en español
 */
export const formatDateStringToColombiaDate = (dateString) => {
  // Parsear la fecha manualmente desde YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);

  // Crear objeto Date con la fecha en hora local (no UTC)
  // Esto evita el problema de que JavaScript interprete la fecha como UTC medianoche
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default {
  getColombiaDate,
  getColombiaTodayString,
  getColombiaTimeString,
  formatColombiaDate,
  formatColombiaDateTime,
  getColombiaDateTimeInfo,
  getColombiaTimestamp,
  formatDateStringToColombiaDate,
};
