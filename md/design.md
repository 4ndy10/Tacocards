# TacoCards Tijuana — Documento de Diseño y Hoja de Ruta

Este documento centraliza las especificaciones funcionales, de diseño y arquitectura para el MVP de **TacoCards Tijuana**, garantizando una experiencia *mobile-first* fluida, táctil, accesible y con alto impacto visual para presentaciones y validación de negocio.

---

## Fase 4: Refinamiento UI/UX y Lógica de Negocio

Esta fase comprende las mejoras directas a la experiencia de usuario (UX), refinamiento de la interfaz visual (UI), consistencia en la navegación táctil y consolidación de la lógica de negocio simulada para el pitch.

---

### 1. Mapa Interactivo y Visualización Urbana

#### 1.1 Estilo Visual Invertido (Fondo Claro con Calles Oscuras)
* **Objetivo:** Mejorar el contraste urbano y la legibilidad en condiciones de luz solar directa (uso típico en exteriores/móvil).
* **Especificaciones:**
  * **Fondo del mapa:** Cambiar la estética oscura nocturna a una base cálida clara (`#F4EADC` / `#EFE1D1`), en coherencia con la paleta de marca.
  * **Trazado de calles y avenidas:** Las carreteras y ejes viales principales (Paseo del Río, Blvd. Sánchez Taboada, Av. Revolución) se representarán en tonalidades oscuras de alto contraste (`#2F251E` con bordes `#4A3A2F`), logrando un estilo cartográfico editorial legible.
  * **Etiquetas de zonas:** Nombres de colonias ("Zona Río", "Centro", "Av. Revolución") con tipografía en color marrón oscuro (`#2A1A0E`) y tamaño mínimo de 12px con tracking moderado.

#### 1.2 Sección Inferior "Lugares para Descubrir"
* **Objetivo:** Guiar la exploración de locales gastronómicos sin depender exclusivamente del toque directo sobre los pines.
* **Especificaciones:**
  * Debajo del mapa se implementará un carrusel horizontal con scroll táctil suave (`scroll-snap-type: x mandatory`).
  * Cada tarjeta de local mostrará:
    * Fotografía optimizada en miniatura (aspect ratio 1:1 o 4:3).
    * Nombre comercial, categoría y zona.
    * Estado de operación en tiempo real ("Abierto ahora", "Cierra pronto").
    * Distancia estimada y rareza de la carta coleccionable.
  * Al desplazarse o seleccionar un elemento del carrusel, el mapa centrará y activará automáticamente el pin correspondiente.

#### 1.3 Bloqueo / Activación de "Rutas por Colonia"
* **Lógica de negocio:**
  * **Plan Gratuito:** El botón flotante de "Rutas por colonia" muestra un icono de candado (`lock`) y la etiqueta `"Con el Pase"`. Al pulsarlo, no realiza navegación accidental; despliega el modal de suscripción al Pase Taquero.
  * **Plan Premium:** El botón se activa visualmente con resplandor dorado (`--gold`). Al pulsarlo, dibuja en el mapa el trazado de la ruta gastronómica recomendada conectando los locales destacados.

#### 1.4 Ergonomía de Filtros Superiores
* **Especificaciones UI/UX:**
  * Incrementar el tamaño tipográfico de los chips ("Todos", "Tacos", "Birria", "Mariscos", "Postres") de 11px a **14px** con peso font-weight de 700.
  * Área de toque mínima garantizada de **44px de altura** para cumplir con las directrices de accesibilidad móvil (WCAG / Apple HIG).

#### 1.5 Reactividad del Estado (Cero Recargas de Página)
* **Comportamiento técnico:**
  * Al tocar un pin en el mapa, la actualización de la tarjeta de vista previa inferior debe ser **instantánea (<50ms)** mediante manipulación reactiva del DOM.
  * Queda estrictamente prohibido re-renderizar todo el árbol o provocar saltos visuales; únicamente se intercambian las clases `.selected` de los pines y el contenido del contenedor de previsualización.

---

### 2. Iconografía Semántica y Marcadores de Mapa

#### 2.1 Sustitución de Pines Genéricos por Iconos Temáticos
* **Problema actual:** Todos los locales utilizan un pin idéntico con rotación de 45 grados, obligando al usuario a leer el texto para conocer el tipo de comida.
* **Solución:** Reemplazar el icono genérico por **SVGs semánticos vectoriales inline** representativos de la oferta gastronómica del negocio:
  * **Taquerías:** Silueta icónica de taco doblado o trompo de pastor tradicional.
  * **Birrierías:** Silueta de chivo / cabeza de res u olla tradicional de barro humeante.
  * **Marisquerías:** Silueta de pez o concha marina estilizada.
  * **Torterías y Fondas:** Silueta de torta clásica o juego de cubiertos artesanales.
  * **Reposterías y Cafés:** Silueta de rebanada de pastel o nube de dulce.

