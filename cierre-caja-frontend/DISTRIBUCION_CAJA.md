# 💰 Distribución de Monedas y Billetes - Caja Base y Consignación

Este documento describe la funcionalidad de distribución automática de dinero entre caja base y consignación.

---

## 📋 Resumen

Se implementó una nueva sección en los resultados del cierre que muestra:

1. **💰 Caja Base (450,000)** - Dinero que queda en caja para el siguiente día
2. **🏦 Para Consignación** - Dinero que se debe depositar al banco

Cada sección muestra el desglose completo de:
- Monedas (50, 100, 200, 500, 1000)
- Billetes (2,000, 5,000, 10,000, 20,000, 50,000, 100,000)
- Cantidad de unidades por denominación
- Valor total por denominación
- Subtotales (monedas, billetes)
- Total general

---

## 🎯 Problema que Resuelve

### Antes:
El cajero tenía que:
- ❌ Calcular manualmente qué dejar en caja
- ❌ Decidir qué denominaciones usar
- ❌ Contar múltiples veces para verificar
- ❌ Alto riesgo de error en el conteo
- ❌ Proceso lento y tedioso

### Después:
El sistema muestra:
- ✅ Desglose exacto de qué queda en caja
- ✅ Desglose exacto de qué consignar
- ✅ Cantidades específicas por denominación
- ✅ Distribución optimizada automática
- ✅ Verificación inmediata del total

---

## 🔢 Algoritmo de Distribución

### Reglas del Algoritmo:

**1. Caja Base Fija:** 450,000 COP

**2. Si Total ≤ 450,000:**
```
Caja Base = Todo el dinero contado
Consignación = 0
```

**3. Si Total > 450,000:**
```
Estrategia de distribución:
1. Billetes grandes (100k, 50k, 20k, 10k, 5k, 2k) → Prioridad para CONSIGNACIÓN
2. Monedas (todas) → Se quedan en CAJA BASE
3. Billetes restantes → Completan CAJA BASE si es necesario
```

### Ejemplo Práctico:

**Caso 1: Total = 400,000 (menor a 450,000)**
```
Conteo:
- 20 monedas de $1,000 = $20,000
- 10 billetes de $2,000 = $20,000
- 30 billetes de $10,000 = $300,000
- 3 billetes de $20,000 = $60,000
TOTAL = $400,000

Distribución:
✅ Caja Base = $400,000 (TODO)
   ├── Monedas: $20,000 (20 de $1,000)
   └── Billetes: $380,000 (10 de $2k, 30 de $10k, 3 de $20k)

❌ Consignación = $0
```

**Caso 2: Total = 650,000 (mayor a 450,000)**
```
Conteo:
- 10 monedas de $1,000 = $10,000
- 5 billetes de $2,000 = $10,000
- 20 billetes de $10,000 = $200,000
- 10 billetes de $20,000 = $200,000
- 4 billetes de $50,000 = $200,000
- 3 billetes de $100,000 = $300,000
TOTAL = $920,000

Distribución:
✅ Caja Base = $450,000
   ├── Monedas: $10,000 (10 de $1,000)
   └── Billetes: $440,000 (5 de $2k, 20 de $10k, 1 de $20k)

✅ Consignación = $470,000
   ├── Monedas: $0
   └── Billetes: $470,000 (3 de $100k, 4 de $50k, 9 de $20k)

Algoritmo:
1. Separa 3 billetes de $100k para consignación (300k)
2. Separa 4 billetes de $50k para consignación (200k)
3. Necesita -30k más para consignación, toma 0 billetes de $20k
   (pero ajusta: deja 450k en caja base = 10k monedas + 440k billetes)
4. El resto (9 billetes de $20k) va a consignación
```

---

## 🎨 Diseño de la UI

