import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Loader2, AlertCircle, DollarSign, ShoppingCart } from 'lucide-react';
import { getSalesTotals } from '../../services/directApiService';
import { getColombiaTodayString } from '../../utils/dateUtils';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const DirectSalesTotals = () => {
  useDocumentTitle('Totales de Ventas - Estadísticas Avanzadas');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sales, setSales] = useState([]);
  const [metadata, setMetadata] = useState(null);

  // Filtros
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Últimos 30 días por defecto
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(getColombiaTodayString());
  const [groupBy, setGroupBy] = useState('day'); // 'day' o 'month'
  const [limit, setLimit] = useState(30);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        from: fromDate,
        to: toDate,
        groupBy,
        limit,
      };

      const response = await getSalesTotals(params);

      if (response.success) {
        setSales(response.data || []);
        setMetadata(response.metadata || null);
      } else {
        throw new Error(response.error || 'Error al obtener totales de ventas');
      }
    } catch (err) {
      setError(err.message);
      setSales([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas al montar y cuando cambien los filtros
  useEffect(() => {
    if (fromDate && toDate) {
      fetchSales();
    }
  }, [fromDate, toDate, groupBy, limit]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateStr) => {
    if (groupBy === 'month') {
      // Formato: "2025-12" -> "Diciembre 2025"
      const [year, month] = dateStr.split('-');
      const date = new Date(year, month - 1, 1);
      return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });
    } else {
      // Formato: "2025-12-15" -> "15 de diciembre de 2025"
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const totalSales = sales.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalCount = sales.reduce((sum, item) => sum + (item.count || 0), 0);
  const averageSale = totalCount > 0 ? totalSales / totalCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Totales de Ventas</h1>
        </div>
        <p className="text-purple-50">
          Consulta rápida de totales de ventas agrupados por día o mes
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Desde
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Hasta
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
              max={getColombiaTodayString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Agrupar por */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agrupar por
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="day">Por Día</option>
              <option value="month">Por Mes</option>
            </select>
          </div>

          {/* Límite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de resultados
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={7}>7 resultados</option>
              <option value={15}>15 resultados</option>
              <option value={30}>30 resultados</option>
              <option value={60}>60 resultados</option>
              <option value={90}>90 resultados</option>
            </select>
          </div>
        </div>

        {/* Resumen */}
        {!loading && sales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Períodos</p>
              <p className="text-2xl font-bold text-purple-600">{sales.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Ventas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Transacciones</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Promedio por Venta</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(averageSale)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error al cargar ventas</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando totales de ventas...</p>
        </div>
      )}

      {/* Tabla de Ventas */}
      {!loading && !error && sales.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {groupBy === 'day' ? 'Fecha' : 'Mes'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Ventas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transacciones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((item, index) => {
                  const avg = item.count > 0 ? item.total / item.count : 0;
                  return (
                    <tr key={item.date || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-semibold">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(avg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">
                    {formatCurrency(totalSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-bold">
                    {totalCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                    {formatCurrency(averageSale)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !error && sales.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron ventas</h3>
          <p className="text-gray-600">
            No hay ventas registradas para el rango de fechas seleccionado
          </p>
        </div>
      )}
    </div>
  );
};

export default DirectSalesTotals;
