import { authenticatedFetch } from './api';
import logger from '../utils/logger';

/**
 * Servicio para interactuar con los endpoints de Analytics
 * Timeout configurado a 50 segundos para consultas largas
 */

// Timeout de 50 segundos para Analytics (las consultas pueden tardar)
const ANALYTICS_TIMEOUT = 50000;

/**
 * Obtiene el análisis de horas pico de ventas
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica (YYYY-MM-DD)
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @returns {Promise<Object>} - Datos de horas pico
 */
export const getPeakHours = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/peak-hours${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo horas pico:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener horas pico');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getPeakHours:', error);
    throw error;
  }
};

/**
 * Obtiene el top de clientes
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @param {number} params.limit - Número de clientes a retornar (default: 10)
 * @returns {Promise<Object>} - Datos de top clientes
 */
export const getTopCustomers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/top-customers${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo top clientes:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener top clientes');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getTopCustomers:', error);
    throw error;
  }
};

/**
 * Obtiene el top de vendedoras
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @param {number} params.limit - Número de vendedoras a retornar (default: 10)
 * @returns {Promise<Object>} - Datos de top vendedoras
 */
export const getTopSellers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/top-sellers${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo top vendedoras:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener top vendedoras');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getTopSellers:', error);
    throw error;
  }
};

/**
 * Obtiene el análisis de retención de clientes (RFM)
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @returns {Promise<Object>} - Datos de retención
 */
export const getCustomerRetention = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/customer-retention${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo retención de clientes:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener retención de clientes');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getCustomerRetention:', error);
    throw error;
  }
};

/**
 * Obtiene las tendencias de ventas
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @returns {Promise<Object>} - Datos de tendencias
 */
export const getSalesTrends = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/sales-trends${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo tendencias de ventas:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener tendencias de ventas');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getSalesTrends:', error);
    throw error;
  }
};

/**
 * Obtiene el análisis de cross-selling (productos que se venden juntos)
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @param {number} params.min_support - Mínimo de veces que deben aparecer juntos
 * @returns {Promise<Object>} - Datos de cross-selling
 */
export const getCrossSelling = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.min_support) queryParams.append('min_support', params.min_support.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/cross-selling${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo cross-selling:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener cross-selling');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getCrossSelling:', error);
    throw error;
  }
};

/**
 * Obtiene el dashboard completo con todos los análisis
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.date - Fecha específica
 * @param {string} params.start_date - Fecha de inicio
 * @param {string} params.end_date - Fecha de fin
 * @returns {Promise<Object>} - Todos los datos de analytics
 */
export const getAnalyticsDashboard = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const queryString = queryParams.toString();
    const endpoint = `/api/analytics/dashboard${queryString ? `?${queryString}` : ''}`;

    logger.info('Obteniendo dashboard completo:', params);
    const response = await authenticatedFetch(endpoint, { method: 'GET' }, ANALYTICS_TIMEOUT);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener dashboard');
    }

    return await response.json();
  } catch (error) {
    logger.error('Error en getAnalyticsDashboard:', error);
    throw error;
  }
};

export default {
  getPeakHours,
  getTopCustomers,
  getTopSellers,
  getCustomerRetention,
  getSalesTrends,
  getCrossSelling,
  getAnalyticsDashboard,
};
