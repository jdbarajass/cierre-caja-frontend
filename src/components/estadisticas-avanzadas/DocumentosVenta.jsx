import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, CreditCard, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import DateRangeFilter from '../common/DateRangeFilter';
import Pagination from '../common/Pagination';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getSalesDocuments } from '../../services/directApiService';
import logger from '../../utils/logger';

const DocumentosVenta = () => {
    // Establecer título de la página
    useDocumentTitle('Documentos de Venta - Estadísticas Avanzadas');

    // Estados
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedDoc, setExpandedDoc] = useState(null);

    // Filtros y paginación
    const today = new Date().toISOString().split('T')[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [limit, setLimit] = useState(10);
    const [start, setStart] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Totales
    const [totals, setTotals] = useState({
        totalSales: 0,
        documentCount: 0
    });

    const fetchDocuments = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getSalesDocuments(fromDate, toDate, limit, start);

            if (result.success) {
                const data = result.data.data || [];
                setDocuments(data);
                setHasMore(data.length === limit);

                // Calcular totales
                const totalSalesSum = data.reduce((sum, doc) => sum + (doc.total || 0), 0);

                setTotals({
                    totalSales: totalSalesSum,
                    documentCount: data.length
                });

                logger.info('Documentos de venta cargados exitosamente', { documents: data.length });
            } else {
                setError(result.error || 'Error al cargar documentos de venta');
                logger.error('Error cargando documentos:', result.error);
            }
        } catch (err) {
            setError('Error inesperado al cargar documentos de venta');
            logger.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [start]);

    const handleSubmit = () => {
        setStart(0); // Resetear paginación
        fetchDocuments();
    };

    const handlePageChange = (newPage) => {
        const newStart = (newPage - 1) * limit;
        setStart(newStart);
    };

    const toggleExpanded = (docId) => {
        setExpandedDoc(expandedDoc === docId ? null : docId);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const currentPage = Math.floor(start / limit) + 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Documentos de Venta</h1>
                </div>
                <p className="text-blue-100">
                    Listado detalla do de facturas con información completa de cada transacción
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
                {/* Límite */}
                <div className="min-w-[150px]">
                    <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                        Documentos por página
                    </label>
                    <select
                        id="limit"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setStart(0);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </DateRangeFilter>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error}
                </div>
            )}

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Documentos</p>
                            <p className="text-2xl font-bold text-gray-900">{totals.documentCount}</p>
                        </div>
                        <FileText className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Ventas (Página)</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalSales)}</p>
                        </div>
                        <DollarSign className="w-12 h-12 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Lista de documentos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Cargando documentos...</p>
                        </div>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="px-6 py-20 text-center text-gray-500">
                        No se encontraron documentos para el período seleccionado
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {documents.map((doc, index) => (
                            <div key={doc.invoiceId || index} className="transition-colors hover:bg-gray-50">
                                {/* Fila principal */}
                                <div
                                    className="px-6 py-4 cursor-pointer"
                                    onClick={() => toggleExpanded(doc.invoiceId)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                                            {/* Número de factura */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Factura</p>
                                                <p className="text-sm font-semibold text-blue-600">{doc.number || 'N/A'}</p>
                                            </div>

                                            {/* Fecha */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Fecha</p>
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                                    <p className="text-sm text-gray-900">{formatDate(doc.date)}</p>
                                                </div>
                                            </div>

                                            {/* Cliente */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Cliente</p>
                                                <div className="flex items-center">
                                                    <User className="w-3 h-3 text-gray-400 mr-1" />
                                                    <p className="text-sm text-gray-900 truncate">{doc.client || 'Sin especificar'}</p>
                                                </div>
                                            </div>

                                            {/* Método de pago */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Pago</p>
                                                <div className="flex items-center">
                                                    <CreditCard className="w-3 h-3 text-gray-400 mr-1" />
                                                    <p className="text-sm text-gray-900 capitalize">{doc.paymentMethod || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Total</p>
                                                <p className="text-sm font-bold text-green-600">{formatCurrency(doc.total)}</p>
                                            </div>
                                        </div>

                                        {/* Botón expandir */}
                                        <button className="ml-4 text-gray-400 hover:text-gray-600">
                                            {expandedDoc === doc.invoiceId ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Detalles expandidos */}
                                {expandedDoc === doc.invoiceId && doc.items && doc.items.length > 0 && (
                                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                                        <div className="pt-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">Items de la factura:</p>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cant.</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {doc.items.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="px-3 py-2 text-sm text-gray-900">{item.name || 'Sin nombre'}</td>
                                                                <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.quantity || 0}</td>
                                                                <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                                                                <td className="px-3 py-2 text-sm font-semibold text-gray-900 text-right">
                                                                    {formatCurrency((item.quantity || 0) * (item.price || 0))}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {doc.seller && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500">
                                                        <span className="font-medium">Vendedora:</span> {doc.seller}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {!loading && documents.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        hasMore={hasMore}
                        itemsPerPage={limit}
                    />
                )}
            </div>
        </div>
    );
};

export default DocumentosVenta;
