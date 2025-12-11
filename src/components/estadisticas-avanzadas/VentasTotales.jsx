import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, DollarSign, FileText } from 'lucide-react';
import DateRangeFilter from '../common/DateRangeFilter';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getSalesTotals } from '../../services/directApiService';
import logger from '../../utils/logger';

const VentasTotales = () => {
    // Establecer título de la página
    useDocumentTitle('Totales de Ventas - Estadísticas Avanzadas');

    // Estados
    const [totales, setTotales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filtros
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [fromDate, setFromDate] = useState(firstDayOfMonth);
    const [toDate, setToDate] = useState(today);
    const [groupBy, setGroupBy] = useState('day');
    const [limit, setLimit] = useState(30);

    // Totales del período
    const [periodTotals, setPeriodTotals] = useState({
        totalSales: 0,
        totalInvoices: 0,
        averageTicket: 0,
        averageDaily: 0
    });

    const fetchTotales = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getSalesTotals(fromDate, toDate, groupBy, limit);

            if (result.success) {
                const data = result.data.data || [];
                setTotales(data);

                // Calcular totales del período
                const totalSalesSum = data.reduce((sum, item) => sum + (item.totalSales || 0), 0);
                const totalInvoicesSum = data.reduce((sum, item) => sum + (item.totalInvoices || 0), 0);
                const avgTicket = totalInvoicesSum > 0 ? totalSalesSum / totalInvoicesSum : 0;
                const avgDaily = data.length > 0 ? totalSalesSum / data.length : 0;

                setPeriodTotals({
                    totalSales: totalSalesSum,
                    totalInvoices: totalInvoicesSum,
                    averageTicket: avgTicket,
                    averageDaily: avgDaily
                });

                logger.info('Totales de ventas cargados exitosamente', { records: data.length });
            } else {
                setError(result.error || 'Error al cargar totales de ventas');
                logger.error('Error cargando totales:', result.error);
            }
        } catch (err) {
            setError('Error inesperado al cargar totales de ventas');
            logger.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotales();
    }, []);

    const handleSubmit = () => {
        fetchTotales();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        if (groupBy === 'month') {
            // Formato: 2025-12 -> Diciembre 2025
            const [year, month] = dateString.split('-');
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return `${monthNames[parseInt(month) - 1]} ${year}`;
        } else {
            // Formato: 2025-12-10 -> 10 Dic 2025
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Totales de Ventas</h1>
                </div>
                <p className="text-purple-100">
                    Reporte de ventas agrupadas por día o mes con métricas detalladas
                </p>
            </div>

            {/* Filtros */}
            <DateRangeFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onSubmit={handleSubmit}
                loading={loading}
            >
                {/* Agrupación */}
                <div className="min-w-[150px]">
                    <label htmlFor="groupBy" className="block text-sm font-medium text-gray-700 mb-2">
                        <BarChart3 className="w-4 h-4 inline mr-1" />
                        Agrupar por
                    </label>
                    <select
                        id="groupBy"
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="day">Día</option>
                        <option value="month">Mes</option>
                    </select>
                </div>

                {/* Límite */}
                <div className="min-w-[150px]">
                    <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                        Registros
                    </label>
                    <select
                        id="limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="10">10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </DateRangeFilter>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error}
                </div>
            )}

            {/* Tarjetas de resumen del período */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(periodTotals.totalSales)}</p>
                        </div>
                        <DollarSign className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Facturas</p>
                            <p className="text-2xl font-bold text-gray-900">{periodTotals.totalInvoices.toLocaleString()}</p>
                        </div>
                        <FileText className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Ticket Promedio</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(periodTotals.averageTicket)}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Promedio {groupBy === 'day' ? 'Diario' : 'Mensual'}</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(periodTotals.averageDaily)}</p>
                        </div>
                        <Calendar className="w-12 h-12 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Ventas
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Facturas
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticket Promedio
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-600">Cargando totales de ventas...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : totales.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500">
                                        No se encontraron ventas para el período seleccionado
                                    </td>
                                </tr>
                            ) : (
                                totales.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">{formatDate(item.date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                            {formatCurrency(item.totalSales)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            {(item.totalInvoices || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            {formatCurrency(item.averageTicket)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {!loading && totales.length > 0 && (
                            <tfoot className="bg-gray-100 font-bold">
                                <tr>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        TOTAL DEL PERÍODO
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-green-700">
                                        {formatCurrency(periodTotals.totalSales)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                                        {periodTotals.totalInvoices.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                                        {formatCurrency(periodTotals.averageTicket)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VentasTotales;
