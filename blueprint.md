
# Blueprint y Checklist del Proyecto: Glittershop

## 1. Introducción

Este documento sirve como un blueprint vivo y una checklist para el desarrollo de la aplicación **Glittershop**. Su propósito es delinear el estado actual del proyecto, definir las funcionalidades futuras y mantener un registro del progreso.

---

## 2. Estado Actual (Lo que hemos completado)

A día de hoy, hemos construido la interfaz de usuario (UI) y la experiencia de usuario (UX) principal de la aplicación utilizando datos estáticos. Esto nos ha permitido establecer un diseño visual cohesivo y flujos de navegación clave antes de integrar la lógica del backend.

- **✅ UI/UX y Diseño Visual:**
  - Se ha establecido una paleta de colores consistente (Azul profundo, Gris claro, Dorado).
  - Se han definido y aplicado las tipografías ('Playfair' para titulares, 'PT Sans' para cuerpo).
  - Se utiliza la librería de componentes `ShadCN` y `Tailwind CSS` para un diseño moderno y responsivo.
  - La estructura general de la aplicación es `mobile-first`.

- **✅ Flujo de Navegación y Páginas Principales:**
  - **Página de Inicio (`/`):** Muestra un hero, colecciones destacadas y productos recomendados.
  - **Página de Tienda (`/shop`):** Presenta una colección de productos con opciones de filtrado y ordenación.
  - **Página de Detalles del Producto (`/products/[id]`):** Vista detallada para cada producto con imágenes, descripción, opciones de selección y reseñas.
  - **Búsqueda de Productos:** Funcionalidad de búsqueda en la barra de navegación que muestra resultados en la página principal. Incluye una vista para "resultados encontrados" y "sin resultados".

- **✅ Flujo de Compra (Checkout):**
  - **Carrito de Compras (`/cart`):** Página que muestra los productos añadidos, con resumen de costos y un botón de pago pegajoso (sticky).
  - **Página de Envío (`/shipping`):** Formulario para que el usuario introduzca su información de envío.
  - **Página de Pago (`/payment`):** Selección de método de pago y resumen final del pedido.
  - **Página de Confirmación (`/confirmation`):** Vista de agradecimiento que resume la compra realizada.

- **✅ Gestión de Usuario (Estático):**
  - **Páginas de Login y Registro (`/login`, `/register`):** Formularios de interfaz para el inicio de sesión y la creación de cuentas.
  - **Página de Perfil (`/profile`):** Muestra información estática del usuario, como historial de pedidos y recompensas.

---

## 3. Desarrollo Futuro y Checklist

Esta sección describe las funcionalidades que se implementarán a continuación para dar vida a la aplicación, conectándola a servicios de backend y añadiendo lógica dinámica.

### 3.1. Integración de Backend (Supabase)

- **[ ] Configuración de la Base de Datos (Supabase DB - PostgreSQL):**
  - `[ ]` Definir el esquema de la tabla `products` (nombre, precio, descripción, imágenes, stock, etc.).
  - `[ ]` Definir el esquema de la tabla `user_profiles` (nombre, email, direcciones, etc.).
  - `[ ]` Definir el esquema de la tabla `orders` y `order_items`.
  - `[ ]` Cargar los datos iniciales de los productos.

- **[ ] Autenticación de Usuarios (Supabase Auth):**
  - `[ ]` Implementar la lógica de registro con email/contraseña.
  - `[ ]` Implementar la lógica de inicio de sesión con email/contraseña.
  - `[ ]` Integrar proveedores de inicio de sesión social (Google, Apple).
  - `[ ]` Gestionar las sesiones de usuario y proteger las rutas (perfil, historial de pedidos).
  - `[ ]` Crear un perfil de usuario en la base de datos tras el registro.

- **[ ] Funcionalidad Dinámica:**
  - `[ ]` **Catálogo Dinámico:** Modificar las páginas `/`, `/shop` y `/products/[id]` para obtener los datos de los productos desde Supabase en lugar del archivo estático `products.ts`.
  - `[ ]` **Carrito de Compras Dinámico:**
    - `[ ]` Almacenar y gestionar los artículos del carrito en la base de datos, asociados al ID del usuario.
    - `[ ]` Reflejar el estado del carrito en tiempo real.
  - `[ ]` **Perfil de Usuario Dinámico:** La página `/profile` debe obtener y mostrar los datos reales del usuario autenticado (nombre, historial de pedidos, direcciones).
  - `[ ]` **Persistencia de Órdenes:** Al completar un pago, guardar la orden y sus detalles en la base de datos.

### 3.2. Integración de Servicios Externos

- **[ ] Pasarela de Pagos (Stripe / Mercado Pago):**
  - `[ ]` Crear una Edge Function en Supabase para procesar los pagos de forma segura.
  - `[ ]` Integrar el SDK de la pasarela de pago en el frontend (`/payment`) para recopilar la información de pago.

- **[ ] Búsqueda Inteligente (Algolia):**
  - `[ ]` Configurar la sincronización entre la base de datos de Supabase y un índice de Algolia.
  - `[ ]` Reemplazar la búsqueda actual del lado del cliente por llamadas a la API de Algolia para obtener resultados más rápidos y relevantes.

- **[ ] Alojamiento de Imágenes (Supabase Storage):**
  - `[ ]` Migrar las URLs de las imágenes de productos a Supabase Storage para un alojamiento y servicio optimizado.

- **[ ] Correos Transaccionales (SendGrid):**
  - `[ ]` Configurar una Edge Function para enviar correos electrónicos (confirmación de orden, bienvenida) utilizando SendGrid.

### 3.3. Mejoras y Funcionalidades Adicionales

- **[ ] Pruebas y Optimización:**
  - `[ ]` Escribir pruebas para las funcionalidades críticas.
  - `[ ]` Optimizar el rendimiento de carga de las páginas (imágenes, bundles de JS).
  - `[ ]` Realizar pruebas de accesibilidad (A11y).
