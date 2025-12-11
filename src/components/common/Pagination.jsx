import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente de paginación reutilizable
 * @param {number} currentPage - Página actual
 * @param {function} onPageChange - Callback cuando cambia la página
 * @param {boolean} hasMore - Si hay más páginas disponibles
 * @param {number} totalItems - Total de items (opcional, para mostrar información)
 * @param {number} itemsPerPage - Items por página (opcional, para mostrar información)
 */
const Pagination = ({
    currentPage = 1,
    onPageChange,
    hasMore = false,
    totalItems = null,
    itemsPerPage = null
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasMore) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageInfo = () => {
        if (totalItems !== null && itemsPerPage !== null) {
            const startItem = (currentPage - 1) * itemsPerPage + 1;
            const endItem = Math.min(currentPage * itemsPerPage, totalItems);
            return `Mostrando ${startItem}-${endItem} de ${totalItems}`;
        }
        return `Página ${currentPage}`;
    };

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg">
            {/* Info de página */}
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <button
                    onClick={handleNext}
                    disabled={!hasMore}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        {getPageInfo()}
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Número de página actual */}
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                            {currentPage}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={!hasMore}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Siguiente</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    totalItems: PropTypes.number,
    itemsPerPage: PropTypes.number
};

export default Pagination;
