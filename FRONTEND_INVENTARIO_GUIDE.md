# Guía de Implementación - Sección de Inventario (Frontend)

## 📋 Resumen

Se ha implementado un **sistema completo de análisis de inventario** en el backend. Necesitamos que implementes una nueva sección en el frontend llamada **"Inventario"** que consuma estos endpoints y muestre la información de manera visual y útil.

---

## 🎯 Objetivos de la Sección

1. **Vista de Resumen Ejecutivo**: Dashboard con métricas principales del inventario
2. **Análisis por Departamento**: Desglose visual por HOMBRE, MUJER, NIÑO, NIÑA
3. **Alertas de Stock**: Productos sin stock y con bajo stock
4. **Top Productos**: Productos con mayor valor en inventario
5. **Análisis ABC**: Clasificación de productos según su valor
6. **Filtros y Búsqueda**: Permitir filtrar por categoría, talla, departamento

---

## 🔐 Autenticación

**IMPORTANTE**: Todos los endpoints requieren autenticación JWT.

```javascript
// Headers requeridos en cada petición
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📡 Endpoints Disponibles

### Base URL
```
http://localhost:5000/api/inventory
```

### 1. GET `/api/inventory/summary`
**Resumen Ejecutivo del Inventario**

**Uso recomendado**: Dashboard principal, tarjetas de métricas

**Respuesta**:
```json
{
  "success": true,
  "summary": {
    "total_items": 25,
    "total_items_con_stock": 7,
    "total_unidades": 22,
    "valor_total_inventario": 1505850,
    "valor_potencial_venta": 2007800,
    "margen_esperado": 501950,
    "porcentaje_margen": 25.0,
    "costo_promedio_por_unidad": 68447.73,
    "precio_promedio_venta": 91263.64
  }
}
```

**Sugerencias de UI**:
- Tarjetas de métricas (Cards) con iconos
- Indicador de margen con color (verde si >20%, amarillo 10-20%, rojo <10%)
- Gráfico de comparación valor inventario vs valor potencial venta

---

### 2. GET `/api/inventory/by-department`
**Análisis por Departamento**

**Uso recomendado**: Vista de departamentos, gráficos de distribución

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "HOMBRE": {
      "total_items": 25,
      "total_unidades": 22,
      "valor_inventario": 1505850,
      "valor_potencial_venta": 2007800,
      "margen": 501950,
      "por_categoria": {
        "BERMUDA": {
          "total_items": 7,
          "total_unidades": 22,
          "valor_inventario": 1505850
        },
        "CAMISA": {
          "total_items": 10,
          "total_unidades": 35,
          "valor_inventario": 850000
        }
      }
    },
    "MUJER": {
      "total_items": 15,
      "total_unidades": 45,
      "valor_inventario": 980000,
      "valor_potencial_venta": 1250000,
      "margen": 270000,
      "por_categoria": {}
    }
  }
}
```

