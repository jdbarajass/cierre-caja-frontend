import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../services/api';
import logger from '../utils/logger';
import { getColombiaTodayString, getColombiaDate } from '../utils/dateUtils';

/**
 * Hook para obtener comparación de ventas año sobre año
 * Usa el endpoint rápido /api/sales/quick-summary
 */
export const useSalesComparison = () => {
  const [comparison, setComparison] = useState({
    dailyComparison: null,
    monthlyComparison: null,
    loading: true,
    error: null
  });

  const fetchComparison = async () => {
    try {
      // Obtener fecha actual en Colombia
      const today = getColombiaTodayString(); // YYYY-MM-DD
      const colombiaDate = getColombiaDate();

      // Calcular fecha del año anterior (mismo día y mes)
      const previousYearDate = new Date(colombiaDate);
      previousYearDate.setFullYear(colombiaDate.getFullYear() - 1);
      const previousYear = previousYearDate.getFullYear();
      const previousMonth = String(previousYearDate.getMonth() + 1).padStart(2, '0');
      const previousDay = String(previousYearDate.getDate()).padStart(2, '0');
      const todayLastYear = `${previousYear}-${previousMonth}-${previousDay}`;

      // Obtener el primer día del mes actual y año anterior
      const currentYear = colombiaDate.getFullYear();
      const currentMonth = String(colombiaDate.getMonth() + 1).padStart(2, '0');
      const startOfMonth = `${currentYear}-${currentMonth}-01`;
      const startOfMonthLastYear = `${previousYear}-${previousMonth}-01`;

      logger.info('📊 Obteniendo comparación año sobre año', {
        today,
        todayLastYear,
        startOfMonth,
        startOfMonthLastYear
      });

      const SALES_TIMEOUT = 30000; // 30 segundos

      // Peticiones en paralelo
      const [
        currentDayResponse,
        previousDayResponse,
        currentMonthResponse,
        previousMonthResponse
      ] = await Promise.all([
        // Día actual
        authenticatedFetch(`/api/sales/quick-summary?from=${today}&to=${today}`, {
          method: 'GET',
        }, SALES_TIMEOUT).then(res => res.ok ? res.json() : null).catch(() => null),

        // Mismo día año anterior
        authenticatedFetch(`/api/sales/quick-summary?from=${todayLastYear}&to=${todayLastYear}`, {
          method: 'GET',
        }, SALES_TIMEOUT).then(res => res.ok ? res.json() : null).catch(() => null),

        // Mes actual
        authenticatedFetch(`/api/sales/quick-summary?from=${startOfMonth}&to=${today}`, {
          method: 'GET',
        }, SALES_TIMEOUT).then(res => res.ok ? res.json() : null).catch(() => null),

        // Mismo mes año anterior
        authenticatedFetch(`/api/sales/quick-summary?from=${startOfMonthLastYear}&to=${todayLastYear}`, {
          method: 'GET',
        }, SALES_TIMEOUT).then(res => res.ok ? res.json() : null).catch(() => null)
      ]);

      // Procesar datos del día
      const currentDayTotal = currentDayResponse?.total_sales || 0;
      const previousDayTotal = previousDayResponse?.total_sales || 0;
      const dayDifference = currentDayTotal - previousDayTotal;
      const dayPercentageChange = previousDayTotal > 0
        ? ((currentDayTotal - previousDayTotal) / previousDayTotal) * 100
        : (currentDayTotal > 0 ? 100 : 0);

      // Procesar datos del mes
      const currentMonthTotal = currentMonthResponse?.total_sales || 0;
      const previousMonthTotal = previousMonthResponse?.total_sales || 0;
      const monthDifference = currentMonthTotal - previousMonthTotal;
      const monthPercentageChange = previousMonthTotal > 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
        : (currentMonthTotal > 0 ? 100 : 0);

      // Formatear moneda
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      };

      setComparison({
        dailyComparison: {
          current: {
            date: today,
            total: currentDayTotal,
            formatted: formatCurrency(currentDayTotal)
          },
          previous: {
            date: todayLastYear,
            total: previousDayTotal,
            formatted: formatCurrency(previousDayTotal)
          },
          difference: dayDifference,
          differenceFormatted: formatCurrency(Math.abs(dayDifference)),
          percentageChange: Math.round(dayPercentageChange * 100) / 100,
          isGrowth: dayDifference >= 0
        },
        monthlyComparison: {
          current: {
            period: `${startOfMonth} a ${today}`,
            total: currentMonthTotal,
            formatted: formatCurrency(currentMonthTotal)
          },
          previous: {
            period: `${startOfMonthLastYear} a ${todayLastYear}`,
            total: previousMonthTotal,
            formatted: formatCurrency(previousMonthTotal)
          },
          difference: monthDifference,
          differenceFormatted: formatCurrency(Math.abs(monthDifference)),
          percentageChange: Math.round(monthPercentageChange * 100) / 100,
          isGrowth: monthDifference >= 0
        },
        loading: false,
        error: null
      });

      logger.info('✅ Comparación año sobre año actualizada');

    } catch (error) {
      logger.error('Error al obtener comparación año sobre año', error);
      setComparison(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    // Cargar datos inicialmente
    fetchComparison();

    // Actualizar cada 5 minutos (igual que useSalesStats)
    const interval = setInterval(() => {
      fetchComparison();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return comparison;
};

export default useSalesComparison;
