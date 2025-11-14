import * as yup from 'yup';

/**
 * Esquema de validación para el formulario de cierre de caja
 */

// Helper para validar números positivos
const positiveNumber = () =>
  yup
    .number()
    .transform((value, originalValue) => {
      // Convertir string vacío a undefined
      return originalValue === '' ? undefined : value;
    })
    .min(0, 'El valor debe ser positivo')
    .integer('El valor debe ser un número entero');

// Esquema para monedas
const coinsSchema = yup.object().shape({
  '50': positiveNumber(),
  '100': positiveNumber(),
  '200': positiveNumber(),
  '500': positiveNumber(),
  '1000': positiveNumber(),
});

// Esquema para billetes
const billsSchema = yup.object().shape({
  '2000': positiveNumber(),
  '5000': positiveNumber(),
  '10000': positiveNumber(),
  '20000': positiveNumber(),
  '50000': positiveNumber(),
  '100000': positiveNumber(),
});

// Esquema para métodos de pago
const paymentMethodsSchema = yup.object().shape({
  addi_datafono: positiveNumber(),
  nequi_luz_helena: positiveNumber(),
  daviplata_jose: positiveNumber(),
  qr_julieth: positiveNumber(),
  tarjeta_debito: positiveNumber(),
  tarjeta_credito: positiveNumber(),
});

// Esquema para excedentes
const excedenteSchema = yup.object().shape({
  id: yup.number().required(),
  tipo: yup
    .string()
    .oneOf(['efectivo', 'qr_transferencias', 'datafono'], 'Tipo de excedente inválido')
    .required('El tipo es requerido'),
  subtipo: yup.string().when('tipo', {
    is: 'qr_transferencias',
    then: (schema) => schema.required('El subtipo es requerido cuando el tipo es QR/Transferencias'),
    otherwise: (schema) => schema.notRequired(),
  }),
  valor: positiveNumber().required('El valor es requerido'),
});

// Esquema para ajustes
const adjustmentsSchema = yup.object().shape({
  gastos_operativos: positiveNumber(),
  gastos_operativos_nota: yup.string().max(200, 'La nota no puede exceder 200 caracteres'),
  prestamos: positiveNumber(),
  prestamos_nota: yup.string().max(200, 'La nota no puede exceder 200 caracteres'),
});

// Esquema principal del formulario
export const cashClosingSchema = yup.object().shape({
  date: yup
    .date()
    .required('La fecha es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  coins: coinsSchema,
  bills: billsSchema,
  metodosPago: paymentMethodsSchema,
  excedentes: yup
    .array()
    .of(excedenteSchema)
    .min(1, 'Debe haber al menos un excedente')
    .max(3, 'Máximo 3 excedentes permitidos'),
  adjustments: adjustmentsSchema,
});

/**
 * Valida todo el formulario
 * @param {Object} data - Datos del formulario
 * @returns {Promise<Object>} - Resultado de la validación
 */
export const validateCashClosing = async (data) => {
  try {
    await cashClosingSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    const errors = {};
    err.inner.forEach((error) => {
      if (error.path) {
        errors[error.path] = error.message;
      }
    });
    return { isValid: false, errors };
  }
};

/**
 * Valida un campo específico
 * @param {string} field - Nombre del campo
 * @param {any} value - Valor del campo
 * @param {Object} schema - Esquema de validación
 * @returns {Promise<string|null>} - Mensaje de error o null
 */
export const validateField = async (field, value, schema = cashClosingSchema) => {
  try {
    await schema.validateAt(field, { [field]: value });
    return null;
  } catch (err) {
    return err.message;
  }
};

/**
 * Valida que la fecha no sea futura
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
export const isValidDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return selectedDate <= today;
};

/**
 * Valida que haya al menos algún valor ingresado
 * @param {Object} data - Datos del formulario
 * @returns {boolean}
 */
export const hasAnyValue = (data) => {
  // Verificar monedas
  const hasCoins = Object.values(data.coins || {}).some((v) => v && parseInt(v) > 0);

  // Verificar billetes
  const hasBills = Object.values(data.bills || {}).some((v) => v && parseInt(v) > 0);

  // Verificar métodos de pago
  const hasPayments = Object.values(data.metodosPago || {}).some((v) => v && parseInt(v) > 0);

  // Verificar excedentes
  const hasExcedentes = data.excedentes?.some((exc) => exc.valor && parseInt(exc.valor) > 0);

  return hasCoins || hasBills || hasPayments || hasExcedentes;
};

export default {
  cashClosingSchema,
  validateCashClosing,
  validateField,
  isValidDate,
  hasAnyValue,
};
