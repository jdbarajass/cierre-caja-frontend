import { useState } from 'react';
import { authenticatedFetch } from '../services/api';
import logger from '../utils/logger';

/**
 * Hook personalizado para obtener las ventas mensuales desde el backend
 * Este endpoint requiere autenticación
 * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD (opcional)
 * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD (opcional)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMonthlySales = (startDate = null, endDate = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMonthlySales = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros opcionales
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const endpoint = `/api/monthly_sales${
        params.toString() ? '?' + params.toString() : ''
      }`;

      logger.info('Intentando obtener ventas mensuales:', endpoint);

      // Usar authenticatedFetch con timeout extendido de 3 minutos
      // Las ventas mensuales pueden tardar debido al procesamiento de muchas facturas
      const MONTHLY_SALES_TIMEOUT = 180000; // 3 minutos en milisegundos
      const response = await authenticatedFetch(
        endpoint,
        { method: 'GET' },
        MONTHLY_SALES_TIMEOUT
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || result.message || 'Error al obtener ventas mensuales');
      }

      const result = await response.json();
      logger.info('Ventas mensuales obtenidas exitosamente:', result);

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar los datos manualmente
  const refetch = () => {
    fetchMonthlySales();
  };

  return { data, loading, error, refetch };
};