#### 2.2 Estados del Marcador en Pantalla
* **Estado Reposo:** Diámetro de 38px, fondo diferenciado por categoría culinaria, silueta SVG en color blanco.
* **Estado Seleccionado:** Escala aumentada a **1.25x**, borde exterior con halo dorado brillante (`box-shadow: 0 0 0 6px rgba(220, 180, 93, 0.3)`), y elevación en el eje z (`z-index: 20`).
* **Estado Destacado (Pase Taquero):** Marcador dorado con destello constante para resaltar locales patrocinados dentro de las rutas.

---

### 3. Álbum, Colección, Cupones y Lightbox

#### 3.1 Corrección del Lightbox de Cartas 3D
* **Problema actual:** En pantallas de dispositivos compactos (ej. 375px a 390px), los bordes o esquinas de la carta quedan truncados o el giro 3D colisiona con el contenedor modal.
* **Especificaciones de corrección:**
  * El contenedor `.card-lightbox` ocupará el viewport completo con fondo traslúcido y desenfoque (`backdrop-filter: blur(12px)`).
  * El modal `.card-modal` tendrá dimensiones máximas controladas: `width: min(300px, 82vw); aspect-ratio: 5 / 7;`.
  * Se preservará la perspectiva 3D (`perspective: 1200px`) y `transform-style: preserve-3d` asegurando que tanto el frente como el reverso sean legibles al 100% sin barras de scroll interno ni desbordamientos.

#### 3.2 Filtros y Ordenamiento Funcional en el Álbum
* **Lógica de ordenamiento:**
  * Implementar menú desplegable o selector de pestañas para ordenar la cuadrícula de cartas:
    1. **Por Rareza:** Legendarias $\rightarrow$ Épicas $\rightarrow$ Raras $\rightarrow$ Comunes.
    2. **Por Número Oficial:** De `#001/200` a `#200/200`.
    3. **Por Nombre:** Orden alfabético A-Z.
    4. **Por Estado:** Desbloqueadas primero / Bloqueadas al final.
  * La reorganización de la cuadrícula se ejecutará en memoria sin recargar el contenedor principal.

#### 3.3 Compartir Dinámico con Texto Enriquecido
* **Especificaciones:**
  * Al pulsar el botón "Compartir" en el lightbox de una carta:
    * Se invocará la **Web Share API nativa** (`navigator.share`) si está disponible en el dispositivo móvil; en caso contrario, se copiará al portapapeles con feedback visual en el botón ("¡Copiado!").
    * **Plantilla de texto enriquecido:**
      > *"🌮 ¡Descubrí la historia de [Nombre del Local] en TacoCards Tijuana! Coleccioné su carta [Rareza] [Número]. Conoce su platillo estrella [Especialidad] aquí: [URL]"*

#### 3.4 Vista Funcional de la Cuponera
* **Especificaciones:**
  * Vincular y dotar de interacción completa a la pestaña/botón **"Cupones"** del álbum.
  * Si el usuario es **Premium**, cada cupón desplegará:
    * Porcentaje o beneficio claro (ej. "2x1", "15% OFF", "+$0 Extra").
    * Nombre del local participante y fecha límite de vigencia.
    * Botón de acción **"Usar cupón"** que genera un código de un solo uso para mostrador.
  * Si el usuario es **Free**, la sección mostrará un estado difuminado con llamada a la acción para suscribirse al Pase Taquero.

---

### 4. Fidelidad y Validación Pasiva en Caja

#### 4.1 Registro Dinámico y Secuencial de Visitas (1 a 8)
* **Lógica de acumulación:**
  * Sustituir el estado rígido de demo por un contador dinámico que avance de forma secuencial del sello 1 al 8.
  * **Hitos de recompensa:**
    * **Visita 1 y 2:** Estado de descubrimiento inicial.
    * **Visita 3:** Desbloqueo definitivo de la tarjeta de fidelidad del local.
    * **Visita 4:** Sello de premio intermedio (Premio 1: ej. 1 taco de asada de cortesía).
    * **Visitas 5 a 7:** Sellos de cliente recurrente.
    * **Visita 8:** Sello de gran premio (Premio 2: ej. 1 orden completa de la casa).

