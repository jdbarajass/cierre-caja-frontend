import { useEffect, useCallback, useState } from 'react';
import logger from '../utils/logger';

const STORAGE_KEY = 'cierre-caja-draft';
const AUTOSAVE_DELAY = 1000; // 1 segundo de delay para autosave

/**
 * Custom hook para persistir datos del formulario en localStorage
 * Implementa auto-guardado con debounce
 * @param {Object} data - Datos a persistir
 * @param {boolean} enabled - Si el autosave está habilitado
 * @returns {Object} Funciones para manejar la persistencia
 */
export const useFormPersistence = (data, enabled = true) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Guarda los datos en localStorage
   */
  const saveData = useCallback((dataToSave) => {
    try {
      setIsSaving(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: dataToSave,
        timestamp: new Date().toISOString(),
      }));
      setLastSaved(new Date());
      logger.info('📝 Borrador guardado automáticamente');
    } catch (error) {
      logger.error('Error al guardar borrador:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Carga los datos desde localStorage
   */
  const loadData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        logger.info('📂 Borrador cargado desde:', new Date(parsed.timestamp).toLocaleString());
        return parsed.data;
      }
    } catch (error) {
      logger.error('Error al cargar borrador:', error);
    }
    return null;
  }, []);

  /**
   * Elimina el borrador guardado
   */
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      logger.info('🗑️ Borrador eliminado');
    } catch (error) {
      logger.error('Error al eliminar borrador:', error);
    }
  }, []);

  /**
   * Verifica si hay un borrador guardado
   */
  const hasSavedData = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  /**
   * Obtiene la fecha del último guardado
   */
  const getSavedTimestamp = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Date(parsed.timestamp);
      }
    } catch (error) {
      logger.error('Error al obtener timestamp:', error);
    }
    return null;
  }, []);

  /**
   * Auto-guardado con debounce
   */
  useEffect(() => {
    if (!enabled || !data) return;

    const timeoutId = setTimeout(() => {
      saveData(data);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [data, enabled, saveData]);

  return {
    saveData,
    loadData,
    clearSavedData,
    hasSavedData,
    getSavedTimestamp,
    lastSaved,
    isSaving,
  };
};

export default useFormPersistence;
