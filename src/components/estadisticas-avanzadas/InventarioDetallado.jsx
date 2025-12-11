import React, { useState, useEffect } from 'react';
import { Package, Calendar, Search, DollarSign, TrendingUp } from 'lucide-react';
import Pagination from '../common/Pagination';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getInventoryValueReport } from '../../services/directApiService';
import logger from '../../utils/logger';

const InventarioDetallado = () => {
    // Establecer título de la página
    useDocumentTitle('Inventario Detallado - Estadísticas Avanzadas');

    // Estados
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filtros
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(20);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Totales
    const [totals, setTotals] = useState({
        totalQuantity: 0,
        totalValue: 0,
        itemCount: 0
    });

    const fetchInventory = async (searchQuery = query) => {
        setLoading(true);
        setError('');

        try {
            const result = await getInventoryValueReport(toDate, limit, page, searchQuery);

            if (result.success) {
                const data = result.data.data || [];
                setInventory(data);
                setHasMore(data.length === limit);

                // Calcular totales
                const totalQty = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
                const totalVal = data.reduce((sum, item) => sum + (item.totalValue || 0), 0);

                setTotals({
                    totalQuantity: totalQty,
                    totalValue: totalVal,
                    itemCount: data.length
                });

                logger.info('Inventario cargado exitosamente', { items: data.length });
            } else {
                setError(result.error || 'Error al cargar el inventario');
                logger.error('Error cargando inventario:', result.error);
            }
        } catch (err) {
            setError('Error inesperado al cargar el inventario');
            logger.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [page]); // Recargar cuando cambia la página

    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(1); // Resetear a página 1
        fetchInventory();
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Package className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Inventario Detallado</h1>
                </div>
                <p className="text-green-100">
                    Reporte completo de valor de inventario con información detallada por producto
                </p>
            </div>

            {/* Filtros */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-end gap-4">
                    {/* Fecha Hasta */}
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Fecha Hasta
                        </label>
                        <input
                            id="toDate"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {/* Búsqueda */}
                    <div className="flex-1 min-w-[250px]">
                        <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                            <Search className="w-4 h-4 inline mr-1" />
                            Buscar Producto
                        </label>
                        <input
                            id="query"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Nombre del producto..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {/* Límite por página */}
                    <div className="min-w-[150px]">
                        <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                            Items por página
                        </label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* Botón de búsqueda */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Cargando...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Consultar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error}
                </div>
            )}

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{totals.itemCount}</p>
                        </div>
                        <Package className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Cantidad Total</p>
                            <p className="text-2xl font-bold text-gray-900">{totals.totalQuantity.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalValue)}</p>
                        </div>
                        <DollarSign className="w-12 h-12 text-green-500" />
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
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Costo Unitario
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-600">Cargando inventario...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                        No se encontraron productos para los filtros seleccionados
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((item, index) => (
                                    <tr key={item.itemId || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.itemName || 'Sin nombre'}</div>
                                            <div className="text-xs text-gray-500">ID: {item.itemId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.category || 'Sin categoría'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            {(item.quantity || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            {formatCurrency(item.unitCost)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                                            {formatCurrency(item.totalValue)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {!loading && inventory.length > 0 && (
                    <Pagination
                        currentPage={page}
                        onPageChange={handlePageChange}
                        hasMore={hasMore}
                        itemsPerPage={limit}
                    />
                )}
            </div>
        </div>
    );
};

export default InventarioDetallado;
