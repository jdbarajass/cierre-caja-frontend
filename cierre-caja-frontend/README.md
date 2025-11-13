# 💼 Sistema de Cierre de Caja - KOAJ Puerto Carreño

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**Sistema web moderno para el arqueo y conciliación diaria de caja de la tienda KOAJ en Puerto Carreño**

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Claude AI](#-integración-con-claude-ai)

</div>

---

## 📋 Descripción

**Cierre de Caja KOAJ** es una aplicación web desarrollada para automatizar y simplificar el proceso diario de cierre de caja de la tienda KOAJ ubicada en Puerto Carreño. El sistema permite registrar el arqueo de efectivo (monedas y billetes), métodos de pago digitales, excedentes y ajustes operativos, y los compara automáticamente con los registros de ventas de **Alegra** para garantizar la precisión y transparencia en la gestión financiera.

### 🎯 Propósito

- **Automatizar** el proceso manual de conteo de caja
- **Conciliar** automáticamente con la plataforma Alegra
- **Detectar** diferencias en métodos de pago (transferencias, datafono)
- **Documentar** gastos operativos y préstamos con notas explicativas
- **Generar** reportes detallados del cierre diario

---

## ✨ Características

### 🔐 Autenticación
- Sistema de login seguro con sesión persistente
- Protección de rutas mediante componentes `ProtectedRoute`
- Manejo automático de sesiones expiradas

### 💰 Gestión de Efectivo
- **Conteo de monedas**: $50, $100, $200, $500, $1.000
- **Conteo de billetes**: $2.000, $5.000, $10.000, $20.000, $50.000, $100.000
- Cálculo automático de totales por denominación
- Formato de moneda en pesos colombianos (COP)

### 💳 Métodos de Pago
- **Transferencias digitales**: Nequi, Daviplata, QR
- **Datafono**: Addi, Tarjetas de débito y crédito
- Comparación automática con registros de Alegra
- Detección de diferencias menores a $100

### 📊 Ajustes y Movimientos
- **Excedentes**: Efectivo, Datafono, Transferencias (hasta 3 simultáneos)
- **Gastos operativos**: Registro con notas explicativas
- **Préstamos**: Registro con notas de respaldo

### 🔄 Integración con Alegra
- Conexión automática con API de Alegra
- Comparación en tiempo real de ventas por método de pago
- Validación de totales de transferencias y datafono
- Modal de confirmación cuando los montos coinciden

### 📱 Diseño Responsive
- Interfaz adaptada para dispositivos móviles, tablets y escritorio
- Diseño moderno con Tailwind CSS
- Iconos profesionales con Lucide React

### 🎨 Interfaz de Usuario
- Gradientes modernos y paleta de colores coherente
- Feedback visual inmediato (carga, éxito, errores)
- Modal de éxito animado
- Reportes detallados con desglose completo

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework de UI |
| **Vite** | 5.0.0 | Build tool y dev server |
| **Tailwind CSS** | 3.4.18 | Framework de estilos |
| **React Router DOM** | 7.9.5 | Enrutamiento SPA |
| **Lucide React** | 0.294.0 | Librería de iconos |
| **PostCSS** | 8.5.6 | Procesamiento de CSS |

---

## 📦 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js) o **yarn**
- **Git** - [Descargar aquí](https://git-scm.com/)
- Un editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

### Paso 1: Clonar el repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/jdbarajass/cierre-caja-frontend.git
cd cierre-caja-frontend
```

### Paso 2: Instalar dependencias

Instala todas las dependencias del proyecto:

```bash
npm install
```

O si prefieres yarn:

```bash
yarn install
```

Este comando instalará:
- React y React DOM
- Vite y plugins de desarrollo
- Tailwind CSS y sus dependencias
- React Router DOM para navegación
- Lucide React para iconos

### Paso 3: Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto para desarrollo local:

```bash
# .env.local
VITE_API_URL=http://localhost:5000
```

Para producción, ya existe el archivo `.env.production` con la URL del backend en Render:

```bash
# .env.production
VITE_API_URL=https://cierre-caja-api.onrender.com
```

> **Nota**: Las variables de entorno en Vite deben comenzar con el prefijo `VITE_` para ser accesibles en el código del cliente.

### Paso 4: Ejecutar en modo desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

Verás un mensaje similar a:

```
  VITE v5.0.0  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Paso 5: Acceder a la aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Serás redirigido a la página de **Login**
3. Usa las credenciales configuradas (verifica `src/contexts/AuthContext.jsx`)

---

## 🚀 Uso

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en modo hot-reload |
| `npm run build` | Crea el build de producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |

### Flujo de Trabajo Típico

1. **Iniciar sesión**: Ingresa tus credenciales en la pantalla de login
2. **Seleccionar fecha**: Elige la fecha del cierre (por defecto es el día actual)
3. **Contar efectivo**: Ingresa las cantidades de monedas y billetes
4. **Registrar métodos de pago**: Anota los montos de transferencias y datafono
5. **Añadir excedentes** (opcional): Registra cualquier excedente de efectivo, datafono o transferencias
6. **Registrar ajustes**: Documenta gastos operativos y préstamos con sus respectivas notas
7. **Realizar cierre**: Haz clic en "Realizar Cierre" para procesar
8. **Revisar resultados**: El sistema mostrará:
   - Comparación con Alegra
   - Total de ventas del día
   - Base de caja y monto a consignar
   - Ajustes aplicados
   - Modal de éxito si los montos coinciden

### Credenciales de Acceso

Por defecto, las credenciales están definidas en `src/contexts/AuthContext.jsx`:

```javascript
Email: @gmail.com
Password: *****
```

> ⚠️ **Importante**: Estas credenciales son de ejemplo. Para producción, debes implementar un sistema de autenticación real con backend.

---

## 🤖 Integración con Claude AI

Este proyecto está optimizado para trabajar con **Claude Code**, el CLI oficial de Anthropic para desarrollo asistido por IA.

### ¿Qué es Claude Code?

Claude Code es una herramienta de línea de comandos que permite a los desarrolladores colaborar con Claude (IA de Anthropic) directamente en su flujo de trabajo de desarrollo. Puede ayudarte a:

- 🔍 Explorar y entender el código
- 🐛 Detectar y corregir bugs
- ✨ Implementar nuevas funcionalidades
- 📝 Escribir documentación
- 🧪 Crear tests
- ♻️ Refactorizar código

### Instalación de Claude Code

#### Opción 1: Instalación con npm (Recomendada)

```bash
npm install -g @anthropic-ai/claude-code
```

#### Opción 2: Instalación con npx (Sin instalación global)

```bash
npx @anthropic-ai/claude-code
```

### Configuración

1. **Obtener API Key de Anthropic**

   - Visita: https://console.anthropic.com/
   - Crea una cuenta o inicia sesión
   - Ve a "API Keys" y genera una nueva key

2. **Configurar Claude Code**

   ```bash
   claude-code config
   ```

   Te pedirá tu API key. Pégala cuando te lo solicite.

3. **Verificar instalación**

   ```bash
   claude-code --version
   ```

### Uso de Claude Code con este Proyecto

Una vez instalado y configurado, abre tu terminal en la raíz del proyecto y ejecuta:

```bash
claude-code
```

Esto iniciará una sesión interactiva donde puedes pedirle a Claude que:

#### Ejemplos de Prompts

**1. Explorar el código:**
```
"Explícame cómo funciona el sistema de autenticación en este proyecto"
```

**2. Implementar funcionalidades:**
```
"Agrega la funcionalidad para exportar los resultados del cierre en formato PDF"
```

**3. Corregir bugs:**
```
"Hay un error al calcular el total de transferencias cuando los valores están vacíos, ¿puedes arreglarlo?"
```

**4. Refactorizar:**
```
"Refactoriza el componente Dashboard para separar la lógica de negocio de la UI"
```

**5. Crear tests:**
```
"Crea tests unitarios para el servicio de API en src/services/api.js"
```

**6. Mejorar el código:**
```
"Revisa el código en busca de problemas de seguridad o mejores prácticas"
```

**7. Añadir documentación:**
```
"Añade comentarios JSDoc a todas las funciones del componente Dashboard"
```

### Comandos Útiles de Claude Code

| Comando | Descripción |
|---------|-------------|
| `/help` | Muestra ayuda sobre comandos disponibles |
| `/clear` | Limpia el historial de conversación |
| `/files` | Muestra archivos del proyecto |
| `/search <término>` | Busca en el código |

### Buenas Prácticas con Claude Code

✅ **Sé específico**: Describe claramente lo que necesitas
```
❌ "Mejora el código"
✅ "Refactoriza la función handleSubmit en Dashboard.jsx para usar async/await en lugar de .then()"
```

✅ **Proporciona contexto**: Menciona archivos relevantes
```
✅ "En el componente Dashboard (src/components/Dashboard.jsx), necesito añadir validación para que no se pueda enviar el formulario si el total de monedas es cero"
```

✅ **Pide explicaciones**: Claude puede enseñarte mientras codifica
```
✅ "Explícame paso a paso cómo funciona el flujo de datos desde que se hace clic en 'Realizar Cierre' hasta que se muestran los resultados"
```

✅ **Itera**: Refina las soluciones con feedback
```
✅ "El código funciona, pero ¿podrías hacerlo más eficiente usando useMemo?"
```

### Recursos Adicionales

- **Documentación oficial**: https://docs.claude.com/
- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code
- **Comunidad**: https://github.com/anthropics/claude-code

---

## 📁 Estructura del Proyecto

```
cierre-caja-frontend/
│
├── public/                 # Archivos públicos estáticos
│   └── vite.svg           # Favicon
│
├── src/
│   ├── components/        # Componentes de React
│   │   ├── Dashboard.jsx  # Componente principal del cierre de caja
│   │   ├── Login.jsx      # Componente de autenticación
│   │   └── ProtectedRoute.jsx  # HOC para proteger rutas
│   │
│   ├── contexts/          # Context API de React
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   │
│   ├── services/          # Servicios y API
│   │   └── api.js         # Cliente HTTP para backend
│   │
│   ├── App.jsx            # Componente raíz con routing
│   ├── main.jsx           # Punto de entrada de React
│   └── index.css          # Estilos globales + Tailwind
│
├── .env.production        # Variables de entorno para producción
├── .gitignore             # Archivos ignorados por Git
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
├── postcss.config.js      # Configuración de PostCSS
├── tailwind.config.js     # Configuración de Tailwind CSS
├── vite.config.js         # Configuración de Vite
└── README.md              # Este archivo
```

---

## 🌐 Deployment

### Build para Producción

```bash
npm run build
```

Esto generará una carpeta `dist/` optimizada para producción.

### Desplegar en PythonAnywhere

Si deseas desplegar en PythonAnywhere:

1. **Crear el build**:
   ```bash
   npm run build
   ```

2. **Añadir al repositorio** (opcional):
   ```bash
   git checkout -b deploy-dist
   git add dist -f
   git commit -m "Add production build for PythonAnywhere"
   git push origin deploy-dist
   ```

3. **Subir a PythonAnywhere**: Sigue las instrucciones de PythonAnywhere para servir archivos estáticos

### Desplegar en Vercel/Netlify

Estos servicios detectan automáticamente proyectos de Vite:

1. Conecta tu repositorio de GitHub
2. El servicio detectará automáticamente:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Configura las variables de entorno (`VITE_API_URL`)
4. Despliega

---

## 🔌 API Backend

Este frontend se conecta a un backend alojado en Render:

**Producción**: `https://cierre-caja-api.onrender.com`

**Local**: `http://localhost:5000` (para desarrollo)

### Endpoints Disponibles

- `POST /sum_payments` - Envía datos del cierre y recibe cálculos + comparación con Alegra

### Lógica de Fallback

El servicio API (`src/services/api.js`) implementa un sistema de fallback:

1. Intenta conectar al backend local (timeout: 5s)
2. Si falla, intenta el backend en producción (timeout: 30s)
3. Si ambos fallan, muestra un error al usuario

---

## 🔒 Seguridad

### Consideraciones Actuales

⚠️ El sistema actual usa autenticación simple con credenciales hardcoded. **Esto es solo para desarrollo/demo**.

### Recomendaciones para Producción

- [ ] Implementar JWT real con backend
- [ ] Añadir refresh tokens
- [ ] Hash de contraseñas con bcrypt
- [ ] HTTPS en todas las conexiones
- [ ] Rate limiting en API
- [ ] Validación de inputs en frontend y backend
- [ ] Content Security Policy (CSP)
- [ ] Autenticación de dos factores (2FA)

---

## 🐛 Troubleshooting

### Error: "No se pudo conectar al servidor"

**Causa**: El backend no está disponible o la URL está mal configurada

**Solución**:
1. Verifica que el backend esté corriendo
2. Revisa la variable `VITE_API_URL` en `.env.local`
3. Comprueba la consola del navegador para más detalles

### Error: "Sesión expirada"

**Causa**: El token de autenticación ha caducado o es inválido

**Solución**:
1. Inicia sesión nuevamente
2. Si persiste, limpia localStorage del navegador

### Los estilos no se cargan

**Causa**: Tailwind no está compilando correctamente

**Solución**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
npm run dev
```

### Puerto 5173 en uso

**Solución**:
```bash
# Especifica otro puerto
npm run dev -- --port 3000
```

---

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y está desarrollado específicamente para **KOAJ Puerto Carreño**.

---

## 📞 Contacto

**Desarrollador**: José Barajas
**GitHub**: [@jdbarajass](https://github.com/jdbarajass)
**Repositorio**: [cierre-caja-frontend](https://github.com/jdbarajass/cierre-caja-frontend)

---

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)
- [Claude AI Documentation](https://docs.anthropic.com/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ para KOAJ Puerto Carreño

</div>
