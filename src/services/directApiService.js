import { authenticatedFetch } from './api';

/**
 * Servicio para consumir las APIs directas de Alegra
 * Estas APIs proporcionan datos más completos y rápidos que las APIs documentadas
 */

/**
 * Obtiene el reporte de valor de inventario
 * @param {string} toDate - Fecha hasta la cual generar el reporte (YYYY-MM-DD)
 * @param {number} limit - Items por página (default: 10, max: 100)
 * @param {number} page - Número de página (default: 1)
 * @param {string} query - Filtro de búsqueda
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getInventoryValueReport = async (toDate, limit = 10, page = 1, query = '') => {
    try {
        const params = new URLSearchParams();
        if (toDate) params.append('toDate', toDate);
        params.append('limit', limit.toString());
        params.append('page', page.toString());
        if (query) params.append('query', query);

        const response = await authenticatedFetch(
            `/api/direct/inventory/value-report?${params.toString()}`
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error obteniendo reporte de inventario');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error obteniendo reporte de inventario'
        };
    }
};

/**
 * Obtiene los totales de ventas agrupados por día o mes
 * @param {string} fromDate - Fecha de inicio (YYYY-MM-DD) - REQUERIDO
 * @param {string} toDate - Fecha de fin (YYYY-MM-DD) - REQUERIDO
 * @param {string} groupBy - 'day' o 'month' (default: 'day')
 * @param {number} limit - Número de registros (default: 10)
 * @param {number} start - Offset para paginación (default: 0)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getSalesTotals = async (fromDate, toDate, groupBy = 'day', limit = 10, start = 0) => {
    try {
        // Validar parámetros requeridos
        if (!fromDate || !toDate) {
            throw new Error('Los parámetros "from" y "to" son requeridos');
        }

        const params = new URLSearchParams({
            from: fromDate,
            to: toDate,
            groupBy,
            limit: limit.toString(),
            start: start.toString()
        });

        const response = await authenticatedFetch(
            `/api/direct/sales/totals?${params.toString()}`
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error obteniendo totales de ventas');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error obteniendo totales de ventas'
        };
    }
};

/**
 * Obtiene los documentos de ventas discriminados
 * @param {string} fromDate - Fecha de inicio (YYYY-MM-DD) - REQUERIDO
 * @param {string} toDate - Fecha de fin (YYYY-MM-DD) - REQUERIDO
 * @param {number} limit - Número de documentos (default: 10)
 * @param {number} start - Offset para paginación (default: 0)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getSalesDocuments = async (fromDate, toDate, limit = 10, start = 0) => {
    try {
        // Validar parámetros requeridos
        if (!fromDate || !toDate) {
            throw new Error('Los parámetros "from" y "to" son requeridos');
        }

        const params = new URLSearchParams({
            from: fromDate,
            to: toDate,
            limit: limit.toString(),
            start: start.toString()
        });

        const response = await authenticatedFetch(
            `/api/direct/sales/documents?${params.toString()}`
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error obteniendo documentos de ventas');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error obteniendo documentos de ventas'
        };
    }
};

// Exportar todas las funciones como un objeto también
const directApiService = {
    getInventoryValueReport,
    getSalesTotals,
    getSalesDocuments
};

export default directApiService;
