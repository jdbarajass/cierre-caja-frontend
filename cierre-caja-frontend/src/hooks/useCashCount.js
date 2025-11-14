import { useState, useMemo } from 'react';

/**
 * Custom hook para manejar el conteo de dinero (monedas y billetes)
 * @param {Object} initialCoins - Estado inicial de monedas
 * @param {Object} initialBills - Estado inicial de billetes
 * @returns {Object} Estado y funciones para manejar monedas y billetes
 */
export const useCashCount = (
  initialCoins = { '50': '', '100': '', '200': '', '500': '', '1000': '' },
  initialBills = { '2000': '', '5000': '', '10000': '', '20000': '', '50000': '', '100000': '' }
) => {
  const [coins, setCoins] = useState(initialCoins);
  const [bills, setBills] = useState(initialBills);

  /**
   * Calcula el total de un conjunto de items (monedas o billetes)
   */
  const calculateTotal = (items) => {
    return Object.entries(items).reduce((sum, [denom, qty]) => {
      return sum + (parseInt(denom) * parseInt(qty || 0));
    }, 0);
  };

  // Memoizar los totales para evitar recálculos innecesarios
  const totalCoins = useMemo(() => calculateTotal(coins), [coins]);
  const totalBills = useMemo(() => calculateTotal(bills), [bills]);
  const totalGeneral = useMemo(() => totalCoins + totalBills, [totalCoins, totalBills]);

  /**
   * Actualiza el valor de una moneda específica
   */
  const updateCoin = (denomination, value) => {
    setCoins(prev => ({ ...prev, [denomination]: value }));
  };

  /**
   * Actualiza el valor de un billete específico
   */
  const updateBill = (denomination, value) => {
    setBills(prev => ({ ...prev, [denomination]: value }));
  };

  /**
   * Resetea todos los valores a vacío
   */
  const reset = () => {
    setCoins(initialCoins);
    setBills(initialBills);
  };

  /**
   * Carga valores desde un objeto
   */
  const loadData = (data) => {
    if (data.coins) setCoins(data.coins);
    if (data.bills) setBills(data.bills);
  };

  return {
    coins,
    bills,
    setCoins,
    setBills,
    updateCoin,
    updateBill,
    totalCoins,
    totalBills,
    totalGeneral,
    reset,
    loadData,
  };
};

export default useCashCount;
