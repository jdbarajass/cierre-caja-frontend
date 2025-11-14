import { useState, useMemo } from 'react';
import { parseAmount } from '../utils/formatters';

/**
 * Custom hook para manejar los métodos de pago
 * @param {Object} initialState - Estado inicial de métodos de pago
 * @returns {Object} Estado y funciones para manejar métodos de pago
 */
export const usePaymentMethods = (
  initialState = {
    addi_datafono: '',
    nequi_luz_helena: '',
    daviplata_jose: '',
    qr_julieth: '',
    tarjeta_debito: '',
    tarjeta_credito: ''
  }
) => {
  const [metodosPago, setMetodosPago] = useState(initialState);

  /**
   * Calcula el total de transferencias registradas
   */
  const totalTransferencias = useMemo(() => {
    return parseAmount(metodosPago.nequi_luz_helena) +
           parseAmount(metodosPago.daviplata_jose) +
           parseAmount(metodosPago.qr_julieth);
  }, [metodosPago.nequi_luz_helena, metodosPago.daviplata_jose, metodosPago.qr_julieth]);

  /**
   * Calcula el total de datafono registrado
   */
  const totalDatafono = useMemo(() => {
    return parseAmount(metodosPago.addi_datafono) +
           parseAmount(metodosPago.tarjeta_debito) +
           parseAmount(metodosPago.tarjeta_credito);
  }, [metodosPago.addi_datafono, metodosPago.tarjeta_debito, metodosPago.tarjeta_credito]);

  /**
   * Calcula el total de todos los métodos de pago
   */
  const totalMetodosPago = useMemo(() => {
    return Object.values(metodosPago).reduce((sum, value) => {
      return sum + parseAmount(value);
    }, 0);
  }, [metodosPago]);

  /**
   * Actualiza un método de pago específico
   */
  const updatePaymentMethod = (method, value) => {
    setMetodosPago(prev => ({ ...prev, [method]: value }));
  };

  /**
   * Resetea todos los valores
   */
  const reset = () => {
    setMetodosPago(initialState);
  };

  /**
   * Carga valores desde un objeto
   */
  const loadData = (data) => {
    if (data) {
      setMetodosPago(data);
    }
  };

  return {
    metodosPago,
    setMetodosPago,
    updatePaymentMethod,
    totalTransferencias,
    totalDatafono,
    totalMetodosPago,
    reset,
    loadData,
  };
};

export default usePaymentMethods;