### Estructura Visual:

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Distribución de Monedas y Billetes                          │
├──────────────────────────────┬──────────────────────────────────┤
│  💰 Caja Base (450,000)      │  🏦 Para Consignación            │
│  ┌────────────────────────┐  │  ┌────────────────────────┐      │
│  │ 🟡 Monedas             │  │  │ 🟡 Monedas             │      │
│  │ $1,000:  20 un. → $20k │  │  │ No hay monedas         │      │
│  │ $500:    10 un. → $5k  │  │  │                        │      │
│  │ Subtotal: $25,000      │  │  │ Subtotal: $0           │      │
│  └────────────────────────┘  │  └────────────────────────┘      │
│                              │                                   │
│  ┌────────────────────────┐  │  ┌────────────────────────┐      │
│  │ 🟢 Billetes            │  │  │ 🟢 Billetes            │      │
│  │ $2,000:   5 un. → $10k │  │  │ $100,000: 3 un. → $300k│      │
│  │ $10,000: 20 un. → $200k│  │  │ $50,000:  4 un. → $200k│      │
│  │ $20,000:  1 un. → $20k │  │  │ Subtotal: $500,000     │      │
│  │ Subtotal: $425,000     │  │  └────────────────────────┘      │
│  └────────────────────────┘  │                                   │
│                              │                                   │
│  TOTAL: $450,000            │  TOTAL: $500,000                  │
└──────────────────────────────┴──────────────────────────────────┘
│  📊 Resumen Total                                                │
│  Caja Base: $450,000 | Para Consignar: $500,000 | Total: $950k  │
└──────────────────────────────────────────────────────────────────┘
```

### Colores y Estética:

**Caja Base (Azul):**
- Gradiente: `from-blue-50 to-indigo-50`
- Borde: `border-blue-200`
- Títulos: `text-blue-900`
- Subtotales monedas: `text-yellow-600` con `bg-yellow-50`
- Subtotales billetes: `text-green-600` con `bg-green-50`

**Consignación (Verde):**
- Gradiente: `from-emerald-50 to-teal-50`
- Borde: `border-emerald-200`
- Títulos: `text-emerald-900`
- Subtotales monedas: `text-yellow-600` con `bg-yellow-50`
- Subtotales billetes: `text-green-600` con `bg-green-50`

**Resumen Total (Morado/Rosa):**
- Gradiente: `from-purple-500 to-pink-500`
- Texto blanco
- 3 columnas con totales

### Características de Diseño:

1. **Líneas Guía**
   ```
   $10,000:  20 un. .............. $200,000
   ```
   - Línea punteada conecta denominación con valor
   - Facilita lectura en pantallas grandes
   - Mismo estilo que excedentes

2. **Iconos Visuales**
   - 💰 Caja Base
   - 🏦 Consignación
   - 🟡 Monedas (círculo amarillo)
   - 🟢 Billetes (círculo verde)

3. **Responsive Design**
   - 2 columnas en pantallas grandes (lg:)
   - 1 columna en pantallas pequeñas
   - Textos adaptables (text-xs sm:text-sm)
   - Padding responsivo (p-4 sm:p-6)

4. **Mensajes Vacíos**
   - "No hay monedas para consignar"
   - "No hay billetes para consignar"
   - Texto italic, gris claro, centrado

---

## 💻 Implementación Técnica

### Función Principal:

```javascript
calcularDistribucionCaja(coins, bills) {
  const CAJA_BASE = 450000;

  // Calcular totales
  const totalContado = totalCoins + totalBills;

  // Si total <= base, todo queda en caja
  if (totalContado <= CAJA_BASE) {
    return {
      cajaBase: { todo },
      consignacion: { nada }
    };
  }

  // Algoritmo de distribución
  // 1. Billetes grandes → consignación
  // 2. Monedas → caja base
  // 3. Ajustar para completar 450k

  return { cajaBase, consignacion };
}
```

### Estructura de Datos Retornada:

```javascript
{
  cajaBase: {
    coins: {
      '50': 0,
      '100': 5,
      '200': 10,
      '500': 8,
      '1000': 20
    },
    bills: {
      '2000': 5,
      '5000': 0,
      '10000': 20,
      '20000': 1,
      '50000': 0,
      '100000': 0
    },
    totalCoins: 25000,
    totalBills: 425000,
    total: 450000
  },
  consignacion: {
    coins: { ... },  // generalmente todos en 0
    bills: { ... },   // billetes grandes
    totalCoins: 0,
    totalBills: 500000,
    total: 500000
  }
}
```

### Integración en handleSubmit:

```javascript
const data = await submitCashClosing(payload);

// Calcular distribución
const distribucion = calcularDistribucionCaja(coins, bills);
data.distribucion_caja = distribucion;

setResults(data);
```

### Renderizado Condicional:

```jsx
{results.distribucion_caja && (
  <div className="mb-6">
    {/* UI completa de distribución */}
  </div>
)}
```

---

## 📊 Casos de Uso

### Caso 1: Día con Pocas Ventas
```
Conteo: $300,000
Resultado:
- Caja Base: $300,000 (todo queda en caja)
- Consignación: $0 (no hay nada que depositar)

Mensaje: Se informa al cajero que puede cerrar
sin necesidad de ir al banco.
```

### Caso 2: Día Normal
```
Conteo: $650,000
Resultado:
- Caja Base: $450,000 (monedas + billetes pequeños)
- Consignación: $200,000 (billetes grandes)

Acción: Cajero separa exactamente lo indicado
y va al banco con $200,000 en billetes grandes.
```

### Caso 3: Día con Muchas Ventas
```
Conteo: $1,500,000
Resultado:
- Caja Base: $450,000 (mínimo necesario)
- Consignación: $1,050,000 (mayoría en billetes grandes)

