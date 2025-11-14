import { useState, useMemo } from 'react';
import { parseAmount } from '../utils/formatters';

/**
 * Custom hook para manejar excedentes (máximo 3)
 * @param {Array} initialExcedentes - Estado inicial de excedentes
 * @returns {Object} Estado y funciones para manejar excedentes
 */
export const useExcedentes = (
  initialExcedentes = [{ id: 1, tipo: 'efectivo', subtipo: '', valor: '' }]
) => {
  const [excedentes, setExcedentes] = useState(initialExcedentes);

  const MAX_EXCEDENTES = 3;

  /**
   * Calcula el total de excedentes
   */
  const totalExcedentes = useMemo(() => {
    return excedentes.reduce((sum, exc) => sum + parseAmount(exc.valor), 0);
  }, [excedentes]);

  /**
   * Puede agregar más excedentes?
   */
  const canAddMore = excedentes.length < MAX_EXCEDENTES;

  /**
   * Puede eliminar excedentes?
   */
  const canRemove = excedentes.length > 1;

  /**
   * Agrega un nuevo excedente
   */
  const agregarExcedente = () => {
    if (canAddMore) {
      setExcedentes(prev => [
        ...prev,
        { id: Date.now(), tipo: 'efectivo', subtipo: '', valor: '' }
      ]);
    }
  };

  /**
   * Elimina un excedente por ID
   */
  const eliminarExcedente = (id) => {
    if (canRemove) {
      setExcedentes(prev => prev.filter(exc => exc.id !== id));
    }
  };

  /**
   * Actualiza un excedente específico
   */
  const updateExcedente = (id, field, value) => {
    setExcedentes(prev =>
      prev.map(exc =>
        exc.id === id ? { ...exc, [field]: value } : exc
      )
    );
  };

  /**
   * Resetea a estado inicial
   */
  const reset = () => {
    setExcedentes(initialExcedentes);
  };

  /**
   * Carga valores desde un array
   */
  const loadData = (data) => {
    if (data && Array.isArray(data)) {
      setExcedentes(data);
    }
  };

  return {
    excedentes,
    setExcedentes,
    totalExcedentes,
    canAddMore,
    canRemove,
    agregarExcedente,
    eliminarExcedente,
    updateExcedente,
    reset,
    loadData,
  };
};

export default useExcedentes;
