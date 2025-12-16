import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../services/api';
import logger from '../utils/logger';
import { getColombiaTodayString, getColombiaDate } from '../utils/dateUtils';

/**
 * Hook para obtener estadísticas de ventas del día y del mes actual
 * Se actualiza automáticamente cada 5 minutos
 */
export const useSalesStats = () => {
  const [salesStats, setSalesStats] = useState({
    dailySales: null,
    monthlySales: null,
    loading: true,
    error: null
  });

  const fetchSalesStats = async () => {
    try {
      // Obtener fecha actual en Colombia usando la utilidad correcta
      const today = getColombiaTodayString(); // YYYY-MM-DD en hora de Colombia

      // Obtener el primer día del mes actual en Colombia
      const colombiaDate = getColombiaDate();
      const year = colombiaDate.getFullYear();
      const month = String(colombiaDate.getMonth() + 1).padStart(2, '0');
      const startDate = `${year}-${month}-01`;

      logger.info('📊 Obteniendo estadísticas de ventas (quick-summary)', { today, startDate });
      console.log('📅 Fechas:', { today, startDate });

      // Timeout más corto ya que el endpoint es más rápido (30 segundos)
      const SALES_TIMEOUT = 30000;

      // Peticiones en paralelo usando el nuevo endpoint rápido
      const [dailyResponse, monthlyResponse] = await Promise.all([
        // Ventas del día (mismo día como from y to)
        authenticatedFetch(`/api/sales/quick-summary?from=${today}&to=${today}`, {
          method: 'GET',
        }, SALES_TIMEOUT)
          .then(async res => {
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              console.error('❌ Error en ventas del día:', errorData);
              return null;
            }
            const data = await res.json();
            console.log('✅ Ventas del día (quick):', data);
            return data;
          })
          .catch(err => {
            console.error('❌ Error fetching ventas del día:', err);
            return null;
          }),

        // Ventas del mes
        authenticatedFetch(`/api/sales/quick-summary?from=${startDate}&to=${today}`, {
          method: 'GET',
        }, SALES_TIMEOUT)
          .then(async res => {
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              console.error('❌ Error en ventas del mes:', errorData);
              return null;
            }
            const data = await res.json();
            console.log('✅ Ventas del mes (quick):', data);
            return data;
          })
          .catch(err => {
            console.error('❌ Error fetching ventas del mes:', err);
            return null;
          })
      ]);

      // Procesar ventas del día (nueva estructura de respuesta)
      const dailySales = dailyResponse?.total_sales || 0;
      console.log('💰 Venta del día procesada:', dailySales, `(${dailyResponse?.document_count || 0} documentos)`);

      // Procesar ventas del mes (nueva estructura de respuesta)
      const monthlySales = monthlyResponse?.total_sales || 0;
      console.log('💰 Venta del mes procesada:', monthlySales, `(${monthlyResponse?.document_count || 0} documentos)`);

      setSalesStats({
        dailySales,
        monthlySales,
        loading: false,
        error: null
      });

      logger.info('✅ Estadísticas de ventas actualizadas', { dailySales, monthlySales });

    } catch (error) {
      console.error('❌ Error general al obtener estadísticas:', error);
      logger.error('Error al obtener estadísticas de ventas', error);
      setSalesStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    // Cargar datos inicialmente
    fetchSalesStats();

    // Actualizar cada 5 minutos
    const interval = setInterval(() => {
      fetchSalesStats();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  return salesStats;
};

export default useSalesStats;