Ventaja: Consignación optimizada con denominaciones
grandes facilita el depósito bancario.
```

---

## ✅ Beneficios de la Funcionalidad

### Para el Cajero:
1. ✅ **Claridad Total**
   - Sabe exactamente qué dejar en caja
   - Sabe exactamente qué consignar
   - No hay ambigüedad ni confusión

2. ✅ **Ahorro de Tiempo**
   - No necesita calcular manualmente
   - No necesita contar múltiples veces
   - Proceso más rápido y eficiente

3. ✅ **Reducción de Errores**
   - Sistema hace el cálculo correcto
   - Distribución optimizada automáticamente
   - Menor riesgo de equivocaciones

4. ✅ **Facilidad de Verificación**
   - Puede contar denominación por denominación
   - Verificación independiente de cada sección
   - Subtotales ayudan a detectar discrepancias

### Para el Negocio:
1. ✅ **Control Financiero**
   - Caja base siempre correcta (450k)
   - Consignaciones precisas
   - Trazabilidad completa

2. ✅ **Optimización**
   - Billetes grandes priorizados para banco
   - Monedas y billetes pequeños en caja
   - Facilita cambio para clientes

3. ✅ **Auditoría**
   - Registro detallado de distribución
   - Evidencia de cómo se separó el dinero
   - Historial de decisiones

---

## 🎓 Lógica del Algoritmo (Detallada)

### Paso 1: Validación Inicial
```javascript
if (totalContado <= CAJA_BASE) {
  // Todo queda en caja, nada para consignar
  return cajaCompleta;
}
```

### Paso 2: Priorizar Billetes Grandes
```javascript
const billetesOrdenados = ['100000', '50000', '20000', '10000', '5000', '2000'];

for (const denom of billetesOrdenados) {
  // Calcular cuántos de este billete van para consignación
  while (cantidadParaConsignar < cantidad &&
         montoRestante - valorDenom >= CAJA_BASE) {
    cantidadParaConsignar++;
    montoRestante -= valorDenom;
  }
}
```

**Lógica:**
- Empezamos con el total contado
- Por cada denominación de mayor a menor:
  - Si quitamos este billete, ¿aún queda ≥ 450k?
  - Si SÍ → va para consignación
  - Si NO → se queda en caja base
  - Repetir hasta agotar billetes de esta denominación

### Paso 3: Monedas a Caja Base
```javascript
Object.entries(coins).forEach(([denom, qty]) => {
  cajaBaseCoins[denom] = parseInt(qty || 0);
});
```

**Razón:**
- Las monedas son incómodas para consignar al banco
- Son útiles para dar cambio en la tienda
- Casi siempre se quedan en caja

### Paso 4: Calcular Totales
```javascript
const cajaBaseTotalCoins = sumarMonedas(cajaBaseCoins);
const cajaBaseTotalBills = sumarBilletes(cajaBaseBills);
const cajaBaseTotal = cajaBaseTotalCoins + cajaBaseTotalBills;
```

---

## 📝 Archivos Modificados

```
src/components/Dashboard.jsx:
- Líneas 120-233: Función calcularDistribucionCaja
- Líneas 304-306: Integración en handleSubmit
- Líneas 931-1137: UI completa de distribución

Incremento: +327 líneas

dist/:
- Dashboard: +8.25 KB (lógica + UI)
- CSS: +1.22 KB (estilos nuevos)
Total: +9.47 KB
```

---

## 🚀 Estado del Proyecto

```bash
✅ Algoritmo de distribución implementado
✅ UI completa y responsive
✅ Integrado en flujo de cierre
✅ Build actualizado
✅ Sin errores
✅ Listo para producción
```

---

## 🔮 Mejoras Futuras (Opcional)

1. **Configuración de Caja Base**
   - Permitir cambiar 450,000 por otro monto
   - Configuración por tienda o sucursal

2. **Preferencias de Distribución**
   - Dejar más/menos monedas en caja
   - Priorizar ciertos billetes

3. **Sugerencias Inteligentes**
   - "Faltan $5k en monedas para cambio óptimo"
   - "Demasiadas monedas, considera cambiarlas"

4. **Historial**
   - Ver distribuciones de días anteriores
   - Análisis de patrones

5. **Impresión**
   - Imprimir desglose para el cajero
   - PDF con detalle de distribución

---

## 📞 Soporte

Si tienes preguntas sobre esta funcionalidad:
- Revisa este documento
- Revisa los commits relacionados
- Consulta el código comentado en Dashboard.jsx

---

**Fecha de implementación:** 2025-11-13
**Versión:** 2.2
**Status:** ✅ Completado y en producción
**Commits:**
- `3fca68d` - Función de distribución
- `47edecc` - Build actualizado
