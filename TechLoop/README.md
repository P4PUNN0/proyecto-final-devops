# TechLoop - Mercado de Electrónica Circular

TechLoop es una plataforma web que promueve la economía circular en el ámbito de la electrónica. Permite a los usuarios comprar, vender, intercambiar o donar equipos electrónicos, contribuyendo a reducir la basura electrónica y dar una segunda vida al hardware.

## Características Principales

### 1. Autenticación de Usuarios
- **Inicio de sesión con Google** integrado con Firebase Authentication
- **Registro y login con email/contraseña**
- Rutas protegidas para usuarios autenticados
- Persistencia de sesión

### 2. Marketplace
- **Visualización de productos** en un grid responsivo
- **Búsqueda de productos** por nombre o descripción
- **Filtros avanzados:**
  - Por tipo de oferta: Venta, Intercambio, Donación
  - Por categoría: Laptops, Componentes, Periféricos, Consolas, Gadgets
  - Por ciudad: Todos los estados de la República Mexicana
- **Tarjetas de producto** con imagen, precio, tipo y ubicación
- **Estado vacío** con mensajes personalizados según los filtros aplicados

### 3. Publicación de Productos
- **Formulario completo** para publicar equipos:
  - Nombre, marca, modelo
  - Categoría y estado (Nuevo, Usado, Para refaccionar)
  - Tipo de movimiento (Venta, Intercambio, Donación)
  - Precio (solo para ventas)
  - Ciudad (selector de estados de México)
  - Información de contacto (teléfono o red social)
  - Subida de imagen del producto
- **Interfaz drag & drop** para subir imágenes
- **Validación de formulario** antes de publicar

### 4. Detalle de Producto
- **Vista completa del producto** con imagen ampliada
- **Información detallada:** categoría, marca, modelo, ciudad, descripción
- **Contacto directo con el vendedor** mediante formulario
- **Guardar productos** como favoritos

### 5. Mi Panel (Dashboard)
- **Gestión de productos publicados:**
  - Ver lista de productos propios
  - Eliminar productos
  - Ver detalles de cada publicación
- **Gestión de contactos recibidos:**
  - Ver mensajes de interesados
  - Información del contacto (nombre, email, mensaje)
  - Fecha del contacto

### 6. Interfaz de Usuario
- **Diseño moderno** con tema oscuro y acentos en verde neón
- **Totalmente responsivo** para móviles y tablets
- **Navegación intuitiva** con header sticky
- **Feedback visual** en hover, active y estados de carga

## Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de JavaScript para construir la UI
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento del lado del cliente
- **Firebase** - Autenticación con Google y Email/Password

### Estilos
- **CSS personalizado** con variables CSS (Custom Properties)
- **Grid y Flexbox** para layouts responsivos
- **Transiciones y animaciones** suaves

### Almacenamiento (Demo)
- **LocalStorage** - Para persistencia de datos sin backend
- Preparado para integración con API REST

## Estructura del Proyecto

```
TechLoop/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Barra de navegación
│   │   │   ├── Header.css
│   │   │   ├── ProductCard.jsx   # Tarjeta de producto
│   │   │   └── ProductCard.css
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Página de autenticación
│   │   │   ├── Login.css
│   │   │   ├── Marketplace.jsx   # Página principal
│   │   │   ├── Marketplace.css
│   │   │   ├── Publish.jsx       # Publicar productos
│   │   │   ├── Publish.css
│   │   │   ├── ProductDetail.jsx # Detalle de producto
│   │   │   ├── ProductDetail.css
│   │   │   ├── Dashboard.jsx     # Mi Panel
│   │   │   └── Dashboard.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Contexto de autenticación
│   │   ├── firebase/
│   │   │   └── config.js         # Configuración de Firebase
│   │   ├── services/
│   │   │   └── api.js            # Servicios de API
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Estilos globales
│   ├── .env                       # Variables de entorno
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Configuración e Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/P4PUNN0/proyecto-final-devops.git
cd "Proyecto final DevOps/TechLoop/frontend"
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crear un archivo `.env` en la carpeta `frontend` con:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_API_URL=http://localhost:3001
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

5. **Abrir en el navegador:**
```
http://localhost:3000
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Vite
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción localmente

## Funcionalidades por Implementar (Futuro)

- [ ] Integración con backend real (AWS Lambda + API Gateway)
- [ ] Subida de imágenes a AWS S3
- [ ] Chat en tiempo real entre compradores y vendedores
- [ ] Sistema de calificaciones y reseñas
- [ ] Notificaciones push
- [ ] Pasarela de pagos para ventas seguras
- [ ] Búsqueda avanzada con más filtros
- [ ] Geolocalización y mapas para ubicación de productos

## Configuración de Firebase

El proyecto utiliza Firebase para la autenticación. Para configurar tu propio proyecto:

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar "Authentication" y activar los proveedores:
   - Google
   - Email/Password
3. Copiar la configuración web y pegarla en el archivo `.env`

## Demo y Pruebas

Para probar la aplicación sin backend:

1. Inicia sesión con Google o regístrate
2. Ve a "Publicar" y llena el formulario (incluye imagen)
3. El producto se guardará en localStorage
4. Ve al Marketplace para ver tu producto
5. Haz clic en el producto para ver detalles
6. Prueba el formulario de contacto
7. Ve a "Mi Panel" para gestionar tus productos y ver contactos

## Contribución

Este es un proyecto desarrollado como parte del curso de DevOps. Las contribuciones son bienvenidas mediante pull requests.

## Licencia

MIT License - Proyecto educativo para fines de aprendizaje.

---

**Desarrollado con ❤️ para promover la electrónica circular**
