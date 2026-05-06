# TechLoop & TecMilenio

Una plataforma web que combina dos proyectos en una sola aplicaci&oacute;n:

1. **TechLoop** — Marketplace de electr&oacute;nica circular para comprar, vender, intercambiar o donar equipos tecnol&oacute;gicos.
2. **TecMilenio Recursos Educativos** — Gesti&oacute;n de recursos acad&eacute;micos (apuntes, videos, gu&iacute;as) con b&uacute;squeda en Open Library.

## Tecnolog&iacute;as

| Tecnolog&iacute;a | Versi&oacute;n |
|---|---|
| React | 18.x |
| Vite | 6.x |
| React Router | 6.x |
| React Query | 5.x |
| Tailwind CSS | 3.x |
| shadcn/ui | latest |
| Base44 SDK | 0.8.x |
| Lucide Icons | 0.475.x |

## Estructura del proyecto

```
src/
├── api/                # Cliente Base44
├── components/
│   ├── dashboard/      # Componentes del dashboard educativo
│   ├── explore/        # Componentes de b&uacute;squeda de libros
│   ├── techloop/       # Componentes del marketplace TechLoop
│   ├── ui/             # Componentes shadcn/ui (botones, di&aacute;logos, etc.)
│   ├── upload/         # Formulario de subida de recursos
│   ├── Layout.jsx      # Layout de la secci&oacute;n educativa
│   ├── ProtectedRoute.jsx
│   └── UserNotRegisteredError.jsx
├── hooks/              # Hooks personalizados
├── lib/                # AuthContext, utils, query client, app params
├── pages/
│   ├── techloop/       # P&aacute;ginas del marketplace
│   ├── Dashboard.jsx   # Mis Recursos
│   ├── ExploreAPI.jsx  # Explorar biblioteca
│   └── UploadResource.jsx
└── utils/              # Utilidades
```

## Rutas

| Ruta | Descripci&oacute;n |
|---|---|
| `/` | Marketplace TechLoop (p&aacute;gina principal) |
| `/publish` | Publicar producto en TechLoop |
| `/panel` | Panel de usuario TechLoop |
| `/product/:id` | Detalle de producto |
| `/edu` | Dashboard de recursos educativos |
| `/edu/upload` | Subir recurso educativo |
| `/edu/explore` | Explorar libros en Open Library |

## Requisitos previos

- **Node.js** 18+ 
- **npm** (incluido con Node.js)

## Instalar y ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Configurar variables de entorno
# Crear un archivo .env.local con:
VITE_BASE44_APP_ID=tu_app_id
VITE_BASE44_APP_BASE_URL=tu_backend_url

# 3. Ejecutar en modo desarrollo
npm run dev

# La app estar&aacute; disponible en http://localhost:5173
```

## Scripts disponibles

| Comando | Descripci&oacute;n |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con Vite (HMR) |
| `npm run build` | Genera la compilaci&oacute;n para producci&oacute;n |
| `npm run preview` | Previsualiza la compilaci&oacute;n de producci&oacute;n |
| `npm run lint` | Ejecuta ESLint para verificar errores |
| `npm run lint:fix` | Corrige autom&aacute;ticamente los errores de ESLint |
| `npm run typecheck` | Verifica tipos con TypeScript (jsconfig) |

## Tema de dise&ntilde;o

La app usa un **tema oscuro** con paleta personalizada:

- **Primario:** Verde esmeralda (`#00FF88`)
- **Secundario:** Cyan (`#00CCFF`)
- **Fondo:** Slate oscuro
- **Tipograf&iacute;a:** Space Grotesk (t&iacute;tulos) + Inter (cuerpo)

## Entidades

- **Resource:** Recursos educativos (t&iacute;tulo, tipo, materia, semestre, archivo, etiquetas)
- **Product:** Productos del marketplace (t&iacute;tulo, categor&iacute;a, tipo de transacci&oacute;n, estado, precio, imagen)

## Soporte

- Documentaci&oacute;n: [docs.base44.com](https://docs.base44.com/Integrations/Using-GitHub)
- Soporte: [Base44 Support](https://app.base44.com/support)