#### 4.2 Enfoque de Validación Pasiva para el Consumidor
* **Problema actual:** La pantalla muestra instrucciones dirigidas al locatario ("Cambia a la vista Locatario y abre Canjes..."), lo cual rompe la inmersión del comensal.
* **Nuevo enfoque UX:**
  * Al generar el código de canje, la interfaz del consumidor adoptará un **modo pasivo de mostrador**:
    * Encabezado claro: *"Canje en caja"*.
    * Mensaje prominente: **"Muestra esta pantalla al pagar en caja"**.
    * Código en tamaño extragrande (ej. `TC-345`) con espaciado amplio y tipografía display.
    * Temporizador regresivo visible (10 minutos) con barra de expiración.
    * Código QR temporal de validación rápida para escaneo desde el dispositivo del negocio.

---

### 5. Identidad de Usuario y Pasarela de Checkout Simulada

#### 5.1 Estado por Defecto: "Usuario No Registrado" (Datos Volátiles)
* **Especificaciones de identidad:**
  * Al iniciar la aplicación o abrir una sesión limpia, el perfil iniciará en modo **"Usuario Invitado / No Registrado"**.
  * Mostrar avatar neutro por defecto, nivel inicial y botón visible: **"Personalizar perfil"**.
  * **Volatilidad intencional:**
    * El usuario puede editar su nombre (ej. "Comensal 664"), avatar o preferencias en un formulario modal.
    * **Regla estricta:** Estos datos de edición rápida permanecerán **en memoria volátil de la sesión**. Si la página se recarga por completo, regresará a su estado base de invitado, evitando ensuciar el `localStorage` principal antes de demostraciones oficiales.

#### 5.2 Checkout Simulado del Pase Taquero (Animación de 1.5 Segundos)
* **Objetivo:** Simular un flujo realista de compra dentro del pitch que genere credibilidad comercial sin requerir una pasarela bancaria real conectada.
* **Flujo interactivo:**
  1. El usuario pulsa **"Obtener Pase Taquero · $39/mes"** en el perfil o en un punto de bloqueo.
  2. Se despliega la hoja de pago con el resumen de la suscripción, tarjeta bancaria simulada (terminación `••• 4242`) y botón **"Confirmar y Pagar"**.
  3. Al confirmar:
     * El botón pasa a estado de carga durante exactamente **1.5 segundos**.
     * Muestra un spinner animado con resplandor dorado y el texto: *"Procesando cobro seguro..."*.
  4. Cumplidos los 1.5s:
     * La animación concluye con un icono de check verde animado y el mensaje *"¡Suscripción Activada!"*.
     * Se dispara una breve lluvia de confeti en pantalla.
     * El estado global de la app se actualiza automáticamente a `plan: 'premium'`.
     * Todas las funciones bloqueadas (Rutas por colonia, Taco de Oro, Cupones) quedan operativas de inmediato sin requerir recargar la página.

---

### Checklist de Ejecución Técnica (GSD)

- [ ] **Módulo de Mapa (`MapView.js` y `style.css`):**
  - [ ] Inversión cromática: fondo claro con trazos viales oscuros.
  - [ ] Implementación del contenedor carrusel "Lugares para descubrir".
  - [ ] Regla de activación/bloqueo para "Rutas por colonia".
  - [ ] Ajuste tipográfico a 14px y botones táctiles de 44px.
  - [ ] Transición de estado instantánea al seleccionar pines.
- [ ] **Iconografía Semántica (`Icon.js` y marcadores):**
  - [ ] Creación de SVGs semánticos (taco, pez, dulce, chivo/olla, cubiertos).
  - [ ] Actualización de estilos de pin según especialidad del negocio.
- [ ] **Álbum y Cupones (`AlbumView.js` y `TradingCard.js`):**
  - [ ] Ajuste de viewport y caja del Lightbox 3D.
  - [ ] Implementación de lógica de ordenamiento (rareza, número, nombre).
  - [ ] Integración de plantilla de texto dinámico para botón compartir.
  - [ ] Vista funcional completa de cupones con soporte de canje.
- [ ] **Fidelidad (`LoyaltyView.js`):**
  - [ ] Máquina de estados para visitas secuenciales del 1 al 8.
  - [ ] Rediseño de pantalla de canje con enfoque pasivo "Muestra en caja".
- [ ] **Perfil y Checkout (`ProfileView.js` y `state.js`):**
  - [ ] Estado inicial de usuario no registrado y edición volátil en memoria.
  - [ ] Modal de checkout con spinner de 1.5s y transición automática a Premium.
