# Resin Love - Catalogo E-commerce de Resina

Aplicacion web construida con Next.js para exhibir, filtrar y gestionar productos artesanales en resina, con experiencia mobile-first, carrito local y panel administrativo conectado a Supabase.

## Tabla de Contenidos

- Vision del proyecto
- Funcionalidades principales
- Stack tecnico
- Arquitectura y estructura
- Requisitos previos
- Instalacion local
- Configuracion de Supabase
- Variables de entorno
- Scripts disponibles
- SEO y rendimiento
- Despliegue
- Roadmap
- Autor

## Vision del proyecto

Resin Love busca digitalizar la vitrina de un emprendimiento artesanal, permitiendo:

- Mostrar productos con una interfaz atractiva y responsive.
- Facilitar la intencion de compra con carrito y contacto por WhatsApp.
- Administrar el catalogo desde un panel privado sin tocar codigo.

## Funcionalidades principales

- Landing page optimizada para dispositivos moviles.
- Catalogo dinamico con datos desde Supabase.
- Favoritos persistidos en el navegador.
- Carrito persistido en el navegador con resumen de pedido.
- Checkout por WhatsApp con mensaje prearmado.
- Panel admin con login y CRUD de productos.
- Control de acceso para rutas administrativas.
- SEO tecnico con metadata, Open Graph, robots, sitemap y JSON-LD.

## Stack tecnico

- Next.js 15
- React 18
- TypeScript 5
- Tailwind CSS 3
- Supabase (Auth, Postgres, Storage, RLS)
- Zustand (estado local de carrito/favoritos/ui)
- Framer Motion (animaciones)
- ESLint (calidad de codigo)

## Arquitectura y estructura

Arquitectura por dominio (feature-first), separando UI, logica de negocio y acceso a datos.

```text
catalogo-resina/
|-- src/
|   |-- app/
|   |   |-- admin/
|   |   |-- catalogo/
|   |   |-- favoritos/
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |-- components/ui/
|   |-- features/
|   |   |-- admin/
|   |   |-- catalog/
|   |   |-- landing/
|   |-- lib/
|   |   |-- seo/
|   |   |-- supabase/
|   |   |-- utils/
|   |-- store/
|-- public/
|-- supabase_init.sql
|-- .env.example
|-- package.json
```

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Proyecto en Supabase

## Instalacion local

1. Clonar el repositorio.
2. Instalar dependencias.
3. Configurar variables de entorno.
4. Inicializar base de datos en Supabase.
5. Ejecutar entorno de desarrollo.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Aplicacion disponible en:

- http://localhost:3000

## Configuracion de Supabase

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor y ejecutar el contenido de supabase_init.sql.
3. En Authentication, crear el usuario administrador.
4. Verificar que se cree el registro correspondiente en la tabla perfiles.
5. Cargar imagenes al bucket productos o usar URLs externas.

El script SQL incluido crea:

- Tabla perfiles y trigger para sincronizar usuarios de auth.
- Tabla productos con campos para catalogo.
- Politicas RLS para lectura publica y gestion autenticada.
- Bucket de Storage para imagenes.
- Datos semilla de ejemplo.

## Variables de entorno

Define estas variables en .env.local:

- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Ejemplo:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Scripts disponibles

- npm run dev: inicia el entorno de desarrollo.
- npm run build: genera la build de produccion.
- npm run start: sirve la build en produccion.
- npm run lint: ejecuta analisis estatico con ESLint.

## SEO y rendimiento

Implementaciones incluidas:

- Metadata completa para buscadores y redes sociales.
- Open Graph y Twitter Cards.
- robots y sitemap.
- Datos estructurados JSON-LD para Organization e ItemList/Product.
- Renderizado server-side para el catalogo con acceso a datos en servidor.

## Despliegue

Recomendado:

- Vercel para despliegue de Next.js.
- Supabase como backend gestionado.

Pasos generales:

1. Conectar el repositorio en Vercel.
2. Configurar variables de entorno de produccion.
3. Desplegar.
4. Validar login admin, CRUD de productos y flujo de WhatsApp.

## Roadmap

- Integrar pasarela de pagos.
- Mejorar autorizacion por roles con politicas RLS mas estrictas.
- Dashboard con metricas de ventas y conversion.
- PWA y notificaciones.
- Internacionalizacion (i18n).

## Autor

Desarrollado para Resin Love.

Si quieres, puedo continuar con:

- Insignias de GitHub (build, version, licencia).
- Seccion de capturas del producto.
- Plantilla de contribucion y convenciones de commits.