**Sugerencias de UI**:
- Gráfico de torta/dona mostrando distribución de valor por departamento
- Cards expandibles por departamento
- Al expandir, mostrar desglose por categoría en tabla o gráfico de barras
- Colores distintivos por departamento:
  - HOMBRE: Azul (#3B82F6)
  - MUJER: Rosa (#EC4899)
  - NIÑO: Verde (#10B981)
  - NIÑA: Morado (#A855F7)

---

### 3. GET `/api/inventory/analysis`
**Análisis Completo (TODO EN UNO)**

**Uso recomendado**: Vista detallada completa, exportar reportes

**Respuesta**: Combina TODA la información en una sola petición
```json
{
  "success": true,
  "data": {
    "resumen_ejecutivo": { /* mismo que /summary */ },
    "por_departamento": { /* mismo que /by-department */ },
    "por_categoria": [ /* array de categorías */ ],
    "por_talla": [ /* array de tallas */ ],
    "productos_sin_stock": [ /* array de productos */ ],
    "productos_bajo_stock": [ /* array de productos */ ],
    "top_productos_por_valor": [ /* array de productos */ ],
    "abc_analysis": { /* análisis ABC */ }
  }
}
```

**Sugerencias de UI**:
- Usar este endpoint para cargar toda la información de una vez
- Perfecto para generar reportes PDF o Excel
- Dashboard completo con múltiples secciones

---

### 4. GET `/api/inventory/by-category`
**Análisis por Categoría**

**Respuesta**:
```json
{
  "success": true,
  "categories": [
    {
      "categoria": "BERMUDA",
      "total_items": 25,
      "total_unidades": 22,
      "valor_inventario": 1505850,
      "porcentaje_valor": 45.5
    },
    {
      "categoria": "CAMISA",
      "total_items": 18,
      "total_unidades": 50,
      "valor_inventario": 980000,
      "porcentaje_valor": 30.2
    }
  ]
}
```

**Sugerencias de UI**:
- Tabla ordenable por valor/cantidad
- Gráfico de barras horizontales
- Filtro de búsqueda por nombre de categoría

---

### 5. GET `/api/inventory/by-size`
**Análisis por Talla**

**Respuesta**:
```json
{
  "success": true,
  "sizes": [
    {
      "talla": "28",
      "total_unidades": 17,
      "valor_inventario": 1183725,
      "cantidad_items": 5
    },
    {
      "talla": "S",
      "total_unidades": 2,
      "valor_inventario": 134850,
      "cantidad_items": 4
    }
  ]
}
```

**Sugerencias de UI**:
- Gráfico de barras mostrando distribución de tallas
- Útil para identificar tallas con exceso o falta de stock
- Ordenar por cantidad de unidades (descendente)

---

### 6. GET `/api/inventory/out-of-stock`
**Productos Sin Stock**

**Respuesta**:
```json
{
  "success": true,
  "total": 18,
  "products": [
    {
      "id": "1596",
      "nombre": "BERMUDA 109900 / 1051421099028",
      "categoria": "BERMUDA",
      "departamento": "HOMBRE",
      "precio_venta": 109900
    }
  ]
}
```

**Sugerencias de UI**:
- **Alerta visual destacada** (badge rojo con número de productos)
- Tabla con opción de exportar lista
- Botón de acción "Solicitar reabastecimiento"
- Filtros por departamento/categoría

---

### 7. GET `/api/inventory/low-stock?threshold=5`
**Productos con Bajo Stock**

**Query Parameters**:
- `threshold` (opcional, default: 5): Umbral de stock bajo

**Respuesta**:
```json
{
  "success": true,
  "threshold": 5,
  "total": 6,
  "products": [
    {
      "id": "1598",
      "nombre": "BERMUDA 109900 / 1051421099032",
      "categoria": "BERMUDA",
      "departamento": "HOMBRE",
      "cantidad_disponible": 1,
      "precio_venta": 109900
    }
  ]
}
```

**Sugerencias de UI**:
- Alerta amarilla/naranja en dashboard
- Input para ajustar el threshold dinámicamente
- Tabla ordenada por cantidad (ascendente)
- Icono de advertencia por producto

---

### 8. GET `/api/inventory/top-by-value?limit=20`
**Top Productos por Valor de Inventario**

**Query Parameters**:
- `limit` (opcional, default: 20): Cantidad de productos

**Respuesta**:
```json
{
  "success": true,
  "limit": 20,
  "total": 7,
  "products": [
    {
      "id": "1160",
      "nombre": "BERMUDA 99900 / 1051429990028",
      "categoria": "BERMUDA",
      "departamento": "HOMBRE",
      "cantidad": 13,
      "costo_unitario": 74925,
      "precio_venta": 99900,
      "valor_inventario": 974025,
      "valor_potencial_venta": 1298700
    }
  ]
}
```

**Sugerencias de UI**:
- Tabla con ranking (posición 1, 2, 3...)
- Barra de progreso mostrando % del valor total
- Selector de límite (Top 10, Top 20, Top 50)
- Columna calculada de margen

---

### 9. GET `/api/inventory/abc-analysis`
**Análisis ABC (Pareto)**

**Concepto**: Clasifica productos según su contribución al valor total:
- **Clase A**: ~20% de productos = ~80% del valor (CRÍTICOS)
- **Clase B**: ~30% de productos = ~15% del valor (IMPORTANTES)
- **Clase C**: ~50% de productos = ~5% del valor (NORMALES)

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "clase_A": {
      "cantidad_items": 2,
      "porcentaje_items": 28.57,
      "valor_inventario": 1183725,
      "porcentaje_valor": 78.61
    },
    "clase_B": {
      "cantidad_items": 3,
      "porcentaje_items": 42.86,
      "valor_inventario": 217275,
      "porcentaje_valor": 14.43
    },
    "clase_C": {
      "cantidad_items": 2,
      "porcentaje_items": 28.57,
      "valor_inventario": 104850,
      "porcentaje_valor": 6.96
    }
  }
}
```

**Sugerencias de UI**:
- Gráfico de torta con 3 secciones (A, B, C)
- Colores: A = Rojo (#EF4444), B = Amarillo (#F59E0B), C = Verde (#10B981)
- Tooltip explicando qué significa cada clase
- Tarjetas mostrando % de items vs % de valor

---

## 🎨 Propuesta de Estructura UI

### Página Principal: `/inventario`

```
┌─────────────────────────────────────────────────────────┐
│  INVENTARIO                                    [Exportar PDF] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 RESUMEN EJECUTIVO                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Items    │ │ Unidades │ │ Valor    │ │ Margen   │  │
│  │   25     │ │    22    │ │ $1.5M    │ │   25%    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  ⚠️  ALERTAS                                            │
│  [ 18 productos sin stock ]  [ 6 productos bajo stock ] │
│                                                          │
│  📈 DISTRIBUCIÓN POR DEPARTAMENTO                       │
│  [Gráfico de torta/dona]                                │
│                                                          │
│  🏆 TOP PRODUCTOS POR VALOR                             │
│  [Tabla con top 10 productos]                           │
│                                                          │
│  📋 ANÁLISIS ABC                                        │
│  [Gráfico + cards explicativas]                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Tabs/Secciones Sugeridas:

1. **Dashboard** (vista principal con resumen)
2. **Departamentos** (desglose por HOMBRE/MUJER/NIÑO/NIÑA)
3. **Categorías** (análisis por categoría de producto)
4. **Tallas** (distribución por tallas)
5. **Alertas** (stock bajo + sin stock)
6. **Reportes** (análisis ABC + top productos)

---

## 💻 Ejemplo de Implementación (React/Vue)

### React con Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/inventory';

// Servicio de inventario
export const inventoryService = {
  // Obtener resumen
  getSummary: async (token) => {
    const response = await axios.get(`${API_BASE}/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  // Obtener análisis completo
  getFullAnalysis: async (token) => {
    const response = await axios.get(`${API_BASE}/analysis`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  // Obtener por departamento
  getByDepartment: async (token) => {
    const response = await axios.get(`${API_BASE}/by-department`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  // Productos con bajo stock
  getLowStock: async (token, threshold = 5) => {
    const response = await axios.get(`${API_BASE}/low-stock`, {
      params: { threshold },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }
};
```

### Componente de Dashboard

```jsx
import React, { useState, useEffect } from 'react';
import { inventoryService } from './services/inventory';

function InventoryDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // o desde tu state management

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await inventoryService.getSummary(token);
        setSummary(data.summary);
      } catch (error) {
        console.error('Error cargando inventario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="inventory-dashboard">
      <h1>Inventario</h1>

      <div className="metrics-grid">
        <MetricCard
          title="Total Items"
          value={summary.total_items}
          icon="📦"
        />
        <MetricCard
          title="Valor Total"
          value={`$${summary.valor_total_inventario.toLocaleString()}`}
          icon="💰"
        />
        <MetricCard
          title="Margen"
          value={`${summary.porcentaje_margen}%`}
          icon="📈"
          color={summary.porcentaje_margen > 20 ? 'green' : 'yellow'}
        />
      </div>

      {/* Más componentes aquí... */}
    </div>
  );
}
```

---

## 📊 Librerías Recomendadas para Gráficos

### React
- **Chart.js** + react-chartjs-2: Gráficos versátiles y bonitos
- **Recharts**: Gráficos declarativos con React
- **Victory**: Gráficos composables

### Vue
- **Vue-ChartJS**: Wrapper de Chart.js para Vue
- **ApexCharts**: Gráficos interactivos modernos

### Ejemplo con Chart.js:
```jsx
import { Pie } from 'react-chartjs-2';

function DepartmentChart({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data).map(d => d.valor_inventario),
      backgroundColor: [
        '#3B82F6', // HOMBRE
        '#EC4899', // MUJER
        '#10B981', // NIÑO
        '#A855F7'  // NIÑA
      ]
    }]
  };

  return <Pie data={chartData} />;
}
```

---

## 🎨 Paleta de Colores Sugerida

```css
/* Departamentos */
--color-hombre: #3B82F6;      /* Azul */
--color-mujer: #EC4899;       /* Rosa */
--color-nino: #10B981;        /* Verde */
--color-nina: #A855F7;        /* Morado */

/* Estados */
--color-success: #10B981;     /* Verde */
--color-warning: #F59E0B;     /* Amarillo */
--color-danger: #EF4444;      /* Rojo */
--color-info: #3B82F6;        /* Azul */

/* ABC */
--color-clase-a: #EF4444;     /* Rojo - Crítico */
--color-clase-b: #F59E0B;     /* Amarillo - Importante */
--color-clase-c: #10B981;     /* Verde - Normal */
```

---

## 🔄 Manejo de Errores

Todos los endpoints pueden retornar estos errores:

```json
// Error de autenticación
{
  "success": false,
  "error": "Token inválido o expirado"
}

// Error de conexión con Alegra
{
  "success": false,
  "error": "Error de conexión con Alegra",
  "details": "..."
}

// Error del servidor
{
  "success": false,
  "error": "Error interno del servidor",
  "details": "..."
}
```

**Manejo recomendado**:
```javascript
try {
  const data = await inventoryService.getSummary(token);
  // Usar data...
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado - redirigir a login
    redirectToLogin();
  } else if (error.response?.status === 502) {
    // Error de Alegra - mostrar mensaje
    showError('No se pudo conectar con el sistema de inventario');
  } else {
    // Error genérico
    showError('Ocurrió un error al cargar el inventario');
  }
}
```

---

## ✅ Checklist de Implementación

### Fase 1: Estructura Básica
- [ ] Crear ruta `/inventario` en el router
- [ ] Crear componente principal `InventoryPage`
- [ ] Implementar servicio de API con axios/fetch
- [ ] Configurar autenticación JWT en headers

### Fase 2: Dashboard
- [ ] Implementar cards de resumen ejecutivo
- [ ] Crear componente de alertas (stock bajo + sin stock)
- [ ] Agregar gráfico de departamentos (torta/dona)
- [ ] Mostrar top 5 productos

### Fase 3: Vistas Detalladas
- [ ] Tab/página de departamentos con desglose
- [ ] Tab/página de categorías
- [ ] Tab/página de tallas
- [ ] Tab/página de análisis ABC

### Fase 4: Funcionalidades Avanzadas
- [ ] Filtros por departamento/categoría
- [ ] Búsqueda de productos
- [ ] Exportar a PDF/Excel
- [ ] Refresh automático (cada 5 minutos)
- [ ] Loading states y skeletons

### Fase 5: Optimizaciones
- [ ] Caché de datos (React Query / SWR)
- [ ] Lazy loading de componentes
- [ ] Animaciones y transiciones
- [ ] Modo responsive (mobile-first)

---

## 📱 Consideraciones Responsive

**Mobile (< 768px)**:
- Métricas en cards verticales (stack)
- Gráficos de torta convertir a lista con barras
- Tablas convertir a cards colapsables
- Tabs convertir a acordeón

**Tablet (768px - 1024px)**:
- Métricas en grid de 2x2
- Gráficos de tamaño medio
- Tablas con scroll horizontal

**Desktop (> 1024px)**:
- Métricas en grid de 4 columnas
- Gráficos de tamaño completo
- Tablas completas

---

## 🚀 Bonus: Features Opcionales

1. **Predicción de Reabastecimiento**: Basado en histórico de ventas
2. **Comparación Temporal**: Ver evolución del inventario mes a mes
3. **Notificaciones Push**: Alertar cuando un producto llegue a stock crítico
4. **Escaneo de Código de Barras**: Búsqueda rápida por SKU
5. **Integración con Ventas**: Mostrar productos más vendidos vs stock actual

---

## 📞 Contacto y Soporte

Si tienes dudas sobre la estructura de datos o necesitas endpoints adicionales, contacta al equipo de backend.

**Endpoints en Producción**:
- Actualizar la URL base cuando se despliegue a producción
- Asegurar CORS configurado correctamente

---

## 📝 Notas Finales

- Todos los valores monetarios están en **pesos colombianos (COP)**
- Las fechas/timestamps están en formato UTC
- Los IDs de productos son strings (no números)
- El campo `departamento` puede ser: HOMBRE, MUJER, NIÑO, NIÑA, UNKNOWN
- La talla puede variar: números (28, 30, 32), letras (S, M, L, XL), o combinaciones

**¡Éxito con la implementación!** 🎉
