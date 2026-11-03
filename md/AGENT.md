Actúa como un ingeniero frontend Senior. Vamos a estructurar un MVP móvil llamado "TacoCards Tijuana" desde cero. El objetivo es crear una Progressive Web App (PWA) segura, "mobile-first" y alojada estáticamente en Vercel.

**REGLAS ARQUITECTÓNICAS ESTRICTAS:**

- **Cero Frameworks, Librerías o Bundlers:** No usarás React, Vite, Webpack, ni Tailwind CSS. Absolutamente todo se construirá con HTML5 semántico, Vanilla JavaScript (ES Modules) y CSS3 puro.
- **Traducción a CSS Puro:** Deberás traducir cualquier clase de utilidad (del código original) a reglas CSS tradicionales organizadas y mantenibles en el archivo `style.css`.
- **Cero Assets Gráficos Actuales:** No integres imágenes, íconos ni vectores. Usa bloques de color CSS o texto como placeholders temporales.
- **Invocación de Skills:** Activa y aplica inmediatamente las directrices de tus perfiles internos: `@Ponytail`, `@GSD`, `@UI-UX Guidelines`, `@Graphify` y `@Grill Me`. Ejecuta con velocidad, asegura un diseño impecable en la manipulación del DOM nativo y auto-audita el código.

**Fase 1: Configuración Estática y PWA Manual**

1. Estructura el archivo raíz `index.html` vinculando `css/style.css` y `js/app.js` (con `type="module"`). El `<body>` solo debe contener un contenedor raíz (ej. `<div id="app"></div>`).
2. Crea manualmente un `manifest.json` con el nombre "TacoCards Tijuana", colores de tema (`#fbf4e8` y `#140c07`) e íconos temporales.
3. Escribe un `sw.js` (Service Worker) nativo para permitir la instalación de la PWA y una estrategia de caché simple offline. Registra este SW en `app.js`.

**Fase 2: Modularidad con Vanilla JS (ES Modules)**
Te entregaré un código monolítico de referencia. Extrae la lógica y los estilos para fragmentarlos en esta estructura estática usando `import`/`export`:

- `/js/components/`: Funciones puras que retornen `HTMLElement` (`Button.js`, `TradingCard.js`, `FakeQR.js`).
- `/js/views/consumer/`: Lógica de renderizado para el cliente (`MapView.js`, `DetailView.js`, `ScanView.js`, `AlbumView.js`, `LoyaltyView.js`, `ProfileView.js`).
- `/js/views/business/`: Lógica de renderizado para el locatario (`Dashboard.js`, `RedeemPage.js`, `LoyaltyPage.js`, `QrPage.js`, `PlanPage.js`). Usa `@Graphify` para rediseñar las gráficas usando Canvas o HTML/CSS puro.
- `/js/data/mockData.js`: Datos duros simulados.
- `/js/app.js`: Orquestador principal, gestor de estado (Consumidor vs Locatario) y enrutador Vanilla (History API).
- `/css/style.css`: Estilos globales y la traducción completa de las utilidades visuales del prototipo.

**Fase 3: Preparación para Vercel y GitHub**

1. Genera un `.gitignore` para excluir archivos del sistema operativo (como `.DS_Store` o `Thumbs.db`).
2. Crea un archivo `vercel.json` con la regla de re-escritura (rewrite) de `/*` a `/index.html` para garantizar que el enrutamiento nativo desde el lado del cliente funcione al recargar la página en producción.

**Instrucción de Ejecución:**
Confirma que has comprendido las reglas (HTML/CSS/JS nativo, sin Tailwind, sin assets, uso de skills). Una vez confirmes, te entregaré el código de referencia para que comiences a ejecutar la refactorización módulo por módulo usando código APP.tsx````tsximport {
createElement,
useState,
type ButtonHTMLAttributes,
type InputHTMLAttributes,
type PointerEvent,
type ReactNode,
} from 'react'

type Role = 'consumer' | 'business'
type Plan = 'free' | 'premium'
type ConsumerView = 'map' | 'detail' | 'scan' | 'album' | 'loyalty' | 'profile'
type BusinessView = 'dashboard' | 'redeem' | 'loyalty' | 'qr' | 'plan'
type Rarity = 'comun' | 'rara' | 'epica' | 'legendaria'
type IconName =
| 'album' | 'arrow' | 'back' | 'card' | 'chart' | 'check' | 'clock' | 'crown'
| 'edit' | 'flame' | 'gift' | 'lock' | 'map' | 'people' | 'person' | 'qr'
| 'reset' | 'scan' | 'shop' | 'spark' | 'star' | 'ticket' | 'trend' | 'wallet'

type Local = {
id: number
name: string
owner: string
since: string
dish: string
type: string
zone: string
rarity: Rarity
number: string
art: 'taco' | 'bowl' | 'seafood' | 'torta' | 'dessert'
stats: [number, number, number]
history: string
schedule: string
photo: string
pin: string
}

const photos = {
tacos: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1000&q=85',
birria: 'https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?auto=format&fit=crop&w=1000&q=85',
seafood: 'https://images.unsplash.com/photo-1749847259651-22276f9b3e54?auto=format&fit=crop&w=1000&q=85',
street: 'https://images.unsplash.com/photo-1737017218249-a497e2a5ff50?auto=format&fit=crop&w=1000&q=85',
dessert: 'https://images.unsplash.com/photo-1601579110733-f654670d8c30?auto=format&fit=crop&w=1000&q=85',
tacos2: 'https://images.unsplash.com/photo-1683062332605-4e1209d75346?auto=format&fit=crop&w=1000&q=85',
}

const locals: Local[] = [
{ id: 1, name: 'Tacos El Cometa', owner: 'Mateo y Rosa', since: 'Desde 2017', dish: 'Especialidad: Cometa de Asada', type: 'Taquería familiar', zone: 'Zona Río', rarity: 'epica', number: '#047/200', art: 'taco', stats: [94, 82, 3], history: 'En 2017, Mateo regresó de Chiapas a Tijuana buscando empezar de nuevo. Con Rosa, una parrilla prestada y recetas de su familia, abrió un carrito para salir adelante. Hoy su hija lleva las cuentas y su carbón de mezquite reúne a la colonia cada noche.', schedule: 'Lun–Dom · 12:00–00:00', photo: photos.tacos, pin: 'p1' },
{ id: 2, name: 'Birria La Brava', owner: 'Doña Elena', since: 'Desde 2014', dish: 'Especialidad: La Brava Dorada', type: 'Birriería de barrio', zone: 'Centro', rarity: 'legendaria', number: '#008/200', art: 'bowl', stats: [98, 91, 8], history: 'Doña Elena comenzó en 2014 cocinando tres ollas cada domingo para pagar los estudios de sus hijos. La receta venía de su madre y el primer comedor fue la cochera de su casa. Diez años después, sus hijos atienden las mesas que ella soñó llenar.', schedule: 'Mar–Dom · 07:00–15:00', photo: photos.birria, pin: 'p2' },
{ id: 3, name: 'Mariscos La Marea', owner: 'Lupita Sandoval', since: 'Desde 2019', dish: 'Especialidad: Tostada Marea Alta', type: 'Marisquería local', zone: 'Av. Revolución', rarity: 'rara', number: '#083/200', art: 'seafood', stats: [89, 76, 2], history: 'Lupita llegó desde San Quintín en 2019 con una hielera, una mesa plegable y el propósito de sostener a su familia. Su primera tostada se vendió en una banqueta. Ahora compra directo a pescadores y da trabajo a otras cuatro mujeres.', schedule: 'Lun–Sáb · 11:00–19:00', photo: photos.seafood, pin: 'p3' },
{ id: 4, name: 'Tortas El Andén', owner: 'Don Ernesto', since: 'Desde 2009', dish: 'Especialidad: La Especial del Andén', type: 'Tortería tradicional', zone: 'Centro', rarity: 'comun', number: '#121/200', art: 'torta', stats: [84, 68, 1], history: 'Don Ernesto perdió su empleo en 2009 y convirtió el puesto de periódicos de su padre en una pequeña tortería. Empezó sirviendo a seis trabajadores del rumbo. Desde entonces abre antes que salga el sol y conoce a muchos clientes por su nombre.', schedule: 'Lun–Sáb · 08:00–20:00', photo: photos.street, pin: 'p4' },
{ id: 5, name: 'Dulce Frontera', owner: 'Mariana Cota', since: 'Desde 2021', dish: 'Especialidad: Nube de Cajeta', type: 'Repostería independiente', zone: 'Zona Río', rarity: 'rara', number: '#105/200', art: 'dessert', stats: [91, 72, 0], history: 'Mariana empezó a hornear en 2021 después de cerrar el salón donde trabajaba. Vendía rebanadas por mensaje y hacía las entregas con su hermana. Cada postre conserva algo de aquellas primeras recetas: paciencia, frontera y ganas de volver a comenzar.', schedule: 'Mar–Dom · 13:00–21:00', photo: photos.dessert, pin: 'p5' },
{ id: 6, name: 'La Esquina 664', owner: 'Chuy y Maribel', since: 'Desde 2018', dish: 'Especialidad: Campechano 664', type: 'Taquería nocturna', zone: 'Av. Revolución', rarity: 'comun', number: '#162/200', art: 'taco', stats: [86, 64, 0], history: 'Chuy y Maribel comenzaron en 2018 con una plancha afuera de su casa para completar el gasto familiar. Cuatro bancos después se volvieron la parada nocturna de la colonia. Su meta sigue siendo sencilla: que nadie se vaya con hambre.', schedule: 'Mié–Dom · 18:00–02:00', photo: photos.tacos2, pin: 'p6' },
]

const goldenLocal: Local = {
id: 7,
name: 'Taco de Oro',
owner: 'Colección TacoCards',
since: 'Edición del Pase',
dish: 'Carta exclusiva del Pase Taquero',
type: 'Edición especial',
zone: 'Toda Tijuana',
rarity: 'legendaria',
number: '#001/200',
art: 'taco',
stats: [100, 100, 39],
history: 'La carta más buscada de la colección celebra a quienes recorren Tijuana para descubrir negocios independientes y compartir sus historias.',
schedule: 'Disponible con Pase Taquero',
photo: photos.tacos2,
pin: 'golden',
}

const rarityLabel: Record<Rarity, string> = {
comun: 'Común', rara: 'Rara', epica: 'Épica', legendaria: 'Legendaria',
}

const cardDetails: Record<number, { blurb: string; address: string }> = {
1: { blurb: 'Carbón de mezquite, tortillas al momento y una historia familiar que sigue creciendo.', address: 'Paseo del Río 184, Zona Río' },
2: { blurb: 'Birria de cocción lenta preparada con una receta que ha unido a tres generaciones.', address: 'Calle Segunda 811, Centro' },
3: { blurb: 'Producto del Pacífico comprado directo a pescadores y preparado frente a cada cliente.', address: 'Av. Revolución 1260, Zona Centro' },
4: { blurb: 'Una tortería honesta que alimenta al barrio desde antes de que salga el sol.', address: 'Calle Quinta 420, Centro' },
5: { blurb: 'Repostería fronteriza hecha en pequeños lotes y con recetas nacidas en casa.', address: 'Blvd. Sánchez Taboada 944, Zona Río' },
6: { blurb: 'Una plancha de barrio, servicio nocturno y campechanos que ya son tradición.', address: 'Av. Revolución 1664, Zona Centro' },
7: { blurb: 'La pieza legendaria reservada para quienes convierten la ciudad en su ruta gastronómica.', address: 'Disponible en toda Tijuana' },
}

function Pressable(props: ButtonHTMLAttributes<HTMLButtonElement>) {
return createElement('button', { type: 'button', ...props })
}

function Field(props: InputHTMLAttributes<HTMLInputElement>) {
return createElement('input', props)
}

function Title({ as, children, className }: { as: 'h1' | 'h2' | 'h3' | 'h4'; children: ReactNode; className?: string }) {
return createElement(as, { className }, children)
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
const paths: Record<IconName, ReactNode> = {
album: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h6" /></>,
arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
back: <><path d="m15 18-6-6 6-6" /></>,
card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></>,
chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
check: <><path d="m5 12 4 4L19 6" /></>,
clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
crown: <><path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z" /></>,
edit: <><path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 6l3 3" /></>,
flame: <><path d="M12 22c4 0 7-3 7-7 0-5-4-8-7-12 0 5-7 6-7 12 0 4 3 7 7 7Z" /><path d="M12 22c2 0 3-2 3-4s-2-3-3-5c0 3-3 3-3 6 0 2 1 3 3 3Z" /></>,
gift: <><path d="M4 10h16v10H4zM2 6h20v4H2zM12 6v14M12 6c-2-4-7-3-6 0M12 6c2-4 7-3 6 0" /></>,
lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15" /></>,
people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
qr: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 19v2" /></>,
reset: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></>,
scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10" /></>,
shop: <><path d="M4 10v10h16V10M3 4h18l-1 6a3 3 0 0 1-5 1 3 3 0 0 1-6 0 3 3 0 0 1-5-1L3 4ZM9 20v-5h6v5" /></>,
spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
star: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>,
ticket: <><path d="M3 8a3 3 0 0 0 0 6v4h18v-4a3 3 0 0 0 0-6V4H3v4ZM13 7h4M13 11h4M13 15h2" /></>,
trend: <><path d="m3 17 6-6 4 4 8-9M15 6h6v6" /></>,
wallet: <><path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12v3M16 11h5v4h-5a2 2 0 0 1 0-4Z" /></>,
}
return (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
{paths[name]}
</svg>
)
}

function Button({
children, onClick, variant = 'primary', icon, disabled, className = '',
}: {
children: ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'quiet' | 'teal'; icon?: IconName; disabled?: boolean; className?: string
}) {
return <Pressable className={`button button-${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} />}{children}</Pressable>
}

function Logo() {
return (

<div className="logo">
<div className="logo-diamond"><span>TC</span></div>
<div><strong>TacoCards</strong><small>TIJUANA</small></div>
</div>
)
}

function ScreenBrand() {
return <div className="screen-brand"><i>TC</i><span><strong>TacoCards</strong><small>TIJUANA</small></span></div>
}

function FixedHeader({
role,
setRole,
compare,
setCompare,
}: {
role: Role
setRole: (role: Role) => void
compare: boolean
setCompare: (compare: boolean) => void
}) {
return (

<div className="fixed-header">
<div className="header-inner">
<Logo />
<div className="role-toggle" aria-label="Cambiar vista">
<Pressable className={role === 'consumer' ? 'active' : ''} onClick={() => setRole('consumer')}><Icon name="person" size={17} />Consumidor</Pressable>
<Pressable className={role === 'business' ? 'active' : ''} onClick={() => setRole('business')}><Icon name="shop" size={17} />Locatario</Pressable>
</div>
<Button variant={compare ? 'primary' : 'outline'} icon="card" className="compare-button" onClick={() => setCompare(!compare)}>{compare ? 'Cerrar comparación' : 'Comparar planes'}</Button>
<div className="competition-label"><Icon name="crown" size={15} />CimaTank · FCA-UABC</div>
</div>
</div>
)
}

function FakeQR({ small = false }: { small?: boolean }) {
const filled = [0,1,2,3,4,5,6,8,10,12,14,16,18,19,20,22,24,25,26,28,30,32,34,36,38,40,42,44,46,48,49,50,52,54,56,58,60,62,64,66,68,70,72,73,74,76,78,80]
return <div className={`fake-qr ${small ? 'small' : ''}`}>{Array.from({ length: 81 }, (\_, index) => <i key={index} className={filled.includes(index) ? 'on' : ''} />)}</div>
}

function CardArt({ type }: { type: Local['art'] }) {
if (type === 'bowl') {
return <svg viewBox="0 0 300 205" role="img" aria-label="Ilustración editorial de birria"><path className="sun" d="M0 0h300v205H0z" /><circle className="ray" cx="150" cy="95" r="72" /><path className="plate" d="M56 87h188c-7 70-39 91-94 91S63 157 56 87Z" /><path className="food" d="M65 87c20-35 49-43 75-18 22-28 55-21 78 18" /><path className="line" d="M72 110c35 18 118 18 156 0M100 55l-7-25M148 48V19M197 58l12-24" /></svg>
}
if (type === 'seafood') {
return <svg viewBox="0 0 300 205" role="img" aria-label="Ilustración editorial de tostada de mariscos"><path className="sun" d="M0 0h300v205H0z" /><circle className="plate" cx="150" cy="113" r="76" /><path className="food" d="M80 115c31-48 106-51 143 0-27 54-114 59-143 0Z" /><path className="line" d="M91 105c23 24 93 30 121-2M112 78c8 14 23 18 39 11 15-7 27-3 38 10M62 47l23 15M238 47l-23 15" /><circle className="dots" cx="125" cy="119" r="7" /><circle className="dots" cx="174" cy="110" r="6" /></svg>
}
if (type === 'torta') {
return <svg viewBox="0 0 300 205" role="img" aria-label="Ilustración editorial de una torta"><path className="sun" d="M0 0h300v205H0z" /><path className="plate" d="M42 118c14 50 198 50 216 0" /><path className="food" d="M59 103c4-45 46-65 91-65s88 20 92 65H59Z" /><path className="food second" d="M54 112h192l-17 42H70l-16-42Z" /><path className="line" d="M69 96c47 14 111 14 161 0M89 70l21 8M146 57l21 10M201 73l-19 8" /></svg>
}
if (type === 'dessert') {
return <svg viewBox="0 0 300 205" role="img" aria-label="Ilustración editorial de un postre"><path className="sun" d="M0 0h300v205H0z" /><path className="plate" d="M100 164h100l17 21H82l18-21Z" /><path className="food" d="M108 160c-14-21 10-30 7-48-4-24 20-36 36-24 10-22 43-10 37 12 28 5 20 38 2 42 4 9 2 15-3 18h-79Z" /><path className="line" d="M150 85c-9-22 2-36 21-46M166 54c9 0 16 7 16 16M120 128c19 10 43 13 70 4" /></svg>
}
return <svg viewBox="0 0 300 205" role="img" aria-label="Ilustración editorial de tacos"><path className="sun" d="M0 0h300v205H0z" /><circle className="ray" cx="150" cy="104" r="86" /><path className="food" d="M42 144c8-79 76-112 130-72-44 6-83 31-107 78l-23-6Z" /><path className="food second" d="M122 151c9-69 73-92 128-53-43 2-80 23-105 62l-23-9Z" /><path className="line" d="M77 115c21-14 43-24 69-27M156 122c20-12 41-19 65-20M100 72l-8-31M153 57V22M205 70l13-28" /><circle className="dots" cx="102" cy="110" r="6" /><circle className="dots" cx="180" cy="120" r="6" /></svg>
}

function TradingCard({
local,
locked = false,
compact = false,
preview = false,
forcedFlipped,
onActivate,
}: {
local: Local
locked?: boolean
compact?: boolean
preview?: boolean
forcedFlipped?: boolean
onActivate?: () => void
}) {
const [flipped, setFlipped] = useState(false)
const isFlipped = forcedFlipped ?? flipped
const details = cardDetails[local.id]
const move = (event: PointerEvent<HTMLButtonElement>) => {
const box = event.currentTarget.getBoundingClientRect()
const x = (event.clientX - box.left) / box.width
const y = (event.clientY - box.top) / box.height
event.currentTarget.style.setProperty('--mx', `${x * 100}%`)
event.currentTarget.style.setProperty('--my', `${y * 100}%`)
event.currentTarget.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
event.currentTarget.style.setProperty('--ry', `${(x - 0.5) * 10}deg`)
}
return (
<Pressable
className={`collectible ${local.rarity} ${compact ? 'compact' : ''} ${isFlipped ? 'flipped' : ''} ${locked ? 'locked' : ''}`}
onPointerMove={move}
onPointerLeave={(event) => { event.currentTarget.style.setProperty('--rx', '0deg'); event.currentTarget.style.setProperty('--ry', '0deg') }}
onClick={() => {
if (locked) return
if (onActivate) onActivate()
else if (!preview) setFlipped(!flipped)
}}
aria-label={locked ? 'Carta bloqueada' : `Carta ${local.dish}. Toca para voltear`} >

<div className="card-tilt">
<div className="card-face card-front">
<div className="foil" />
<div className="card-title-band"><Title as="h3">{locked ? 'Negocio por descubrir' : local.name}</Title><span>{rarityLabel[local.rarity]}</span></div>
<div className="illustration"><img src={local.photo} alt={locked ? '' : `Platillo de ${local.name}`} />{locked && <div className="locked-art"><Icon name="lock" size={34} /><span>?</span></div>}</div>
<div className="card-band">
<div className="card-location"><span>{local.type}</span><span>{local.zone}</span></div>
<p className="card-blurb">{locked ? 'Descúbrelo en el mapa para revelar su historia.' : details.blurb}</p>
<div className="card-stats">
<div><Icon name="flame" size={13} /><span>Sabor</span><strong>{locked ? '—' : local.stats[0]}</strong></div>
<div><Icon name="star" size={13} /><span>Fama</span><strong>{locked ? '—' : local.stats[1]}</strong></div>
<div><Icon name="people" size={13} /><span>Visitas</span><strong>{locked ? '—' : local.stats[2]}</strong></div>
</div>
</div>
<div className="card-footer"><span>{local.number}</span><span>Arte generado con IA</span></div>
</div>
<div className="card-face card-back">
<div className="back-identity"><span>{local.number}</span><span>{rarityLabel[local.rarity]}</span></div>
<span className="back-kicker">Detrás del negocio</span>
<Title as="h3">{local.name}</Title>
<div className="owner-chip"><span>{local.owner.split(' ').map(word => word[0]).join('').slice(0, 2)}</span><div><strong>{local.owner}</strong><small>{local.since} · {local.zone}</small></div></div>
<p className="owner-story">“{local.history}”</p>
<div className="back-hours"><Icon name="clock" /><span>{local.schedule}</span></div>
<div className="mini-card-map"><Icon name="map" size={16} /><span>{details.address}</span><i /><b /></div>
<div className="back-action"><FakeQR small /><span><strong>Visita su negocio</strong><small>Escanea ahí para sumar una visita y obtener esta carta.</small></span></div>
</div>
</div>
</Pressable>
)
}

function ConsumerNav({ view, setView }: { view: ConsumerView; setView: (view: ConsumerView) => void }) {
const items: [ConsumerView, string, IconName][] = [['map','Mapa','map'],['album','Álbum','album'],['loyalty','Fidelidad','card'],['profile','Perfil','person']]
return <nav className="consumer-nav">{items.map(([id,label,icon]) => <Pressable key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon name={icon} /><span>{label}</span></Pressable>)}</nav>
}

function PhoneStatusBar() {
return (

<div className="phone-status" aria-label="Barra de estado">
<span>9:41</span>
<div><i className="status-signal" /><i className="status-wifi" /><i className="status-battery" /></div>
</div>
)
}

function MapView({ onLocal, plan }: { onLocal: () => void; plan: Plan }) {
const [filter, setFilter] = useState('Todos')
return (

<div className="phone-view map-view">
<header className="consumer-greeting">
<div className="greeting-brand-row"><span>¡Hola, Alex!</span><ScreenBrand /></div>
<Title as="h2">¿Qué se te antoja hoy?</Title>
<div className="map-filters">{['Todos','Tacos','Birria','Mariscos','Postres'].map(item => <Pressable key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</Pressable>)}</div>
</header>
<div className="map-canvas">
<div className="tijuana-map">
<span className="zone rio">Zona Río</span><span className="zone centro">Centro</span><span className="zone rev">Av. Revolución</span>
<i className="road r1" /><i className="road r2" /><i className="road r3" />
{locals.map((local, index) => <Pressable key={local.id} className={`map-pin ${local.pin} ${index === 0 ? 'selected' : ''} ${plan === 'premium' && index === 0 ? 'featured' : ''}`} title={`${local.name} · ${local.type}`} onClick={index === 0 ? onLocal : undefined}><Icon name={local.type === 'Postres' ? 'star' : 'map'} size={16} /></Pressable>)}
{plan === 'premium' && <div className="premium-route"><i /><i /><i /><i /></div>}
</div>
<Pressable className={`routes-button ${plan === 'free' ? 'locked-feature' : ''}`}>
{plan === 'free' && <Icon name="lock" size={14} />}<Icon name="map" size={15} />Rutas por colonia
{plan === 'free' && <small>Con el Pase</small>}
</Pressable>
<Pressable className="map-place" onClick={onLocal}>
<img src={locals[0].photo} alt="Tacos de asada de El Cometa" />
<div><span className="open">Abierto · a 8 min</span><Title as="h3">Tacos El Cometa</Title><p>Taquería · Zona Río</p><small><Icon name="spark" size={13} />Carta épica disponible</small></div>
<Icon name="arrow" />
</Pressable>
</div>
</div>
)
}

function DetailView({ onBack, onScan, visits }: { onBack: () => void; onScan: () => void; visits: number }) {
return (

<div className="phone-view detail-view">
<div className="detail-photo"><img src={locals[0].photo} alt="Tacos al carbón" /><Pressable className="circle-button" onClick={onBack} aria-label="Regresar"><Icon name="back" /></Pressable><span>Abierto ahora</span></div>
<div className="detail-copy">
<span className="kicker">Zona Río · a 1.2 km</span><Title as="h2">Tacos El Cometa</Title><p>Tortillas hechas a mano, asada al carbón y salsas de la casa.</p>
<div className="local-facts"><span><Icon name="clock" />12:00–00:00</span><span><Icon name="map" />8 min caminando</span></div>
<div className="detail-card"><TradingCard local={locals[0]} compact /><div><span className="rarity-chip">Épica</span><Title as="h3">Cometa de Asada</Title><p>Toca la carta para conocer la historia del local.</p></div></div>
<div className="visit-meter"><div><span>Progreso de fidelidad</span><strong>Visita {visits}/3</strong></div><i><span style={{ width: `${visits / 3 * 100}%` }} /></i><small>Una visita más desbloquea la tarjeta de este local.</small></div>
</div>
<div className="phone-sticky"><Button icon="scan" onClick={onScan}>Escanear QR</Button></div>
</div>
)
}

function ScanView({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
const [revealed, setRevealed] = useState(false)
return (

<div className={`phone-view scan-view ${revealed ? 'revealed' : ''}`}>
<div className="scan-top"><Pressable className="circle-button" onClick={onBack} aria-label="Regresar"><Icon name="back" /></Pressable><div><span>Tacos El Cometa</span><Title as="h2">{revealed ? '¡Carta obtenida!' : 'Escanear QR'}</Title></div></div>
{!revealed ? (
<>
<div className="camera-view"><img src={photos.street} alt="Vista simulada del local" /><div className="scan-frame"><i /><span /><span /><span /><span /></div><p>Alinea el código dentro del marco</p></div>
<div className="scan-actions"><span><Icon name="check" size={14} />La ubicación del local está verificada</span><Title as="h3">Simula el escaneo para continuar</Title><Button icon="qr" onClick={() => setRevealed(true)}>Leer código del local</Button></div>
</>
) : (
<div className="reveal-area">
<div className="confetti">{Array.from({ length: 24 }, (\_, index) => <i key={index} style={{ '--n': index } as React.CSSProperties} />)}</div>
<span className="kicker">Tercera visita verificada</span><Title as="h2">Tu colección crece</Title>
<TradingCard local={locals[0]} />
<div className="earned"><Icon name="spark" /><strong>+120 pts</strong><span>Tarjeta de fidelidad desbloqueada</span></div>
<Button icon="gift" onClick={onComplete}>Guardar y ver fidelidad</Button>
</div>
)}
</div>
)
}

function AlbumView({ plan }: { plan: Plan }) {
const [filter, setFilter] = useState('Todas')
const [tab, setTab] = useState<'cards' | 'coupons'>('cards')
const [selected, setSelected] = useState<Local | null>(null)
const [modalFlipped, setModalFlipped] = useState(false)
const [dragStart, setDragStart] = useState(0)
const [shared, setShared] = useState(false)
const collection = [...locals, goldenLocal]
const shown = collection.filter(local => filter === 'Todas' || rarityLabel[local.rarity] === filter)
const closeCard = () => { setSelected(null); setModalFlipped(false); setShared(false) }
const shareCard = async () => {
if (!selected) return
const shareData = {
title: `${selected.name} · TacoCards Tijuana`,
text: `Descubre la historia de ${selected.name} y colecciona su carta en TacoCards Tijuana.`,
url: window.location.href,
}
if (navigator.share) await navigator.share(shareData)
else await navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`)
setShared(true)
}
return (

<div className="phone-view standard-view">
<header className="phone-heading"><div><span>Colección Tijuana 2026</span><Title as="h2">Mi álbum</Title></div><span className="points">1,480 pts</span></header>
<div className="album-tabs"><Pressable className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>Cartas</Pressable><Pressable className={tab === 'coupons' ? 'active' : ''} onClick={() => setTab('coupons')}>Cupones {plan === 'free' && <Icon name="lock" size={11} />}</Pressable></div>
{tab === 'cards' ? (
<>
<div className="album-progress"><div className="progress-ring"><strong>18</strong><span>de 48</span></div><div><span>Progreso total</span><Title as="h3">37% completado</Title><p>4 cartas nuevas esta semana</p></div></div>
<div className="rarity-progress"><span>Común <strong>10/20</strong></span><span>Rara <strong>5/14</strong></span><span>Épica <strong>2/9</strong></span><span>Legendaria <strong>1/5</strong></span></div>
<div className="map-filters album-filter">{['Todas','Común','Rara','Épica','Legendaria'].map(item => <Pressable key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</Pressable>)}</div>
<div className="album-grid">{shown.map((local, index) => <div className="album-card-slot" key={local.id}><TradingCard local={local} compact preview locked={local.id === 7 ? plan === 'free' : index > 3 || local.id > 4} onActivate={() => { setSelected(local); setModalFlipped(false) }} />{local.id === 7 && plan === 'free' && <span className="pass-label"><Icon name="lock" size={10} />Con el Pase</span>}</div>)}</div>
</>
) : (
<div className={`coupons-view ${plan === 'free' ? 'feature-locked' : ''}`}>
<div className="coupon-list">
<article><span>2×1</span><div><strong>Agua fresca</strong><small>Birria La Brava · hasta el domingo</small></div></article>
<article><span>15%</span><div><strong>Tostadas al centro</strong><small>Mariscos La Marea · después de las 16 h</small></div></article>
<article><span>+$0</span><div><strong>Extra de cajeta</strong><small>Dulce Frontera · en tu próxima visita</small></div></article>
</div>
{plan === 'free' && <div className="locked-message"><Icon name="lock" /><strong>Cupones exclusivos</strong><small>Disponibles con el Pase Taquero</small><span>Con el Pase</span></div>}
</div>
)}
{selected && (
<div className="card-lightbox" onClick={closeCard}>
<div
className="card-modal"
onClick={event => event.stopPropagation()}
onPointerDown={event => setDragStart(event.clientY)}
onPointerUp={event => { if (event.clientY - dragStart > 80) closeCard() }} >
<Pressable className="lightbox-close" onClick={closeCard} aria-label="Cerrar carta">×</Pressable>
<TradingCard local={selected} forcedFlipped={modalFlipped} onActivate={() => setModalFlipped(!modalFlipped)} />
<div className="lightbox-actions">
<Button icon={modalFlipped ? 'back' : 'card'} onClick={() => setModalFlipped(!modalFlipped)}>Voltear</Button>
<Button variant="outline" icon="arrow" onClick={shareCard}>{shared ? 'Enlace copiado' : 'Compartir'}</Button>
</div>
</div>
</div>
)}
</div>
)
}

function LoyaltyView({
visits, stamps, code, onAdvance, onClaim,
}: { visits: number; stamps: number; code: string; onAdvance: () => void; onClaim: () => void }) {
if (visits < 3) {
return <div className="phone-view standard-view"><header className="phone-heading"><div><span>Tus lugares de siempre</span><Title as="h2">Fidelidad</Title></div></header><div className="locked-loyalty"><div><Icon name="lock" size={38} /></div><span className="kicker">Tacos El Cometa</span><Title as="h2">Visita 2/3</Title><p>Escanea el QR una vez más para abrir la tarjeta exclusiva de este negocio.</p><div className="three-visits"><i className="done" /><i className="done" /><i /></div></div></div>
}
return (

<div className="phone-view standard-view">
<header className="phone-heading"><div><span>Recompensas por volver</span><Title as="h2">Fidelidad</Title></div></header>
<div className="unlocked-note"><Icon name="spark" /><span><strong>Tarjeta desbloqueada</strong><small>En tu tercera visita a Tacos El Cometa</small></span></div>
<div className="stamp-card">
<div className="stamp-head"><div><span>Tacos El Cometa</span><Title as="h3">Tu sabor de siempre</Title></div><Logo /></div>
<div className="stamp-grid">{Array.from({ length: 8 }, (\_, index) => { const n = index + 1; return <div key={n} className={`${n <= stamps ? 'done' : ''} ${n === 4 || n === 8 ? 'prize' : ''}`}>{n <= stamps ? <Icon name="star" /> : n}<small>{n === 4 ? 'Taco' : n === 8 ? 'Orden' : ''}</small></div> })}</div>
<div className="stamp-prizes"><span><Icon name="gift" /><small>Sello 4</small><strong>1 taco de asada</strong></span><span><Icon name="crown" /><small>Sello 8</small><strong>1 orden clásica</strong></span></div>
<p>Un sello por visita con consumo. Los premios los cubre el negocio.</p>
</div>
{stamps < 4 && <div className="demo-box"><span><strong>Modo demostración</strong><small>Avanza para probar el canje.</small></span><Button variant="outline" onClick={onAdvance}>Simular sello 4</Button></div>}
{stamps >= 4 && !code && <div className="claim-box"><span className="kicker">Premio disponible</span><Title as="h3">Tu taco corre por la casa</Title><p>Genera un código y muéstralo en caja. Expira en 10 minutos.</p><Button icon="ticket" onClick={onClaim}>Canjear premio</Button></div>}
{code && <div className="code-box"><div><Icon name="check" /></div><span className="kicker">Código listo para validar</span><Title as="h2">{code}</Title><p>Cambia a la vista Locatario y abre Canjes para completar el flujo.</p><small><Icon name="clock" size={14} />Expira en 09:42</small></div>}
</div>
)
}

function ProfileView({ plan, onActivatePremium }: { plan: Plan; onActivatePremium: () => void }) {
const [showUpgrade, setShowUpgrade] = useState(false)
const [celebrate, setCelebrate] = useState(false)
const activate = () => {
setCelebrate(true)
window.setTimeout(() => { onActivatePremium(); setShowUpgrade(false) }, 650)
}
return (

<div className="phone-view standard-view">
<header className="phone-heading"><div><span>Coleccionista fronterizo</span><Title as="h2">Mi perfil</Title></div></header>
<div className="profile"><div className={`avatar ${plan === 'premium' ? 'premium' : ''}`}>AR<span>7</span>{plan === 'premium' && <i><Icon name="crown" size={11} /></i>}</div><Title as="h2">Alex Rivera</Title><p>Explorando Tijuana desde enero de 2026</p><div><span><strong>18</strong>Cartas</span><span><strong>12</strong>Locales</span><span><strong>7</strong>Nivel</span></div></div>
<div className={`taquero-pass ${plan === 'premium' ? 'active-pass' : ''}`}><span><Icon name="crown" />{plan === 'premium' ? 'Pase activo' : 'Pase Taquero · $39/mes'}</span><Title as="h2">{plan === 'premium' ? 'Renueva el 1 de diciembre' : 'Más Tijuana en cada salida'}</Title><p>{plan === 'premium' ? 'Taco de Oro, cupones y rutas están activos.' : 'Incluye Taco de Oro, cupones y rutas por colonia.'}</p><ul><li><Icon name="check" size={13} />Carta legendaria exclusiva</li><li><Icon name="check" size={13} />Cupones de negocios locales</li><li><Icon name="check" size={13} />Rutas gastronómicas</li></ul><div>{plan === 'free' && <strong>$39 <small>MXN/mes</small></strong>}<Button variant={plan === 'premium' ? 'outline' : 'primary'} onClick={() => plan === 'free' && setShowUpgrade(true)}>{plan === 'premium' ? 'Administrar' : 'Obtener Pase'}</Button></div></div>
<Title as="h3" className="section-title">Logros recientes</Title>
<div className="achievements"><div><Icon name="map" /><strong>Río Explorer</strong><small>5 locales</small></div><div><Icon name="spark" /><strong>Buen ojo</strong><small>1 épica</small></div><div className="muted"><Icon name="lock" /><strong>Noctámbulo</strong><small>Bloqueado</small></div></div>
{showUpgrade && <div className="upgrade-sheet-backdrop" onClick={() => setShowUpgrade(false)}><div className="upgrade-sheet" onClick={event => event.stopPropagation()}><i /><span className="kicker">Pase Taquero</span><Title as="h2">Desbloquea otra forma de recorrer Tijuana</Title><ul><li><Icon name="crown" />Taco de Oro legendario</li><li><Icon name="ticket" />Cupones locales cada mes</li><li><Icon name="map" />Rutas por colonia</li></ul><div className="upgrade-price"><strong>$39</strong><span>MXN al mes<br />Cancela cuando quieras</span></div><Button onClick={activate}>Activar Pase Taquero</Button>{celebrate && <div className="upgrade-confetti">{Array.from({ length: 18 }, (\_,i) => <i key={i} style={{ '--n': i } as React.CSSProperties} />)}</div>}</div></div>}
</div>
)
}

function ConsumerDevice({
view, setView, visits, setVisits, stamps, setStamps, code, setCode, plan, onActivatePremium,
}: {
view: ConsumerView; setView: (view: ConsumerView) => void; visits: number; setVisits: (value: number) => void; stamps: number; setStamps: (value: number) => void; code: string; setCode: (value: string) => void; plan: Plan; onActivatePremium: () => void
}) {
let content: ReactNode
if (view === 'map') content = <MapView onLocal={() => setView('detail')} plan={plan} />
else if (view === 'detail') content = <DetailView visits={visits} onBack={() => setView('map')} onScan={() => setView('scan')} />
else if (view === 'scan') content = <ScanView onBack={() => setView('detail')} onComplete={() => { setVisits(3); setView('loyalty') }} />
else if (view === 'album') content = <AlbumView plan={plan} />
else if (view === 'loyalty') content = <LoyaltyView visits={visits} stamps={stamps} code={code} onAdvance={() => setStamps(4)} onClaim={() => setCode('TC-345')} />
else content = <ProfileView plan={plan} onActivatePremium={onActivatePremium} />
const navVisible = !['detail','scan'].includes(view)
return <div className="phone-frame"><div className="phone-notch" /><div className="phone-screen"><PhoneStatusBar />{content}{navVisible && <ConsumerNav view={view} setView={setView} />}</div></div>
}

const businessTabs: [BusinessView, string, IconName][] = [['dashboard','Dashboard','chart'],['redeem','Canjes','ticket'],['loyalty','Fidelidad','card'],['qr','Mi QR','qr'],['plan','Plan','wallet']]

function BusinessNav({ view, setView }: { view: BusinessView; setView: (view: BusinessView) => void }) {
return <nav className="business-bottom-nav">{businessTabs.map(([id,label,icon]) => <Pressable key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon name={icon} /><span>{label}</span></Pressable>)}</nav>
}

type CrossFilter = { label: string; factor: number } | null

function Segmented({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
return <div className="dashboard-segment">{items.map(item => <Pressable key={item} className={item === value ? 'active' : ''} onClick={() => onChange(item)}>{item}</Pressable>)}</div>
}

function Sparkline({ values, negative = false }: { values: number[]; negative?: boolean }) {
const points = values.map((value,index) => `${index * 18},${30 - value}`).join(' ')
return <svg className={negative ? 'negative' : ''} viewBox="0 0 108 32" aria-hidden="true"><polyline points={points} /></svg>
}

function PlanLock() {
return <div className="plan-lock"><Icon name="lock" size={16} /><span>Disponible en Plan Destacado</span></div>
}

function Dashboard({ plan }: { plan: Plan }) {
const [period, setPeriod] = useState('7 días')
const [customer, setCustomer] = useState('Todos')
const [time, setTime] = useState('Todo el día')
const [cross, setCross] = useState<CrossFilter>(null)
const factor = ({'Hoy': .18,'7 días': 1,'30 días': 4.2,'Año': 48}[period] || 1)
_ ({'Todos': 1,'Nuevos': .38,'Recurrentes': .62}[customer] || 1)
_ ({'Todo el día': 1,'Mañana': .25,'Tarde': .44,'Noche': .31}[time] || 1)
_ (cross?.factor || 1)
const visits = Math.max(1, Math.round(132 _ factor))
const unique = Math.max(1, Math.round(visits _ .69))
const redemptions = Math.round(visits _ .136)
const revenue = visits \_ 176
const reset = () => { setPeriod('7 días'); setCustomer('Todos'); setTime('Todo el día'); setCross(null) }
const kpis = [
['Visitas con QR', visits, '+18%', [7,11,9,16,13,23,18], false],
['Clientes únicos', unique, '+12%', [6,8,10,9,15,16,19], false],
['Tasa de retorno', customer === 'Nuevos' ? '0%' : '34%', '+6.2 pp', [5,8,10,13,16,17,21], false],
['Canjes validados', redemptions, '-4%', [16,11,13,9,12,8,7], true],
['Ingreso atribuible', `$${revenue.toLocaleString('es-MX')}`, '+21%', [4,8,7,14,13,20,23], false],
] as const
const days = [14,20,16,27,22,34,29]
const heat = [[1,2,4,3,2,1],[2,4,6,5,3,2],[2,5,8,7,4,2],[3,6,9,8,5,3],[3,7,10,9,6,4],[4,8,9,10,7,5],[2,5,7,6,4,3]]
const choose = (label: string, value: number) => setCross(cross?.label === label ? null : { label, factor: value })
return (

<div className="dashboard-page">
<div className="dashboard-title"><div><span>¡Hola, Tacos El Cometa! {plan === 'premium' && <b>Destacado</b>}</span><Title as="h2">Resumen de rendimiento</Title></div><ScreenBrand /></div>
<div className="slicer-bar">
<div><label>Periodo</label><Segmented items={['Hoy','7 días','30 días','Año']} value={period} onChange={value => { setPeriod(value); setCross(null) }} /></div>
<div><label>Tipo de cliente</label><Segmented items={['Todos','Nuevos','Recurrentes']} value={customer} onChange={value => { setCustomer(value); setCross(null) }} /></div>
<div><label>Horario</label><Segmented items={['Todo el día','Mañana','Tarde','Noche']} value={time} onChange={value => { setTime(value); setCross(null) }} /></div>
<Button variant="quiet" icon="reset" onClick={reset}>Restablecer filtros</Button>
</div>
{cross && <div className="cross-note"><Icon name="check" size={14} />Filtro cruzado activo: <strong>{cross.label}</strong><Pressable onClick={() => setCross(null)}>Quitar</Pressable></div>}
<div className="kpi-row">{kpis.map(([label,value,delta,series,negative],index) => <article className={`visual kpi ${plan === 'free' && index > 0 ? 'premium-visual-locked' : ''}`} key={label} title={`${label}: ${value}. Comparación con el periodo anterior: ${delta}`}><span>{label}</span><div><strong>{value}</strong><b className={negative ? 'down' : ''}>{negative ? '▼' : '▲'} {delta}</b></div><small>vs. periodo anterior</small><Sparkline values={[...series]} negative={negative} />{plan === 'free' && index > 0 && <PlanLock />}</article>)}</div>
<div className="dashboard-grid">
<article className="visual line-visual">
<div className="visual-title"><div><span>Visitas por día</span><small>Actual, anterior y meta</small></div><div className="legend"><i className="current" />Actual <i className="previous" />Anterior <i className="goal" />Meta</div></div>
<div className="line-chart">
<svg viewBox="0 0 600 185" preserveAspectRatio="none" aria-label="Gráfica de visitas">
<line className="grid" x1="20" y1="40" x2="580" y2="40" /><line className="grid" x1="20" y1="90" x2="580" y2="90" /><line className="grid" x1="20" y1="140" x2="580" y2="140" />
<line className="goal-line" x1="20" y1="58" x2="580" y2="58" />
<polyline className="previous-line" points="20,136 113,118 206,126 299,92 392,106 485,78 578,85" />
<polyline className="current-line" points="20,126 113,99 206,116 299,68 392,88 485,35 578,57" />
{days.map((value,index) => <circle key={index} onClick={() => choose(['Vie','Sáb','Dom','Lun','Mar','Mié','Jue'][index], value / 132)} className="data-point" cx={20 + index _ 93} cy={[126,99,116,68,88,35,57][index]} r="6"><title>{value} visitas · clic para filtrar</title></circle>)}
</svg>
<div className="chart-days">{['Vie','Sáb','Dom','Lun','Mar','Mié','Jue'].map(day => <span key={day}>{day}</span>)}</div>
</div>
</article>
<article className={`visual donut-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
<div className="visual-title"><div><span>Clientes</span><small>Nuevos vs. recurrentes</small></div></div>
<div className="donut-wrap">
<div className="donut" title="62% recurrentes, 38% nuevos"><strong>{unique}</strong><span>clientes</span><Pressable className="donut-hit recurrent" onClick={() => choose('Recurrentes', .62)} aria-label="Filtrar recurrentes" /><Pressable className="donut-hit new" onClick={() => choose('Nuevos', .38)} aria-label="Filtrar nuevos" /></div>
<div className="donut-labels"><Pressable onClick={() => choose('Nuevos', .38)}><i className="new" /><span>Nuevos</span><strong>38%</strong></Pressable><Pressable onClick={() => choose('Recurrentes', .62)}><i className="return" /><span>Recurrentes</span><strong>62%</strong></Pressable></div>
</div>
{plan === 'free' && <PlanLock />}
</article>
<article className={`visual heat-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
<div className="visual-title"><div><span>Mapa de calor</span><small>Visitas por día y hora</small></div></div>
<div className="heatmap"><div className="heat-hours"><span>10 h</span><span>12 h</span><span>14 h</span><span>18 h</span><span>20 h</span><span>22 h</span></div>{heat.map((row,rowIndex) => <div className="heat-row" key={rowIndex}><span>{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][rowIndex]}</span>{row.map((value,colIndex) => <Pressable key={colIndex} title={`${value * 3} visitas · clic para filtrar`} style={{ '--heat': value / 10 } as React.CSSProperties} onClick={() => choose(`${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][rowIndex]} ${[10,12,14,18,20,22][colIndex]} h`, Math.max(.08, value / 42))}>{value * 3}</Pressable>)}</div>)}</div>
          {plan === 'free' && <PlanLock />}
        </article>
        <article className={`visual funnel-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
          <div className="visual-title"><div><span>Embudo de fidelización</span><small>Conversión de la cohorte</small></div></div>
          <div className="funnel">{[['1ª visita',91,100],['2ª visita',57,63],['3ª · abre tarjeta',31,34],['Sello 4 · premio 1',18,20],['Sello 8 · premio 2',7,8]].map(([label,count,width],index) => <Pressable key={String(label)} onClick={() => choose(String(label), Number(count) / 91)} title={`${count} clientes · clic para filtrar`}><span>{label}</span><i style={{ width: `${width}%` }} /><strong>{count}</strong><small>{index ? `${Math.round(Number(count) / Number([91,57,31,18][index - 1]) * 100)}%` : '100%'}</small></Pressable>)}</div>
{plan === 'free' && <PlanLock />}
</article>
<article className={`visual rewards-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
<div className="visual-title"><div><span>Premios más canjeados</span><small>{redemptions} canjes en el periodo</small></div></div>
<div className="horizontal-bars">{[['Taco de asada',11,61],['Agua fresca',4,22],['Orden clásica',3,17]].map(([label,count,width]) => <Pressable key={String(label)} onClick={() => choose(String(label), Number(count) / 18)} title={`${count} canjes · clic para filtrar`}><span>{label}</span><div><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></Pressable>)}</div>
{plan === 'free' && <PlanLock />}
</article>
<article className={`visual roi-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
<div className="visual-title"><div><span>ROI del Plan Destacado</span><small>Estimación mensual</small></div><span className="roi-badge">9.3×</span></div>
<div className="roi-numbers"><div><span>Cuota</span><strong>$249</strong></div><div><span>Ventas adicionales</span><strong>$2,320</strong></div><div><span>App de reparto</span><strong className="bad">$6,125</strong></div></div>
          <div className="roi-saving"><Icon name="trend" /><span>Ahorro potencial vs. reparto</span><strong>$5,876/mes</strong></div>
          <p>100 pedidos × $176 × 30% + IVA. Con 2 visitas extra, la cuota se paga sola.</p>
          {plan === 'free' && <PlanLock />}
        </article>
        <article className={`visual table-visual ${plan === 'free' ? 'premium-visual-locked' : ''}`}>
          <div className="visual-title"><div><span>Mejores clientes</span><small>Ordenados por visitas verificadas</small></div><Pressable>Ver todos</Pressable></div>
          <div className="data-table"><div className="table-head"><span>Alias</span><span>Visitas</span><span>Sellos</span><span>Último canje</span></div>{[['@alexr',12,8,'12 mayo'],['@sabor664',10,7,'10 mayo'],['@maria.tj',9,6,'—'],['@luism',8,5,'4 mayo'],['@norteño',7,4,'Hoy']].map(([alias,customerVisits,customerStamps,last]) => <Pressable key={String(alias)} onClick={() => choose(String(alias), Number(customerVisits) / 46)} title={`Filtrar actividad de ${alias}`}><span>{alias}</span><span><i style={{ width: `${Number(customerVisits) / 12 _ 100}%`}} /><b>{customerVisits}</b></span><span><i style={{ width:`${Number(customerStamps) / 8 _ 100}%` }} /><b>{customerStamps}</b></span><span>{last}</span></Pressable>)}</div>
{plan === 'free' && <PlanLock />}
</article>
</div>
</div>
)
}

function RedeemPage({ code, validated, setValidated, plan }: { code: string; validated: boolean; setValidated: (value: boolean) => void; plan: Plan }) {
const [value, setValue] = useState(code)
const [message, setMessage] = useState<'idle' | 'valid' | 'used' | 'invalid'>(validated ? 'used' : 'idle')
const validate = () => {
if (validated && value === code) setMessage('used')
else if (code && value.toUpperCase() === code) { setMessage('valid'); setValidated(true) }
else setMessage('invalid')
}
return (

<div className="business-page narrow-page">
<div className="page-heading"><span>Operación en caja</span><Title as="h2">Validar canje</Title><p>Escribe o escanea el código que aparece en la app del cliente.</p></div>
{plan === 'free' && <div className="upgrade-banner"><Icon name="lock" />Activa tu programa de fidelidad y vuelve a ver a tus clientes</div>}
<div className={`redeem-panel ${plan === 'free' ? 'feature-preview-locked' : ''}`}>
<div className="scanner-graphic"><Icon name="scan" size={48} /></div>
<label htmlFor="business-code">Código del cliente</label>
<Field id="business-code" value={value} onChange={event => { setValue(event.target.value.toUpperCase()); setMessage('idle') }} placeholder="TC-000" maxLength={6} />
<Button icon="check" onClick={validate} disabled={!value}>Validar código</Button>
<div className="or"><span>o</span></div><Button variant="outline" icon="scan">Escanear desde pantalla</Button>
{!code && <div className="status-message neutral"><Icon name="person" /><span><strong>Aún no hay un código activo</strong><small>Genéralo primero desde la vista Consumidor.</small></span></div>}
{message === 'valid' && <div className="status-message success"><Icon name="check" /><span><strong>Código válido · premio autorizado</strong><small>Entrega 1 taco de asada a Alex Rivera. Este código quedó marcado como canjeado.</small></span></div>}
{message === 'used' && <div className="status-message error"><Icon name="clock" /><span><strong>Código ya canjeado</strong><small>TC-345 fue utilizado hoy a las 18:45 para 1 taco de asada.</small></span></div>}
{message === 'invalid' && <div className="status-message error"><Icon name="lock" /><span><strong>Código no válido</strong><small>Revisa los caracteres o pide al cliente generar uno nuevo.</small></span></div>}
{plan === 'free' && <PlanLock />}
</div>
</div>
)
}

function BusinessLoyaltyPage({ plan }: { plan: Plan }) {
const [active, setActive] = useState(true)
const [prizes, setPrizes] = useState(['1 taco de asada','1 orden clásica'])
return (

<div className="business-page narrow-page">
<div className="page-heading"><span>Programa exclusivo del local</span><Title as="h2">Fidelidad</Title><p>Configura los incentivos que tu negocio cubre para premiar la recurrencia.</p></div>
{plan === 'free' && <div className="upgrade-banner"><Icon name="lock" />Activa tu programa de fidelidad y vuelve a ver a tus clientes</div>}
<div className={plan === 'free' ? 'feature-preview-locked loyalty-preview' : ''}>
<div className="program-toggle"><div><span className={active ? 'active' : ''}><Icon name={active ? 'check' : 'clock'} /></span><div><strong>Programa {active ? 'activo' : 'pausado'}</strong><small>{active ? 'Los clientes pueden acumular sellos' : 'No se otorgarán sellos nuevos'}</small></div></div><Pressable className={`switch ${active ? 'on' : ''}`} onClick={() => setActive(!active)}><i /></Pressable></div>
<div className="program-rules"><span><Icon name="qr" /><strong>1 sello por visita</strong><small>Validada con QR</small></span><span><Icon name="lock" /><strong>Abre en visita 3</strong><small>Solo para este local</small></span></div>
<Title as="h3" className="section-title">Premios configurados</Title>
{prizes.map((prize,index) => <div className="prize-editor" key={index}><div><Icon name={index ? 'crown' : 'gift'} /><span>Sello {index ? 8 : 4}</span></div><label>Premio para el cliente<Field value={prize} onChange={event => setPrizes(prizes.map((item,i) => i === index ? event.target.value : item))} /></label><span><small>Costo estimado</small><strong>{index ? '$78' : '$24'}</strong></span></div>)}
{plan === 'premium' && <div className="business-coupon"><Icon name="ticket" /><span><strong>Cupón activo</strong><small>2×1 en agua fresca · 34 clientes alcanzados</small></span><Button variant="outline" icon="edit">Editar</Button></div>}
<div className="business-note"><Icon name="spark" /><p><strong>Recomendación</strong> Mantén el costo del premio debajo del 20% de tu ticket promedio.</p></div>
{plan === 'free' && <PlanLock />}
</div>
</div>
)
}

function BusinessQrPage() {
const [ordered, setOrdered] = useState(false)
return (

<div className="business-page qr-page">
<div className="page-heading"><span>Punto de contacto</span><Title as="h2">Mi QR</Title><p>Colócalo cerca de caja para verificar visitas y entregar cartas.</p></div>
<div className="business-qr-card"><Logo /><FakeQR /><Title as="h3">Escanea y colecciona</Title><p>ID · TEC-ZR-0184</p></div>
<div className="kit-panel"><div className="kit-art"><span>TC<small>ESCANEA AQUÍ</small></span><i>TC</i></div><span>Kit impreso</span><Title as="h3">Que nadie se vaya sin escanear</Title><p>Incluye 2 tent cards, 4 stickers y una guía para tu equipo.</p>{ordered ? <div className="status-message success"><Icon name="check" /><span><strong>Solicitud recibida</strong><small>Te contactaremos para confirmar el envío.</small></span></div> : <Button onClick={() => setOrdered(true)}>Pedir kit por $199</Button>}</div>
</div>
)
}

function PlanPage({ goDashboard, plan, onActivatePremium }: { goDashboard: () => void; plan: Plan; onActivatePremium: () => void }) {
const [orders, setOrders] = useState(100)
const [showUpgrade, setShowUpgrade] = useState(false)
const delivery = Math.round(orders _ 176 _ .3 \* 1.16)
return (

<div className="business-page plan-page">
<div className="page-heading"><span>Crece sin regalar tu margen</span><Title as="h2">Planes y ahorro</Title><p>Compara el costo fijo de TacoCards con una comisión por pedido.</p></div>
<div className="plan-cards"><article className={plan === 'free' ? 'current-plan' : ''}>{plan === 'free' && <b>PLAN ACTUAL</b>}<span>Gratis</span><Title as="h3">$0</Title><p>QR y carta coleccionable.</p><ul><li><Icon name="check" />Perfil básico</li><li><Icon name="check" />QR de visitas</li></ul></article><article className={`featured ${plan === 'premium' ? 'current-plan' : ''}`}><b>{plan === 'premium' ? 'PLAN ACTUAL' : 'RECOMENDADO'}</b><span>Destacado</span><Title as="h3">$249 <small>/mes</small></Title><p>Fidelidad, cupones y analítica.</p><ul><li><Icon name="check" />Tarjeta de 8 sellos</li><li><Icon name="check" />Dashboard y estadísticas</li><li><Icon name="check" />Cupones segmentados</li></ul></article></div>
      <div className="plan-calculator"><div><span>Pedidos al mes</span><strong>{orders}</strong></div><Field type="range" min="20" max="200" step="10" value={orders} onChange={event => setOrders(Number(event.target.value))} aria-label="Pedidos al mes" /><p>Ticket promedio $176, comisión 30% + IVA.</p><div className="comparison"><span><small>App de reparto</small><strong>${delivery.toLocaleString('es-MX')}</strong><em>al mes</em></span><span><small>TacoCards</small><strong>$249</strong><em>al mes</em></span></div><div className="break-even"><Icon name="trend" /><span><strong>Con 2 visitas extra al mes, la cuota se paga sola.</strong><small>Ahorro potencial: ${(delivery - 249).toLocaleString('es-MX')} MXN/mes.</small></span></div></div>
<div className="plan-actions"><Button variant="primary" icon="crown" onClick={() => plan === 'free' && setShowUpgrade(true)}>{plan === 'free' ? 'Subir a Destacado · $249/mes' : 'Destacado activo'}</Button><Button variant="outline" icon="chart" onClick={goDashboard}>Ver ROI en Dashboard</Button></div>
{showUpgrade && <div className="upgrade-sheet-backdrop" onClick={() => setShowUpgrade(false)}><div className="upgrade-sheet business-upgrade-sheet" onClick={event => event.stopPropagation()}><i /><span className="kicker">Plan Destacado</span><Title as="h2">Convierte visitas en clientes recurrentes</Title><div className="upgrade-comparison"><span><strong>Gratis</strong><small>QR y carta</small><small>1 KPI básico</small></span><span><strong>Destacado</strong><small>Fidelidad y canjes</small><small>Dashboard completo</small><small>Cupones y ROI</small></span></div><div className="sheet-saving"><Icon name="trend" /><span><strong>Ahorras ${Math.max(0,delivery - 249).toLocaleString('es-MX')} al mes</strong><small>frente al costo estimado de reparto</small></span></div><Button onClick={() => { onActivatePremium(); setShowUpgrade(false) }}>Activar Plan Destacado</Button></div></div>}
</div>
)
}

function BusinessDevice({ view, setView, code, validated, setValidated, plan, onActivatePremium }: { view: BusinessView; setView: (view: BusinessView) => void; code: string; validated: boolean; setValidated: (value: boolean) => void; plan: Plan; onActivatePremium: () => void }) {
let page: ReactNode
if (view === 'dashboard') page = <Dashboard plan={plan} />
else if (view === 'redeem') page = <RedeemPage code={code} validated={validated} setValidated={setValidated} plan={plan} />
else if (view === 'loyalty') page = <BusinessLoyaltyPage plan={plan} />
else if (view === 'qr') page = <BusinessQrPage />
else page = <PlanPage goDashboard={() => setView('dashboard')} plan={plan} onActivatePremium={onActivatePremium} />
return <div className="phone-frame business-device"><div className="phone-notch" /><div className="phone-screen"><PhoneStatusBar /><div className="business-phone-view">{page}</div><BusinessNav view={view} setView={setView} /></div></div>
}

export default function App() {
const [role, setRole] = useState<Role>('consumer')
const [plan, setPlan] = useState<Plan>('free')
const [compare, setCompare] = useState(false)
const [consumerView, setConsumerView] = useState<ConsumerView>('map')
const [businessView, setBusinessView] = useState<BusinessView>('dashboard')
const [visits, setVisits] = useState(2)
const [stamps, setStamps] = useState(1)
const [code, setCode] = useState('')
const [validated, setValidated] = useState(false)
const changeRole = (next: Role) => {
setRole(next)
if (next === 'business' && code) setBusinessView('redeem')
}
const activatePremium = () => {
setPlan('premium')
setCompare(false)
}
return (

<div className="site-shell theme-light">
<FixedHeader role={role} setRole={changeRole} compare={compare} setCompare={setCompare} />
<section className={`product-stage ${role}`}>
{compare && (
<div className="comparison-selector">
<span>Comparar pantalla</span>
<div>
{(role === 'consumer'
? [['map','Mapa'],['album','Álbum'],['loyalty','Fidelidad'],['profile','Perfil']]
: [['dashboard','Dashboard'],['redeem','Canjes'],['loyalty','Fidelidad'],['qr','Mi QR'],['plan','Plan']]
).map(([id,label]) => <Pressable key={id} className={(role === 'consumer' ? consumerView : businessView) === id ? 'active' : ''} onClick={() => role === 'consumer' ? setConsumerView(id as ConsumerView) : setBusinessView(id as BusinessView)}>{label}</Pressable>)}
</div>
</div>
)}
<div className={compare ? 'comparison-phones' : 'single-phone'}>
{(compare ? (['free','premium'] as Plan[]) : [plan]).map((shownPlan,index) => (
<div className="phone-take" key={shownPlan}>
{compare && <div className="take-label"><span>Toma {index + 1}</span><strong>Plan {shownPlan === 'free' ? 'Gratis' : 'Premium'}</strong></div>}
{role === 'consumer'
? <ConsumerDevice view={consumerView} setView={setConsumerView} visits={visits} setVisits={setVisits} stamps={stamps} setStamps={setStamps} code={code} setCode={setCode} plan={shownPlan} onActivatePremium={activatePremium} />
: <BusinessDevice view={businessView} setView={setBusinessView} code={code} validated={validated} setValidated={setValidated} plan={shownPlan} onActivatePremium={activatePremium} />}
{compare && <p className="take-difference">{role === 'consumer'
? shownPlan === 'free' ? 'Gratis: Taco de Oro, cupones y rutas bloqueados.' : 'Premium: Pase, cupones y rutas desbloqueados.'
: shownPlan === 'free' ? 'Gratis: analítica avanzada y fidelidad bloqueadas.' : 'Premium: dashboard y recurrencia completos.'}</p>}
</div>
))}
</div>
</section>
</div>
)
}

```[REFERENCIA AQUÍ]-
[CÓDIGO APP.TSX AQUÍ]

---

[CÓDIGO INDEX.CSS AQUÍ]
```

````css

```@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
@import 'tailwindcss';

:root {
  --bg: #fbf4e8;
  --bg-2: #f4eadc;
  --panel: #ffffff;
  --panel-2: #f6ecdf;
  --panel-3: #ecddca;
  --ink: #2a1a0e;
  --muted: #695b4e;
  --dim: #8a7969;
  --gold: #dcb45d;
  --gold-light: #ffe29a;
  --teal: #3db6aa;
  --teal-dark: #216d69;
  --terra: #d46643;
  --green: #62bb7e;
  --red: #df6b61;
  --blue: #65a9c7;
  --purple: #a477d6;
  --line: rgba(76, 46, 25, .13);
  --line-strong: rgba(76, 46, 25, .25);
  --display: 'Cinzel', Georgia, serif;
  --sans: 'Manrope', system-ui, sans-serif;
  font-family: var(--sans);
  color: var(--ink);
  background: #fbf4e8;
}

@layer base {
  * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: #4b3a2c transparent; }
  body { margin: 0; min-width: 320px; min-height: 100vh; background: var(--bg); }
  button, input { font: inherit; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 3px; }
  button:disabled { opacity: .45; cursor: not-allowed; }
  img { display: block; }
}

#root { min-height: 100vh; }
.site-shell { min-height: 100vh; overflow: hidden; background: radial-gradient(circle at 20% 5%, rgba(212,102,67,.12), transparent 26%), radial-gradient(circle at 90% 35%, rgba(61,182,170,.07), transparent 26%), var(--bg); }
.site-shell::before { content: ''; position: fixed; inset: 0; pointer-events: none; opacity: .035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); z-index: 50; }

.fixed-header { position: fixed; z-index: 100; inset: 0 0 auto; height: 78px; background: rgba(16,12,9,.88); backdrop-filter: blur(20px); border-bottom: 1px solid var(--line); }
.header-inner { max-width: 1400px; height: 100%; margin: auto; padding: 0 28px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.logo { display: flex; align-items: center; gap: 12px; }
.logo-diamond { width: 42px; height: 42px; display: grid; place-items: center; color: var(--gold-light); border: 1px solid var(--gold); background: linear-gradient(145deg,#3b2b1c,#15100c); transform: rotate(45deg); box-shadow: inset 0 0 0 4px #17110d; }
.logo-diamond span { transform: rotate(-45deg); font: 700 12px var(--display); }
.logo > div:last-child { display: flex; flex-direction: column; }
.logo strong { font: 700 20px/1 var(--display); }
.logo small { color: var(--gold); font-size: 8px; letter-spacing: .26em; margin-top: 6px; }
.role-toggle { display: grid; grid-template-columns: 1fr 1fr; width: 360px; padding: 5px; border-radius: 15px; background: var(--panel); border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.role-toggle button { min-height: 43px; border: 0; border-radius: 10px; background: transparent; color: var(--muted); display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; transition: .25s; }
.role-toggle button.active { color: #1a120b; background: linear-gradient(135deg,var(--gold-light),var(--gold)); box-shadow: 0 7px 18px rgba(220,180,93,.2); }
.competition-label { justify-self: end; color: var(--gold-light); border: 1px solid var(--line-strong); border-radius: 20px; padding: 9px 12px; display: flex; align-items: center; gap: 7px; font-size: 9px; text-transform: uppercase; letter-spacing: .09em; font-weight: 800; }

.pitch-header { max-width: 1400px; margin: 0 auto; padding: 130px 28px 55px; display: grid; grid-template-columns: 1.08fr .92fr; gap: 36px 80px; }
.pitch-copy .kicker, .kicker { color: var(--gold); text-transform: uppercase; letter-spacing: .17em; font-size: 9px; font-weight: 800; }
.pitch-copy h1 { font: 700 clamp(38px,5vw,68px)/1.04 var(--display); letter-spacing: -.04em; margin: 14px 0 20px; max-width: 760px; }
.pitch-copy h1 em { color: var(--gold-light); font-style: normal; }
.pitch-copy p { color: var(--muted); font-size: 15px; line-height: 1.75; max-width: 650px; }
.pitch-story { display: grid; grid-template-columns: 1fr; gap: 8px; align-self: end; }
.pitch-story article { padding: 15px 17px; border: 1px solid var(--line); background: rgba(30,23,18,.65); border-radius: 12px; display: grid; grid-template-columns: 110px 1fr; gap: 14px; align-items: center; }
.pitch-story span { color: var(--teal); font-size: 8px; text-transform: uppercase; letter-spacing: .11em; font-weight: 800; }
.pitch-story strong { font-size: 11px; line-height: 1.5; }
.pitch-numbers { grid-column: 1/-1; display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
.pitch-numbers > div { padding: 16px 18px; border-left: 2px solid var(--gold); background: linear-gradient(110deg,rgba(40,30,23,.8),rgba(29,22,17,.5)); }
.pitch-numbers span { color: var(--muted); display: block; font-size: 8px; }
.pitch-numbers strong { display: block; color: var(--gold-light); font: 700 23px var(--display); margin: 6px 0 4px; font-variant-numeric: tabular-nums; }
.pitch-numbers small { color: var(--dim); font-size: 7px; }

.product-stage { border-top: 1px solid var(--line); padding: 140px 28px 90px; background: linear-gradient(180deg,rgba(34,25,19,.55),transparent 350px); }
.stage-heading { max-width: 1400px; margin: 0 auto 34px; display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; }
.stage-heading h2 { font: 700 clamp(25px,3vw,38px) var(--display); margin-top: 8px; }
.stage-heading p { color: var(--muted); max-width: 490px; font-size: 11px; line-height: 1.65; text-align: right; }

.phone-frame { width: 430px; height: 840px; margin: auto; padding: 12px; position: relative; border-radius: 48px; background: linear-gradient(145deg,#5a5047,#1b1714 20%,#080706 78%,#4b4239); box-shadow: 0 50px 120px rgba(0,0,0,.6), inset 0 0 0 2px #060504, inset 0 0 0 3px rgba(255,255,255,.12); }
.phone-screen { height: 100%; border-radius: 36px; overflow: hidden; position: relative; background: var(--bg); }
.phone-notch { position: absolute; z-index: 20; left: 50%; top: 12px; transform: translateX(-50%); width: 112px; height: 25px; border-radius: 0 0 17px 17px; background: #050403; }
.phone-home { position: absolute; z-index: 20; bottom: 18px; left: 50%; transform: translateX(-50%); width: 105px; height: 4px; border-radius: 5px; background: rgba(255,255,255,.55); }
.phone-view { height: 100%; overflow-y: auto; overflow-x: hidden; padding-bottom: 80px; animation: view-in .35s ease both; }
@keyframes view-in { from { opacity: 0; transform: translateY(6px); } }
.standard-view { padding: 46px 18px 92px; }
.phone-heading { padding: 46px 18px 15px; display: flex; justify-content: space-between; align-items: center; }
.standard-view > .phone-heading { padding: 0 0 17px; }
.phone-heading div > span { color: var(--gold); font-size: 8px; text-transform: uppercase; letter-spacing: .12em; font-weight: 800; }
.phone-heading h2 { font: 700 22px var(--display); margin-top: 3px; }
.level,.points { color: var(--gold-light); font-size: 9px; font-weight: 800; }
.consumer-nav { position: absolute; z-index: 12; bottom: 0; left: 0; right: 0; height: 76px; display: grid; grid-template-columns: repeat(4,1fr); padding: 6px 14px 14px; background: rgba(18,13,10,.95); backdrop-filter: blur(18px); border-top: 1px solid var(--line); }
.consumer-nav button { border: 0; background: transparent; color: var(--dim); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 7px; font-weight: 800; }
.consumer-nav button.active { color: var(--gold-light); }

.button { min-height: 48px; border-radius: 12px; padding: 0 18px; border: 0; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; font-weight: 800; transition: transform .2s,filter .2s; }
.button:active { transform: scale(.98); }
.button-primary { color: #1f160d; background: linear-gradient(135deg,var(--gold-light),var(--gold)); box-shadow: 0 10px 24px rgba(220,180,93,.15); }
.button-outline { color: var(--ink); border: 1px solid var(--line-strong); background: var(--panel-2); }
.button-quiet { color: var(--muted); border: 1px solid var(--line); background: transparent; }
.button-teal { color: #071918; background: linear-gradient(135deg,#70d9cc,var(--teal)); }

.map-filters { padding: 0 18px 12px; display: flex; gap: 6px; overflow-x: auto; }
.map-filters button { border: 1px solid var(--line); border-radius: 17px; background: var(--panel); color: var(--muted); padding: 7px 11px; white-space: nowrap; font-size: 8px; font-weight: 800; }
.map-filters button.active { color: #24180d; border-color: var(--gold); background: var(--gold); }
.tijuana-map { height: 565px; position: relative; overflow: hidden; background: radial-gradient(circle at 35% 20%,#34281e,transparent 28%),linear-gradient(145deg,#241b15,#15110e); }
.tijuana-map::before { content: ''; position: absolute; inset: 0; opacity: .28; background-image: linear-gradient(30deg,transparent 47%,#5b483a 48%,#5b483a 50%,transparent 51%),linear-gradient(110deg,transparent 47%,#4e4036 48%,#4e4036 50%,transparent 51%); background-size: 70px 70px,90px 90px; }
.road { position: absolute; width: 560px; height: 12px; left: -70px; border: 4px solid #2f251e; background: #68564a; }
.road.r1 { top: 170px; transform: rotate(19deg); }.road.r2 { top: 340px; transform: rotate(-16deg); }.road.r3 { top: 270px; transform: rotate(76deg); }
.zone { position: absolute; z-index: 1; color: rgba(246,239,223,.48); font-size: 7px; text-transform: uppercase; letter-spacing: .14em; font-weight: 800; }
.zone.rio { top: 55px; right: 32px; }.zone.centro { top: 280px; left: 25px; }.zone.rev { bottom: 85px; right: 26px; transform: rotate(-14deg); }
.map-pin { position: absolute; z-index: 3; width: 37px; height: 37px; border: 3px solid rgba(255,255,255,.68); border-radius: 50% 50% 50% 6px; transform: rotate(-45deg); display: grid; place-items: center; color: white; background: var(--terra); box-shadow: 0 8px 20px rgba(0,0,0,.45); }
.map-pin svg { transform: rotate(45deg); }.map-pin.selected { background: var(--gold); color: #25170c; transform: rotate(-45deg) scale(1.18); box-shadow: 0 0 0 8px rgba(220,180,93,.12),0 8px 20px #000; }
.map-pin.p1 { top: 128px; left: 58px; }.map-pin.p2 { top: 220px; right: 70px; background: var(--terra); }.map-pin.p3 { top: 310px; left: 142px; background: var(--teal); }.map-pin.p4 { top: 410px; left: 48px; }.map-pin.p5 { top: 150px; right: 42px; background: var(--purple); }.map-pin.p6 { top: 402px; right: 38px; }
.map-place { position: absolute; z-index: 8; bottom: 91px; left: 15px; right: 15px; min-height: 110px; padding: 9px; display: grid; grid-template-columns: 90px 1fr auto; gap: 11px; align-items: center; text-align: left; color: var(--ink); border: 1px solid var(--line-strong); border-radius: 17px; background: rgba(31,23,18,.96); backdrop-filter: blur(18px); box-shadow: 0 18px 45px rgba(0,0,0,.45); }
.map-place img { width: 90px; height: 90px; object-fit: cover; border-radius: 11px; }.map-place .open { color: var(--green); font-size: 7px; text-transform: uppercase; font-weight: 800; }.map-place h3 { font: 700 14px var(--display); margin: 4px 0 2px; }.map-place p { color: var(--muted); font-size: 8px; }.map-place small { color: #dc8cf0; display: flex; align-items: center; gap: 4px; font-size: 7px; margin-top: 8px; }

.detail-view { padding-bottom: 82px; }
.detail-photo { height: 255px; position: relative; }.detail-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom,rgba(0,0,0,.08),transparent 45%,var(--bg)); }.detail-photo img { width: 100%; height: 100%; object-fit: cover; }
.circle-button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line-strong); background: rgba(16,12,9,.78); color: var(--ink); display: grid; place-items: center; }
.detail-photo .circle-button { position: absolute; z-index: 3; top: 39px; left: 17px; }.detail-photo > span { position: absolute; z-index: 3; bottom: 18px; right: 17px; color: #a0e0b5; background: rgba(16,12,9,.78); border: 1px solid rgba(98,187,126,.35); border-radius: 18px; padding: 7px 10px; font-size: 8px; font-weight: 800; }
.detail-copy { padding: 0 18px; }.detail-copy h2 { font: 700 24px var(--display); margin: 5px 0; }.detail-copy > p { color: var(--muted); font-size: 9px; line-height: 1.55; }
.local-facts { display: flex; gap: 8px; margin: 13px 0; }.local-facts span { flex: 1; padding: 9px; border: 1px solid var(--line); border-radius: 9px; color: var(--muted); display: flex; align-items: center; gap: 6px; font-size: 7px; }.local-facts svg { color: var(--gold); }
.detail-card { display: grid; grid-template-columns: 115px 1fr; gap: 13px; align-items: center; }.detail-card .collectible { height: 161px; }.detail-card h3 { font: 700 13px var(--display); margin: 7px 0 5px; }.detail-card p { color: var(--muted); font-size: 8px; line-height: 1.5; }.rarity-chip { color: #ed99ff; border: 1px solid rgba(222,113,255,.34); padding: 4px 7px; border-radius: 10px; text-transform: uppercase; font-size: 6px; font-weight: 800; }
.visit-meter { margin-top: 14px; padding: 11px; border: 1px solid var(--line); border-radius: 11px; background: var(--panel); }.visit-meter > div { display: flex; justify-content: space-between; font-size: 8px; }.visit-meter strong { color: var(--gold-light); }.visit-meter > i { display: block; height: 4px; background: #4b392b; border-radius: 5px; margin: 8px 0 6px; overflow: hidden; }.visit-meter > i span { display: block; height: 100%; background: linear-gradient(90deg,var(--gold),var(--gold-light)); }.visit-meter small { color: var(--dim); font-size: 7px; }
.phone-sticky { position: absolute; z-index: 10; bottom: 0; left: 0; right: 0; padding: 13px 17px 18px; background: linear-gradient(to top,var(--bg) 72%,transparent); }.phone-sticky .button { width: 100%; }

/* Redesigned collectible cards */
.collectible { --rx: 0deg; --ry: 0deg; --mx: 50%; --my: 50%; display: block; width: 270px; aspect-ratio: 5/7; padding: 0; border: 0; background: transparent; perspective: 1100px; color: inherit; text-align: left; }
.card-tilt { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transform: rotateX(var(--rx)) rotateY(var(--ry)); transition: transform .18s ease; }
.collectible.flipped .card-tilt { transform: rotateY(calc(180deg + var(--ry))) rotateX(var(--rx)); }
.card-face { position: absolute; inset: 0; border-radius: 17px; backface-visibility: hidden; overflow: hidden; border: 7px solid #9d7541; box-shadow: 0 22px 48px rgba(0,0,0,.48), inset 0 0 0 2px rgba(255,244,205,.5); }
.card-face::after { content: ''; position: absolute; pointer-events: none; inset: 4px; border: 1px solid rgba(255,244,210,.45); border-radius: 8px; }
.card-front { background: #b4864b; background-image: radial-gradient(rgba(67,40,21,.18) 1px,transparent 1px),linear-gradient(140deg,#c79b5d,#936738); background-size: 5px 5px,auto; }
.card-meta { height: 39px; padding: 10px 10px 0; display: flex; justify-content: space-between; font: 700 8px var(--display); position: relative; z-index: 3; color: #2b190d; }
.rarity-gem { display: flex; align-items: center; gap: 4px; text-transform: uppercase; }.rarity-gem i { width: 10px; height: 10px; transform: rotate(45deg); background: #754f2e; border: 1px solid rgba(255,255,255,.5); }
.papel { position: absolute; z-index: 4; width: 30px; height: 22px; background: currentColor; color: #e4bf78; clip-path: polygon(0 0,100% 0,100% 55%,85% 40%,70% 70%,55% 38%,38% 75%,20% 42%,0 62%); opacity: .75; }.papel.top-left { top: 2px; left: 2px; }.papel.top-right { top: 2px; right: 2px; transform: scaleX(-1); }.papel.bottom-left { bottom: 2px; left: 2px; transform: scaleY(-1); }.papel.bottom-right { bottom: 2px; right: 2px; transform: scale(-1); }
.illustration { height: 49%; margin: 0 9px; overflow: hidden; border: 3px solid rgba(49,25,12,.8); position: relative; background: #d9a65c; box-shadow: inset 0 0 0 2px rgba(255,226,158,.45); }
.illustration svg { width: 100%; height: 100%; display: block; filter: url("#none"); }.illustration .sun { fill: #d18a3e; }.illustration .ray { fill: none; stroke: #f0c16a; stroke-width: 18; stroke-dasharray: 6 11; opacity: .65; }.illustration .plate { fill: #f1c46d; stroke: #382116; stroke-width: 6; }.illustration .food { fill: #5b8d64; stroke: #382116; stroke-width: 6; stroke-linejoin: round; }.illustration .food.second { fill: #c35336; }.illustration .line { fill: none; stroke: #382116; stroke-width: 5; stroke-linecap: round; }.illustration .dots { fill: #c35336; stroke: #382116; stroke-width: 3; }
.card-band { padding: 9px 12px 0; text-align: center; color: #29180d; position: relative; z-index: 2; }.local-type { display: block; font-size: 6px; text-transform: uppercase; letter-spacing: .12em; font-weight: 800; }.card-band h3 { font: 700 17px/1.04 var(--display); margin: 4px 0 3px; }.card-band > p { font-size: 6px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.card-stats { margin-top: 8px; display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid rgba(47,26,13,.34); padding-top: 7px; }.card-stats div { display: grid; grid-template-columns: auto 1fr; align-items: center; justify-items: start; padding: 0 5px; border-right: 1px solid rgba(47,26,13,.28); }.card-stats div:last-child { border: 0; }.card-stats svg { grid-row: 1/3; margin-right: 4px; }.card-stats span { font-size: 5px; text-transform: uppercase; }.card-stats strong { font-size: 8px; font-variant-numeric: tabular-nums; }
.ai-label { position: absolute; z-index: 5; bottom: 7px; left: 12px; white-space: nowrap; color: rgba(40,22,11,.66); font-size: 5px; text-transform: uppercase; letter-spacing: .08em; }
.flip-hint { position: absolute; z-index: 7; right: 11px; bottom: 6px; display: flex; align-items: center; gap: 3px; color: rgba(40,22,11,.72); font-size: 4.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; }
.card-back { transform: rotateY(180deg); padding: 19px; color: var(--ink); background: radial-gradient(circle at 50% 17%,rgba(220,180,93,.12),transparent 27%),repeating-linear-gradient(45deg,#21150f,#21150f 9px,#2a1b12 9px,#2a1b12 18px); border-color: var(--gold); text-align: left; display: flex; flex-direction: column; align-items: stretch; }
.back-identity { display: flex; justify-content: space-between; color: var(--gold); font: 700 6px var(--display); text-transform: uppercase; letter-spacing: .08em; }
.back-kicker { display: block; color: var(--gold); text-transform: uppercase; letter-spacing: .16em; font-size: 6px; margin-top: 16px; }
.card-back h3 { font: 700 17px/1.08 var(--display); margin: 4px 0 9px; }
.owner-chip { display: flex; align-items: center; gap: 8px; padding: 7px; border: 1px solid rgba(220,180,93,.2); border-radius: 8px; background: rgba(220,180,93,.06); }
.owner-chip > span { width: 28px; height: 28px; flex: 0 0 auto; border-radius: 50%; display: grid; place-items: center; color: #281a0e; background: var(--gold); font: 800 7px var(--sans); }
.owner-chip > div { display: flex; flex-direction: column; }
.owner-chip strong { font-size: 7px; }
.owner-chip small { color: var(--muted); font-size: 5px; margin-top: 2px; }
.owner-story { color: #d4c6b5; font: 500 7px/1.55 var(--sans); margin: 10px 0 7px; }
.back-hours { display: flex; align-items: center; gap: 5px; color: var(--gold-light); font-size: 6px; padding-bottom: 7px; border-bottom: 1px solid rgba(220,180,93,.13); }
.back-action { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.back-action > span { display: flex; flex-direction: column; }
.back-action strong { color: var(--ink); font-size: 6px; }
.back-action small { color: var(--dim); font-size: 4.5px; line-height: 1.35; margin-top: 2px; }
.back-hint { color: var(--gold); right: 12px; bottom: 7px; }
.fake-qr { width: 190px; height: 190px; padding: 12px; display: grid; grid-template-columns: repeat(9,1fr); gap: 2px; background: #efe4ce; border-radius: 8px; }.fake-qr i.on { background: #21160e; }.fake-qr.small { width: 82px; height: 82px; padding: 7px; gap: 1px; }
.collectible.rara .card-face { border-color: #b6c8ca; box-shadow: 0 22px 48px rgba(0,0,0,.48),0 0 22px rgba(170,220,230,.16),inset 0 0 0 2px #e4f0ed; }.collectible.rara .card-front { background: linear-gradient(135deg,#a7c2bd,#708f94 45%,#c1a978); }.collectible.rara .illustration { border-color: rgba(39,70,73,.8); }.collectible.rara .illustration .sun { fill: #81aeb1; }.collectible.rara .illustration .plate { fill: #d6e1d8; stroke: #27464a; }.collectible.rara .illustration .food { fill: #da8b70; stroke: #27464a; }.collectible.rara .illustration .line { stroke: #27464a; }.collectible.rara .card-band,.collectible.rara .card-meta { color: #18383a; }.collectible.rara .rarity-gem i { background: #d9f0ef; }
.collectible.epica .card-face { border-color: #c459e3; box-shadow: 0 22px 48px rgba(0,0,0,.55),0 0 28px rgba(214,72,255,.34),inset 0 0 0 2px #65eff2; }.collectible.epica .card-front { background: linear-gradient(145deg,#1d1642,#8625a0 50%,#123a55); }.collectible.epica .illustration { border-color: #60f2e6; box-shadow: 0 0 13px rgba(96,242,230,.4); }.collectible.epica .illustration .sun { fill: #1e224a; }.collectible.epica .illustration .ray { stroke: #fa52e0; }.collectible.epica .illustration .plate { fill: #50d3c3; stroke: #130c27; }.collectible.epica .illustration .food { fill: #f25f88; stroke: #130c27; }.collectible.epica .illustration .food.second { fill: #edbd3f; }.collectible.epica .illustration .line { stroke: #6cf0ea; }.collectible.epica .card-band,.collectible.epica .card-meta { color: #f5e9ff; }.collectible.epica .rarity-gem i { background: #ef54ff; box-shadow: 0 0 8px #ef54ff; }.collectible.epica .papel { color: #4ce0dc; }.collectible.epica .card-stats { border-color: rgba(255,255,255,.25); }
.collectible.legendaria .card-face { border-color: #ffe078; box-shadow: 0 22px 55px rgba(0,0,0,.55),0 0 32px rgba(255,210,76,.28),inset 0 0 0 2px #fff2a9; }.collectible.legendaria .card-front { background: linear-gradient(135deg,#6c4213,#f5cd66 40%,#aa5e20 70%,#ffeaa2); }.collectible.legendaria .foil { position: absolute; z-index: 6; inset: 0; pointer-events: none; opacity: .24; background: radial-gradient(circle at var(--mx) var(--my),white 0,rgba(255,113,236,.7) 8%,rgba(76,225,255,.6) 16%,rgba(255,226,95,.3) 26%,transparent 43%); mix-blend-mode: color-dodge; }.collectible.legendaria .illustration .sun { fill: #d69226; }.collectible.legendaria .illustration .plate { fill: #fff0a8; }.collectible.legendaria .rarity-gem i { background: linear-gradient(135deg,#fff8b3,#d579ff,#52e4eb); box-shadow: 0 0 9px white; }
.collectible.compact { width: 100%; aspect-ratio: 5/7; }.collectible.compact .card-face { border-width: 4px; border-radius: 11px; }.collectible.compact .card-meta { height: 25px; padding: 6px 6px 0; font-size: 5px; }.collectible.compact .rarity-gem { font-size: 0; }.collectible.compact .rarity-gem i { width: 7px; height: 7px; }.collectible.compact .illustration { margin: 0 5px; border-width: 2px; }.collectible.compact .card-band { padding: 5px 6px 0; }.collectible.compact .local-type { font-size: 4px; }.collectible.compact .card-band h3 { font-size: 9px; margin: 2px 0 1px; }.collectible.compact .card-band > p { font-size: 3.5px; }.collectible.compact .card-stats { margin-top: 4px; padding-top: 3px; }.collectible.compact .card-stats svg { width: 8px; }.collectible.compact .card-stats span { display: none; }.collectible.compact .card-stats strong { font-size: 5px; }.collectible.compact .ai-label { font-size: 2.7px; bottom: 4px; left: 7px; }.collectible.compact .flip-hint { font-size: 0; right: 6px; bottom: 3px; }.collectible.compact .flip-hint svg { width: 7px; }.collectible.compact .papel { width: 17px; height: 13px; }.collectible.compact .card-back { padding: 8px; }.collectible.compact .back-identity { font-size: 3.5px; }.collectible.compact .back-kicker { font-size: 3.5px; margin-top: 5px; }.collectible.compact .card-back h3 { font-size: 8px; margin: 2px 0 4px; }.collectible.compact .owner-chip { padding: 3px; gap: 4px; border-radius: 4px; }.collectible.compact .owner-chip > span { width: 16px; height: 16px; font-size: 4px; }.collectible.compact .owner-chip strong { font-size: 4px; }.collectible.compact .owner-chip small { font-size: 3px; }.collectible.compact .owner-story { font-size: 3.8px; line-height: 1.35; margin: 4px 0 3px; }.collectible.compact .back-hours { padding-bottom: 3px; font-size: 3px; }.collectible.compact .back-hours svg { width: 7px; }.collectible.compact .back-action { gap: 4px; margin-top: 3px; }.collectible.compact .fake-qr.small { width: 30px; height: 30px; padding: 2px; }.collectible.compact .back-action strong { font-size: 3.5px; }.collectible.compact .back-action small { font-size: 2.8px; }
.collectible.locked .card-face { filter: grayscale(.85) brightness(.64); }.locked-art { position: absolute; z-index: 7; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; color: #f2e4cc; background: rgba(21,14,10,.65); }.locked-art span { font: 700 32px var(--display); opacity: .35; }

.scan-view { padding: 38px 0 24px; background: #090706; }.scan-top { display: flex; align-items: center; gap: 11px; padding: 0 17px 10px; }.scan-top span { color: var(--gold); font-size: 7px; text-transform: uppercase; }.scan-top h2 { font: 700 18px var(--display); }
.camera-view { height: 490px; position: relative; overflow: hidden; }.camera-view > img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.38) saturate(.6); }.camera-view::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle,transparent 5%,rgba(0,0,0,.34) 75%); }.scan-frame { position: absolute; z-index: 3; width: 245px; height: 245px; left: 50%; top: 47%; transform: translate(-50%,-50%); }.scan-frame > span { position: absolute; width: 44px; height: 44px; border-color: var(--gold-light); border-style: solid; }.scan-frame > span:nth-of-type(1) { left: 0; top: 0; border-width: 3px 0 0 3px; }.scan-frame > span:nth-of-type(2) { right: 0; top: 0; border-width: 3px 3px 0 0; }.scan-frame > span:nth-of-type(3) { left: 0; bottom: 0; border-width: 0 0 3px 3px; }.scan-frame > span:nth-of-type(4) { right: 0; bottom: 0; border-width: 0 3px 3px 0; }.scan-frame > i { position: absolute; left: 8px; right: 8px; height: 2px; background: var(--gold-light); box-shadow: 0 0 14px var(--gold); animation: scanning 2s ease-in-out infinite alternate; }@keyframes scanning { to { transform: translateY(237px); } }
.camera-view > p { position: absolute; z-index: 3; bottom: 20px; left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 8px 11px; border-radius: 16px; background: rgba(8,6,5,.76); font-size: 8px; }
.scan-actions { padding: 15px 18px; text-align: center; }.scan-actions > span { color: var(--green); font-size: 7px; display: flex; justify-content: center; align-items: center; gap: 4px; }.scan-actions h3 { font: 700 14px var(--display); margin: 8px 0 11px; }.scan-actions .button { width: 100%; }
.reveal-area { text-align: center; padding: 15px 20px 25px; position: relative; background: radial-gradient(circle at 50% 35%,rgba(166,48,194,.18),transparent 45%); }.reveal-area > h2 { font: 700 22px var(--display); margin: 5px 0 15px; }.reveal-area .collectible { width: 225px; margin: auto; animation: card-arrive .8s cubic-bezier(.2,.8,.2,1.2) both; }@keyframes card-arrive { from { opacity: 0; transform: scale(.65) rotateY(110deg); } }
.earned { display: grid; grid-template-columns: auto auto; justify-content: center; gap: 2px 5px; align-items: center; margin: 13px 0; color: var(--gold); }.earned span { grid-column: 1/-1; color: var(--muted); font-size: 7px; }.reveal-area > .button { width: 100%; }.confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }.confetti i { position: absolute; left: calc((var(--n) * 37) % 100 * 1%); top: -15px; width: 6px; height: 10px; background: var(--gold); animation: confetti 1.8s calc((var(--n) % 8) * .06s) ease-out both; }.confetti i:nth-child(3n) { background: var(--teal); }.confetti i:nth-child(3n+1) { background: #dd57ec; }@keyframes confetti { to { transform: translateY(600px) rotate(620deg); opacity: 0; } }

.album-progress { display: flex; gap: 14px; align-items: center; padding: 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); }.progress-ring { width: 70px; height: 70px; border-radius: 50%; display: grid; place-content: center; text-align: center; background: radial-gradient(circle,var(--panel) 62%,transparent 64%),conic-gradient(var(--gold) 37%,#4a392c 0); }.progress-ring strong { color: var(--gold-light); font: 700 18px var(--display); }.progress-ring span { color: var(--muted); font-size: 7px; }.album-progress > div:last-child > span { color: var(--gold); font-size: 7px; text-transform: uppercase; }.album-progress h3 { font: 700 13px var(--display); margin: 4px 0; }.album-progress p { color: var(--muted); font-size: 7px; }
.rarity-progress { display: grid; grid-template-columns: repeat(4,1fr); gap: 5px; margin: 8px 0 13px; }.rarity-progress span { padding: 7px 5px; border-top: 2px solid #936b43; background: var(--panel); color: var(--muted); font-size: 5px; display: flex; flex-direction: column; border-radius: 5px; }.rarity-progress span:nth-child(2) { border-color: var(--blue); }.rarity-progress span:nth-child(3) { border-color: #d65bea; }.rarity-progress span:nth-child(4) { border-color: var(--gold-light); }.rarity-progress strong { color: var(--ink); font-size: 8px; margin-top: 2px; }.album-filter { padding: 0 0 12px; }.album-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 11px; }

.locked-loyalty { text-align: center; padding: 40px 22px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }.locked-loyalty > div { width: 100px; height: 100px; border: 1px dashed var(--gold); border-radius: 50%; margin: 0 auto 18px; display: grid; place-items: center; color: var(--gold); }.locked-loyalty h2 { font: 700 22px var(--display); margin: 6px; }.locked-loyalty p { color: var(--muted); font-size: 9px; line-height: 1.55; }.three-visits { display: flex; justify-content: center; gap: 7px; margin-top: 17px; }.three-visits i { width: 35px; height: 6px; border-radius: 4px; background: #514034; }.three-visits i.done { background: var(--gold); }
.unlocked-note { display: flex; gap: 9px; padding: 10px; border: 1px solid rgba(220,180,93,.25); background: rgba(220,180,93,.07); color: var(--gold); border-radius: 10px; margin-bottom: 10px; }.unlocked-note span { display: flex; flex-direction: column; }.unlocked-note strong { color: var(--ink); font-size: 8px; }.unlocked-note small { color: var(--muted); font-size: 7px; margin-top: 2px; }
.stamp-card { padding: 15px; border: 1px solid var(--gold); border-radius: 17px; background: radial-gradient(circle at 90% 0,rgba(220,180,93,.15),transparent 25%),linear-gradient(145deg,#3d2919,#21160f); }.stamp-head { display: flex; justify-content: space-between; align-items: center; }.stamp-head > div > span { color: var(--gold); font-size: 7px; text-transform: uppercase; }.stamp-head h3 { font: 700 14px var(--display); margin-top: 3px; }.stamp-head .logo { transform: scale(.62); transform-origin: right; width: 110px; }.stamp-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin: 17px 0; }.stamp-grid > div { aspect-ratio: 1; border: 1px dashed #6e5541; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--dim); font: 700 11px var(--display); position: relative; }.stamp-grid > div.done { color: var(--gold-light); border: 1px solid var(--gold); background: rgba(220,180,93,.13); }.stamp-grid > div.prize { border-style: solid; }.stamp-grid small { position: absolute; bottom: -5px; font: 800 5px var(--sans); background: #352317; padding: 1px 4px; color: var(--gold); text-transform: uppercase; }.stamp-prizes { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }.stamp-prizes > span { display: grid; grid-template-columns: auto 1fr; gap: 2px 6px; padding: 8px; background: rgba(0,0,0,.16); border-radius: 8px; }.stamp-prizes svg { grid-row: 1/3; color: var(--gold); }.stamp-prizes small { color: var(--muted); font-size: 6px; }.stamp-prizes strong { font-size: 7px; }.stamp-card > p { color: var(--dim); font-size: 6px; text-align: center; margin-top: 10px; }
.demo-box,.claim-box,.code-box { margin-top: 10px; padding: 13px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }.demo-box { display: flex; justify-content: space-between; align-items: center; }.demo-box span { display: flex; flex-direction: column; }.demo-box strong { font-size: 8px; }.demo-box small { color: var(--muted); font-size: 6px; }.demo-box .button { min-height: 35px; font-size: 8px; }.claim-box { text-align: center; }.claim-box h3 { font: 700 16px var(--display); margin: 5px; }.claim-box p { color: var(--muted); font-size: 8px; margin-bottom: 10px; }.claim-box .button { width: 100%; }.code-box { text-align: center; }.code-box > div { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 8px; color: var(--green); border: 1px solid var(--green); background: rgba(98,187,126,.08); }.code-box h2 { color: var(--gold-light); font: 700 31px var(--display); letter-spacing: .1em; margin: 5px; }.code-box p { color: var(--muted); font-size: 8px; }.code-box > small { display: flex; justify-content: center; align-items: center; gap: 5px; color: var(--terra); font-size: 7px; margin-top: 8px; }
.profile { text-align: center; }.avatar { width: 74px; height: 74px; margin: auto; border: 2px solid var(--gold); background: linear-gradient(145deg,#654526,#23170f); color: var(--gold-light); border-radius: 50%; display: grid; place-items: center; font: 700 21px var(--display); position: relative; }.avatar span { position: absolute; right: -2px; bottom: 1px; width: 23px; height: 23px; display: grid; place-items: center; border-radius: 50%; color: #21150c; background: var(--gold); border: 2px solid var(--bg); font: 800 9px var(--sans); }.profile h2 { font: 700 20px var(--display); margin-top: 9px; }.profile p { color: var(--muted); font-size: 7px; }.profile > div:last-child { display: grid; grid-template-columns: repeat(3,1fr); margin: 16px 0; }.profile > div:last-child span { display: flex; flex-direction: column; color: var(--muted); font-size: 6px; border-right: 1px solid var(--line); }.profile > div:last-child span:last-child { border: 0; }.profile > div:last-child strong { color: var(--gold-light); font: 700 16px var(--display); }
.taquero-pass { padding: 16px; border: 1px solid var(--gold); border-radius: 16px; background: linear-gradient(135deg,#4e351d,#1d140f 70%); }.taquero-pass > span { color: var(--gold-light); display: flex; align-items: center; gap: 5px; text-transform: uppercase; font-size: 7px; font-weight: 800; }.taquero-pass h2 { font: 700 17px var(--display); margin: 10px 0 5px; }.taquero-pass p { color: var(--muted); font-size: 8px; }.taquero-pass > div { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }.taquero-pass strong { color: var(--gold-light); font: 700 17px var(--display); }.taquero-pass small { font: 700 6px var(--sans); }.taquero-pass .button { min-height: 34px; font-size: 7px; }
.section-title { font: 700 14px var(--display); margin: 18px 0 10px; }.achievements { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }.achievements div { padding: 10px 5px; border: 1px solid var(--line); background: var(--panel); border-radius: 10px; display: flex; flex-direction: column; align-items: center; color: var(--gold); }.achievements strong { color: var(--ink); font-size: 7px; margin: 6px 0 2px; }.achievements small { color: var(--dim); font-size: 6px; }.achievements .muted { opacity: .45; }

/* Laptop / business */
.laptop-frame { max-width: 1400px; height: 900px; margin: auto; padding: 13px 13px 22px; position: relative; border-radius: 24px 24px 13px 13px; background: linear-gradient(145deg,#5a544e,#1c1a18 18%,#090807 82%,#514b45); box-shadow: 0 55px 120px rgba(0,0,0,.58),inset 0 0 0 2px #070605,inset 0 0 0 3px rgba(255,255,255,.1); }
.laptop-camera { position: absolute; z-index: 3; top: 5px; left: 50%; width: 5px; height: 5px; border-radius: 50%; background: #152329; }
.business-screen { height: 100%; display: grid; grid-template-columns: 190px 1fr; border-radius: 14px; overflow: hidden; background: #11100e; }
.business-screen > main { min-width: 0; overflow: auto; }
.laptop-base { position: absolute; left: -35px; right: -35px; bottom: -9px; height: 16px; border-radius: 0 0 50% 50%; background: linear-gradient(#77716b,#292725); box-shadow: 0 12px 20px rgba(0,0,0,.45); }
.business-nav { padding: 25px 14px 16px; background: #171411; border-right: 1px solid rgba(255,255,255,.06); display: flex; flex-direction: column; }.business-nav .logo { transform: scale(.78); transform-origin: left; width: 180px; }.business-nav nav { display: flex; flex-direction: column; gap: 5px; margin-top: 38px; }.business-nav nav button { min-height: 42px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; color: #8f8880; display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 700; text-align: left; }.business-nav nav button.active { color: var(--gold-light); background: rgba(220,180,93,.1); border-left: 2px solid var(--gold); }.business-account { margin-top: auto; display: flex; gap: 9px; align-items: center; padding: 10px 5px; border-top: 1px solid rgba(255,255,255,.06); }.business-account > span { width: 31px; height: 31px; border-radius: 8px; display: grid; place-items: center; color: var(--gold); background: #33291f; font: 700 9px var(--display); }.business-account > div { display: flex; flex-direction: column; }.business-account strong { font-size: 7px; }.business-account small { color: var(--teal); font-size: 6px; margin-top: 2px; }
.dashboard-page,.business-page { min-height: 100%; padding: 24px; background: #11100e; }
.dashboard-title,.page-heading { display: flex; justify-content: space-between; align-items: flex-end; }.dashboard-title span,.page-heading > span { color: var(--teal); font-size: 8px; text-transform: uppercase; letter-spacing: .12em; font-weight: 800; }.dashboard-title h2,.page-heading h2 { font-size: 21px; margin-top: 3px; }.live-chip { padding: 7px 9px; border: 1px solid rgba(98,187,126,.18); border-radius: 8px; color: #8ed5a6; background: rgba(98,187,126,.05); display: flex; align-items: center; gap: 5px; font-size: 7px; }.live-chip i { width: 5px; height: 5px; background: var(--green); border-radius: 50%; box-shadow: 0 0 6px var(--green); }
.slicer-bar { display: grid; grid-template-columns: 1.05fr 1fr 1.25fr auto; gap: 12px; align-items: end; margin: 16px 0 10px; padding: 10px; border: 1px solid rgba(255,255,255,.07); border-radius: 11px; background: #181512; }.slicer-bar label { display: block; color: #77716b; font-size: 6px; text-transform: uppercase; letter-spacing: .09em; margin: 0 0 5px 3px; }.dashboard-segment { display: flex; background: #0f0e0c; border-radius: 7px; padding: 3px; }.dashboard-segment button { flex: 1; min-height: 27px; padding: 0 7px; white-space: nowrap; color: #827b74; border: 0; border-radius: 5px; background: transparent; font-size: 6.5px; font-weight: 700; }.dashboard-segment button.active { color: var(--ink); background: #35302a; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }.slicer-bar .button { min-height: 33px; padding: 0 10px; font-size: 7px; }
.cross-note { display: flex; align-items: center; gap: 5px; padding: 6px 9px; color: #8ed7cf; background: rgba(61,182,170,.07); border: 1px solid rgba(61,182,170,.16); border-radius: 7px; font-size: 7px; margin-bottom: 9px; }.cross-note button { margin-left: auto; border: 0; background: transparent; color: var(--gold); font-size: 7px; text-decoration: underline; }
.kpi-row { display: grid; grid-template-columns: repeat(5,1fr); gap: 9px; }.visual { border: 1px solid rgba(255,255,255,.07); border-radius: 10px; background: #1a1714; box-shadow: 0 6px 15px rgba(0,0,0,.12); }.kpi { min-height: 105px; padding: 11px; position: relative; overflow: hidden; }.kpi > span { color: #9d958d; font-size: 7px; }.kpi > div { display: flex; align-items: baseline; gap: 7px; margin-top: 5px; }.kpi strong { font-size: 20px; font-variant-numeric: tabular-nums; }.kpi b { color: var(--green); font-size: 6px; }.kpi b.down { color: var(--red); }.kpi small { color: #615b55; font-size: 5.5px; }.kpi svg { position: absolute; right: 8px; bottom: 8px; width: 75px; height: 27px; overflow: visible; }.kpi polyline { fill: none; stroke: var(--teal); stroke-width: 2; vector-effect: non-scaling-stroke; }.kpi svg.negative polyline { stroke: var(--red); }
.dashboard-grid { display: grid; grid-template-columns: 1.5fr 1.15fr .8fr; grid-template-rows: 245px 235px 210px; gap: 9px; margin-top: 9px; }.visual { padding: 12px; min-width: 0; }.visual-title { display: flex; justify-content: space-between; align-items: flex-start; }.visual-title > div { display: flex; flex-direction: column; }.visual-title span { font-size: 8px; font-weight: 800; }.visual-title small { color: #6f6861; font-size: 6px; margin-top: 2px; }.legend { display: flex; align-items: center; gap: 4px; color: #706a63; font-size: 5px; }.legend i { width: 10px; border-top: 2px solid var(--teal); }.legend i.previous { border-top-style: dashed; border-color: #777; }.legend i.goal { border-color: var(--gold); }
.line-visual { grid-column: 1/3; }.line-chart { height: 188px; margin-top: 6px; }.line-chart svg { width: 100%; height: 166px; overflow: visible; }.line-chart .grid { stroke: rgba(255,255,255,.055); stroke-width: 1; vector-effect: non-scaling-stroke; }.current-line,.previous-line { fill: none; vector-effect: non-scaling-stroke; }.current-line { stroke: var(--teal); stroke-width: 2.5; }.previous-line { stroke: #6f6a65; stroke-width: 1.5; stroke-dasharray: 5 5; }.goal-line { stroke: var(--gold); stroke-width: 1; stroke-dasharray: 3 4; vector-effect: non-scaling-stroke; }.data-point { fill: #1a1714; stroke: var(--teal); stroke-width: 2.5; cursor: pointer; vector-effect: non-scaling-stroke; }.data-point:hover { fill: var(--teal); }.chart-days { display: flex; justify-content: space-between; padding: 0 8px; color: #6f6861; font-size: 6px; }
.donut-wrap { height: 190px; display: grid; grid-template-columns: 1fr; place-items: center; }.donut { width: 118px; height: 118px; border-radius: 50%; background: conic-gradient(var(--gold) 0 62%,var(--teal) 62%); position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; }.donut::before { content: ''; position: absolute; inset: 21px; border-radius: 50%; background: #1a1714; }.donut strong,.donut > span { position: relative; z-index: 2; }.donut strong { font-size: 20px; }.donut > span { color: var(--muted); font-size: 6px; }.donut-hit { position: absolute; border: 0; background: transparent; }.donut-hit.recurrent { inset: 0 0 50% 50%; }.donut-hit.new { inset: 50% 50% 0 0; }.donut-labels { display: flex; gap: 15px; margin-top: -18px; }.donut-labels button { border: 0; color: var(--muted); background: transparent; display: grid; grid-template-columns: auto auto; gap: 1px 4px; text-align: left; font-size: 6px; }.donut-labels i { width: 6px; height: 6px; border-radius: 50%; grid-row: 1/3; }.donut-labels i.new { background: var(--teal); }.donut-labels i.return { background: var(--gold); }.donut-labels strong { color: var(--ink); }
.heat-visual { grid-column: 1; }.heatmap { margin-top: 8px; }.heat-hours { padding-left: 27px; display: grid; grid-template-columns: repeat(6,1fr); color: #6e6761; font-size: 5px; text-align: center; }.heat-row { display: grid; grid-template-columns: 25px repeat(6,1fr); gap: 3px; margin-top: 3px; align-items: center; }.heat-row > span { color: #716a64; font-size: 5.5px; }.heat-row button { height: 19px; border: 0; border-radius: 3px; color: rgba(255,255,255,.72); background: color-mix(in srgb,var(--teal) calc(var(--heat) * 100%),#25211d); font-size: 5px; font-variant-numeric: tabular-nums; }.heat-row button:hover { box-shadow: 0 0 0 1px var(--gold-light); }
.funnel-visual { grid-column: 2; }.funnel { margin-top: 9px; }.funnel button { width: 100%; height: 34px; padding: 0; border: 0; background: transparent; display: grid; grid-template-columns: 95px 1fr 25px 25px; align-items: center; text-align: left; color: var(--muted); font-size: 6px; }.funnel button > i { height: 18px; border-radius: 2px; background: linear-gradient(90deg,var(--teal-dark),var(--teal)); transition: .2s; }.funnel button:hover > i { filter: brightness(1.35); }.funnel strong { color: var(--ink); text-align: right; font-size: 7px; }.funnel small { color: #6c655e; text-align: right; font-size: 5px; }
.rewards-visual { grid-column: 3; }.horizontal-bars { margin-top: 15px; }.horizontal-bars button { width: 100%; padding: 5px 0; border: 0; background: transparent; color: var(--muted); display: grid; grid-template-columns: 75px 1fr 18px; gap: 5px; align-items: center; text-align: left; font-size: 6px; }.horizontal-bars button > div { height: 10px; border-radius: 2px; background: #2b2723; }.horizontal-bars button i { display: block; height: 100%; background: linear-gradient(90deg,var(--gold),var(--gold-light)); }.horizontal-bars strong { color: var(--ink); text-align: right; }
.roi-visual { grid-column: 1; }.roi-badge { color: var(--green); background: rgba(98,187,126,.08); padding: 5px 7px; border-radius: 8px; }.roi-numbers { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-top: 12px; }.roi-numbers div { padding: 8px; border-radius: 6px; background: #24201c; display: flex; flex-direction: column; }.roi-numbers span { color: var(--muted); font-size: 5px; }.roi-numbers strong { color: var(--green); font-size: 11px; margin-top: 3px; }.roi-numbers strong.bad { color: var(--red); }.roi-saving { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 1px 6px; color: var(--teal); margin-top: 9px; }.roi-saving svg { grid-row: 1/3; }.roi-saving span { color: var(--muted); font-size: 5px; }.roi-saving strong { font-size: 9px; }.roi-visual > p { color: #625c56; font-size: 5px; margin-top: 7px; line-height: 1.4; }
.table-visual { grid-column: 2/4; }.table-visual .visual-title > button { border: 0; background: transparent; color: var(--teal); font-size: 6px; }.data-table { margin-top: 7px; }.table-head,.data-table > button { width: 100%; min-height: 25px; display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; align-items: center; border: 0; border-bottom: 1px solid rgba(255,255,255,.05); background: transparent; color: var(--muted); text-align: left; font-size: 6px; }.table-head { color: #65605a; text-transform: uppercase; font-size: 5px; }.data-table > button > span { position: relative; }.data-table > button i { position: absolute; z-index: 0; left: 0; top: -3px; bottom: -3px; background: rgba(61,182,170,.16); }.data-table > button b { position: relative; z-index: 1; font-weight: 700; color: var(--ink); }

.page-heading { display: block; max-width: 720px; }.page-heading h2 { font-size: 28px; margin: 5px 0; }.page-heading p { color: var(--muted); font-size: 10px; line-height: 1.6; }.narrow-page { padding: 55px max(35px,8vw); }.redeem-panel { max-width: 580px; margin-top: 30px; padding: 28px; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; background: #1a1714; }.scanner-graphic { width: 85px; height: 85px; margin: 0 auto 25px; border: 1px dashed var(--gold); border-radius: 50%; display: grid; place-items: center; color: var(--gold); background: rgba(220,180,93,.06); }.redeem-panel label { color: var(--muted); font-size: 8px; }.redeem-panel > input { width: 100%; height: 62px; margin: 7px 0 12px; border: 1px solid var(--line-strong); border-radius: 10px; background: #100e0c; color: var(--gold-light); text-align: center; font: 700 23px var(--display); letter-spacing: .16em; }.redeem-panel > .button { width: 100%; }.or { display: flex; align-items: center; gap: 8px; color: var(--dim); font-size: 7px; margin: 11px 0; }.or::before,.or::after { content: ''; flex: 1; height: 1px; background: var(--line); }.status-message { display: flex; gap: 9px; margin-top: 15px; padding: 11px; border-radius: 9px; text-align: left; }.status-message > span { display: flex; flex-direction: column; }.status-message strong { font-size: 8px; }.status-message small { font-size: 7px; margin-top: 2px; line-height: 1.4; }.status-message.success { color: var(--green); background: rgba(98,187,126,.08); border: 1px solid rgba(98,187,126,.2); }.status-message.error { color: var(--red); background: rgba(223,107,97,.07); border: 1px solid rgba(223,107,97,.18); }.status-message.neutral { color: var(--muted); background: #24201c; }.status-message strong { color: var(--ink); }.status-message small { color: var(--muted); }
.program-toggle { max-width: 720px; margin-top: 28px; padding: 15px; border: 1px solid var(--line); border-radius: 11px; background: var(--panel); display: flex; justify-content: space-between; align-items: center; }.program-toggle > div { display: flex; gap: 10px; align-items: center; }.program-toggle > div > span { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: var(--dim); background: #29241f; }.program-toggle > div > span.active { color: var(--green); background: rgba(98,187,126,.08); }.program-toggle > div > div { display: flex; flex-direction: column; }.program-toggle strong { font-size: 10px; }.program-toggle small { color: var(--muted); font-size: 7px; margin-top: 2px; }.switch { width: 42px; height: 24px; padding: 3px; border: 0; border-radius: 13px; background: #4d4741; }.switch i { display: block; width: 18px; height: 18px; border-radius: 50%; background: #8e8881; transition: .2s; }.switch.on { background: var(--green); }.switch.on i { background: white; transform: translateX(18px); }.program-rules { max-width: 720px; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 10px; }.program-rules > span { padding: 12px; display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; color: var(--gold); border: 1px solid var(--line); border-radius: 9px; }.program-rules svg { grid-row: 1/3; }.program-rules strong { color: var(--ink); font-size: 8px; }.program-rules small { color: var(--muted); font-size: 6px; }.prize-editor { max-width: 720px; padding: 13px; margin-bottom: 8px; border: 1px solid var(--line); border-radius: 11px; background: var(--panel); display: grid; grid-template-columns: 70px 1fr 90px; gap: 12px; align-items: center; }.prize-editor > div { height: 56px; border: 1px dashed var(--gold); border-radius: 8px; color: var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; }.prize-editor > div span { font-size: 6px; }.prize-editor label { color: var(--muted); font-size: 7px; }.prize-editor input { display: block; width: 100%; margin-top: 5px; border: 1px solid var(--line); border-radius: 7px; background: #100e0c; color: var(--ink); padding: 8px; font-size: 9px; }.prize-editor > span { display: flex; flex-direction: column; }.prize-editor > span small { color: var(--muted); font-size: 6px; }.prize-editor > span strong { margin-top: 3px; font-size: 11px; }.business-note { max-width: 720px; margin-top: 15px; padding: 12px; border-radius: 10px; display: flex; gap: 8px; color: var(--gold); background: rgba(220,180,93,.06); }.business-note p { color: var(--muted); font-size: 7px; }.business-note strong { color: var(--ink); }
.qr-page { display: grid; grid-template-columns: 1fr 390px; grid-template-rows: auto 1fr; gap: 25px 45px; padding: 55px max(35px,6vw); }.business-qr-card { grid-row: 2; width: 365px; padding: 25px; border-radius: 17px; background: #ede0c7; color: #1b120c; text-align: center; }.business-qr-card .logo { text-align: left; }.business-qr-card .fake-qr { margin: 22px auto 15px; }.business-qr-card h3 { font: 700 17px var(--display); }.business-qr-card p { color: #756149; font-size: 7px; margin-top: 5px; }.kit-panel { grid-row: 1/3; grid-column: 2; align-self: center; padding: 24px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }.kit-art { height: 210px; display: flex; align-items: flex-end; justify-content: center; position: relative; }.kit-art > span { width: 160px; height: 185px; clip-path: polygon(18% 0,82% 0,100% 100%,0 100%); background: linear-gradient(145deg,#ecd9b5,#b98f54); color: #2b1b10; display: flex; flex-direction: column; align-items: center; justify-content: center; font: 800 34px var(--display); transform: rotate(-3deg); }.kit-art > span small { font: 800 8px var(--sans); margin-top: 9px; }.kit-art i { position: absolute; bottom: 8px; right: 55px; width: 70px; height: 70px; display: grid; place-items: center; border-radius: 50%; background: var(--gold); border: 5px solid #2a1b10; color: #2a1b10; font: 800 16px var(--display); transform: rotate(12deg); }.kit-panel > span { color: var(--gold); font-size: 8px; text-transform: uppercase; }.kit-panel h3 { font: 700 20px var(--display); margin: 7px 0; }.kit-panel > p { color: var(--muted); font-size: 9px; line-height: 1.55; margin-bottom: 15px; }.kit-panel > .button { width: 100%; }
.plan-page { padding: 48px max(30px,5vw); }.plan-cards { max-width: 870px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 25px; }.plan-cards article { min-height: 210px; padding: 20px; border: 1px solid var(--line); border-radius: 13px; background: var(--panel); position: relative; }.plan-cards article.featured { border-color: var(--gold); background: linear-gradient(145deg,#3b291b,#1e1712); }.plan-cards article > b { position: absolute; right: 12px; top: -8px; padding: 5px 8px; border-radius: 7px; color: #23170d; background: var(--gold); font-size: 6px; }.plan-cards article > span { color: var(--muted); font-size: 9px; }.plan-cards h3 { font: 700 28px var(--display); margin: 10px 0 5px; }.plan-cards h3 small { font: 700 8px var(--sans); }.plan-cards p { color: var(--muted); font-size: 8px; }.plan-cards ul { list-style: none; padding: 0; margin: 15px 0 0; }.plan-cards li { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 7px; margin: 7px 0; }.plan-cards li svg { color: var(--green); width: 14px; }.plan-calculator { max-width: 870px; padding: 20px; margin-top: 12px; border: 1px solid var(--line); border-radius: 13px; background: var(--panel); }.plan-calculator > div:first-child { display: flex; justify-content: space-between; }.plan-calculator span { color: var(--muted); font-size: 8px; }.plan-calculator strong { color: var(--gold-light); }.plan-calculator > input { width: 100%; margin: 10px 0 5px; accent-color: var(--gold); }.plan-calculator > p { color: var(--dim); font-size: 7px; }.comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 15px; }.comparison > span { padding: 12px; border-radius: 9px; background: #12100e; display: flex; flex-direction: column; }.comparison small { color: var(--muted); font-size: 7px; }.comparison strong { color: var(--red); font: 700 19px var(--display); margin: 4px 0; }.comparison span:last-child strong { color: var(--green); }.comparison em { color: var(--dim); font-style: normal; font-size: 6px; }.break-even { display: flex; gap: 9px; padding: 11px; margin-top: 9px; border: 1px solid rgba(61,182,170,.18); border-radius: 9px; color: var(--teal); background: rgba(61,182,170,.06); }.break-even > span { display: flex; flex-direction: column; }.break-even strong { color: var(--ink); font-size: 8px; }.break-even small { color: var(--muted); font-size: 7px; margin-top: 2px; }.plan-actions { max-width: 870px; display: flex; gap: 9px; margin-top: 12px; }.plan-actions .button { flex: 1; }

footer { max-width: 1400px; margin: auto; padding: 35px 28px 55px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }.footer .logo { transform: scale(.8); }.site-shell footer p { color: var(--dim); font-size: 8px; }

@media (max-width: 1100px) {
  .pitch-header { gap: 30px; }
  .competition-label { font-size: 0; border: 0; }
  .business-screen { grid-template-columns: 155px 1fr; }
  .business-nav { padding-inline: 9px; }
  .business-nav .logo { transform: scale(.66); }
  .slicer-bar { grid-template-columns: 1fr 1fr; }
  .kpi-row { grid-template-columns: repeat(3,1fr); }
  .dashboard-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .line-visual,.donut-visual,.heat-visual,.funnel-visual,.rewards-visual,.roi-visual,.table-visual { grid-column: auto; min-height: 220px; }
  .line-visual,.table-visual { grid-column: 1/-1; }
  .laptop-frame { height: 1050px; }
}

@media (max-width: 760px) {
  .fixed-header { height: 112px; }
  .header-inner { grid-template-columns: 1fr auto; padding: 0 16px; align-content: center; gap: 9px; }
  .header-inner .logo { transform: scale(.78); transform-origin: left; }
  .competition-label { display: none; }
  .role-toggle { grid-column: 1/-1; grid-row: 2; width: 100%; }
  .role-toggle button { min-height: 36px; }
  .pitch-header { padding: 145px 18px 40px; grid-template-columns: 1fr; }
  .pitch-story article { grid-template-columns: 85px 1fr; }
  .pitch-numbers { grid-template-columns: 1fr 1fr; }
  .product-stage { padding: 150px 10px 70px; }
  .stage-heading { padding: 0 8px; display: block; }
  .stage-heading p { text-align: left; margin-top: 8px; }
  .phone-frame { width: min(430px,100%); height: 800px; }
  .laptop-frame { width: 100%; height: auto; min-height: 900px; padding: 7px; border-radius: 16px; }
  .business-screen { grid-template-columns: 1fr; display: block; overflow: visible; }
  .business-nav { height: auto; padding: 9px; position: sticky; top: 112px; z-index: 20; border-right: 0; border-bottom: 1px solid var(--line); }
  .business-nav > .logo,.business-account { display: none; }
  .business-nav nav { margin: 0; display: grid; grid-template-columns: repeat(5,1fr); }
  .business-nav nav button { min-height: 42px; padding: 0; justify-content: center; flex-direction: column; gap: 2px; font-size: 6px; }
  .dashboard-page,.business-page { padding: 15px; }
  .kpi-row { grid-template-columns: 1fr 1fr; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .line-visual,.table-visual { grid-column: auto; }
  .slicer-bar { grid-template-columns: 1fr; }
  .qr-page { grid-template-columns: 1fr; grid-template-rows: auto; }
  .business-qr-card,.kit-panel { grid-column: 1; grid-row: auto; width: min(100%,365px); }
  .plan-cards { grid-template-columns: 1fr; }
  footer { display: block; padding-inline: 18px; }
  footer p { margin-top: 20px; line-height: 1.6; }
}

@media (max-width: 450px) {
  .phone-frame { height: 790px; padding: 0; border-radius: 0; background: none; box-shadow: none; }
  .phone-screen { border-radius: 0; }
  .phone-notch,.phone-home { display: none; }
  .product-stage { padding-inline: 0; }
  .stage-heading { padding-inline: 18px; }
  .pitch-numbers > div { padding: 12px; }
  .pitch-numbers strong { font-size: 18px; }
  .kpi-row { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}

/* Theme switch and action color */
.theme-dark {
  --bg: #140c07;
  --bg-2: #191009;
  --panel: #1f1710;
  --panel-2: #2a1f16;
  --panel-3: #35271b;
  --ink: #f5edd8;
  --muted: #b5a895;
  --dim: #817467;
  --action: #ff7a1a;
  --action-ink: #241005;
}
.theme-light {
  --bg: #fbf4e8;
  --bg-2: #f4eadc;
  --panel: #ffffff;
  --panel-2: #f6ecdf;
  --panel-3: #ecddca;
  --ink: #2a1a0e;
  --muted: #695b4e;
  --dim: #8a7969;
  --line: rgba(76, 46, 25, .13);
  --line-strong: rgba(76, 46, 25, .25);
  --action: #f26a1b;
  --action-ink: #ffffff;
}
.header-inner { grid-template-columns: 1fr auto auto 1fr; gap: 14px; }
.theme-toggle { display: grid; grid-template-columns: 1fr 1fr; width: 220px; padding: 5px; border-radius: 15px; background: var(--panel); border: 1px solid var(--line); }
.theme-toggle button { min-height: 43px; border: 0; border-radius: 10px; background: transparent; color: var(--muted); display: flex; justify-content: center; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; transition: .2s; }
.theme-toggle button.active,.role-toggle button.active { color: var(--action-ink); background: var(--action); box-shadow: 0 7px 18px color-mix(in srgb,var(--action) 24%,transparent); }
.button-primary { color: var(--action-ink); background: var(--action); box-shadow: 0 10px 24px color-mix(in srgb,var(--action) 20%,transparent); }
.consumer-nav button.active { color: var(--action); background: color-mix(in srgb,var(--action) 10%,transparent); border-radius: 10px; }
.map-filters button.active { color: var(--action-ink); border-color: var(--action); background: var(--action); }
.map-pin.selected { background: var(--action); color: var(--action-ink); box-shadow: 0 0 0 8px color-mix(in srgb,var(--action) 16%,transparent),0 8px 20px #000; }
.visit-meter > i span { background: var(--action); }
.stamp-grid > div.done { color: var(--action); border-color: var(--action); background: color-mix(in srgb,var(--action) 13%,transparent); }
.dashboard-segment button.active { color: var(--action-ink); background: var(--action); }
.site-shell > .fixed-header .logo-diamond { color: var(--action-ink); border-color: var(--action); background: var(--action); }
.site-shell > .fixed-header .logo small,
.kicker,
.phone-heading div > span,
.level,
.points,
.text-button,
.rarity-chip,
.scan-top span,
.unlocked-note,
.taquero-pass > span,
.dashboard-title span,
.page-heading > span { color: var(--action); }
.progress-ring { background: radial-gradient(circle,var(--panel) 62%,transparent 64%),conic-gradient(var(--action) 37%,#4a392c 0); }
.taquero-pass { border-color: var(--action); }
.plan-cards article.featured { border-color: var(--action); }
.plan-cards article > b { background: var(--action); color: var(--action-ink); }
.goal-line { stroke: var(--action); }

.theme-light { background: var(--bg); }
.theme-light .fixed-header { background: rgba(251,244,232,.92); }
.theme-light .product-stage { background: linear-gradient(180deg,rgba(242,106,27,.045),transparent 350px); }
.theme-light .phone-screen,
.theme-light .phone-view,
.theme-light .standard-view { background-color: var(--bg); color: var(--ink); }
.theme-light .consumer-nav { background: rgba(255,255,255,.94); }
.theme-light .map-search,
.theme-light .map-filters button,
.theme-light .map-place,
.theme-light .album-progress,
.theme-light .rarity-progress span,
.theme-light .locked-loyalty,
.theme-light .unlocked-note,
.theme-light .demo-box,
.theme-light .claim-box,
.theme-light .code-box,
.theme-light .taquero-pass,
.theme-light .achievements div { background-color: var(--panel); color: var(--ink); }
.theme-light .business-screen,
.theme-light .dashboard-page,
.theme-light .business-page { background: #f7f1e8; color: var(--ink); }
.theme-light .business-nav,
.theme-light .visual,
.theme-light .slicer-bar,
.theme-light .redeem-panel,
.theme-light .program-toggle,
.theme-light .prize-editor,
.theme-light .kit-panel,
.theme-light .plan-cards article,
.theme-light .plan-calculator { background: #fff; color: var(--ink); border-color: rgba(76,46,25,.12); }
.theme-light .business-nav nav button { color: #73675c; }
.theme-light .business-nav nav button.active { color: var(--action); background: rgba(242,106,27,.08); border-left-color: var(--action); }
.theme-light .dashboard-segment { background: #f3eadf; }
.theme-light .kpi small,
.theme-light .visual-title small,
.theme-light .chart-days,
.theme-light .heat-row > span,
.theme-light .page-heading p { color: var(--muted); }
.theme-light .line-chart .grid { stroke: rgba(59,35,18,.1); }
.theme-light .donut::before { background: #fff; }
.theme-light .tijuana-map { background: radial-gradient(circle at 35% 20%,#f4e4d2,transparent 28%),linear-gradient(145deg,#efe1d1,#dac9b8); }
.theme-light .tijuana-map::before { opacity: .2; }
.theme-light .road { border-color: #d3c1ae; background: #fffaf2; }
.theme-light .zone { color: rgba(42,26,14,.55); }
.theme-light .comparison > span,
.theme-light .redeem-panel > input,
.theme-light .prize-editor input { background: #fbf4e8; color: var(--ink); }

/* Map-only entry screen */
.map-view { position: relative; padding: 0; background: var(--bg); }
.map-view .tijuana-map { height: 100%; min-height: 100%; }
.map-overlay { position: absolute; z-index: 9; top: 42px; left: 14px; right: 14px; }
.map-search { height: 44px; padding: 0 13px; border: 1px solid var(--line-strong); border-radius: 13px; display: flex; align-items: center; gap: 8px; color: var(--action); background: color-mix(in srgb,var(--panel) 94%,transparent); backdrop-filter: blur(18px); box-shadow: 0 10px 24px rgba(0,0,0,.2); }
.map-search input { width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 10px; }
.map-search input::placeholder { color: var(--muted); }
.map-overlay .map-filters { padding: 9px 0 0; }
.map-overlay .map-filters button { background: color-mix(in srgb,var(--panel) 92%,transparent); backdrop-filter: blur(12px); box-shadow: 0 5px 14px rgba(0,0,0,.12); }
.map-overlay .map-filters button.active { background: var(--action); }

/* Realistic printed collectible cards */
.card-face { border-width: 4px; border-radius: 16px; box-shadow: 0 20px 45px rgba(0,0,0,.48),inset 0 0 0 1px rgba(255,255,255,.38); }
.card-face::before { content: ''; position: absolute; z-index: 8; inset: 0; pointer-events: none; opacity: .25; background-image: linear-gradient(115deg,transparent 25%,rgba(255,255,255,.35) 43%,transparent 58%),radial-gradient(rgba(255,255,255,.25) .6px,transparent .8px); background-size: 200% 100%,4px 4px; background-position: var(--mx) var(--my),0 0; mix-blend-mode: soft-light; }
.card-face::after { inset: 3px; border-radius: 11px; border-color: rgba(255,255,255,.28); }
.card-front { padding: 7px; background: #b98b55; color: #2c190d; }
.card-title-band { min-height: 43px; padding: 6px 7px 5px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.card-title-band h3 { font: 700 15px/1.05 var(--display); }
.card-title-band > span { flex: 0 0 auto; padding: 3px 5px; border: 1px solid currentColor; border-radius: 8px; font-size: 5px; font-weight: 800; text-transform: uppercase; }
.illustration { height: 47%; margin: 0; border: 2px solid rgba(56,32,18,.56); border-radius: 7px; background: #382417; box-shadow: 0 0 0 2px rgba(255,255,255,.2); }
.illustration img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.03); }
.card-band { padding: 7px 4px 0; color: inherit; text-align: left; }
.card-location { display: flex; justify-content: space-between; gap: 6px; color: inherit; font-size: 5.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.card-blurb { min-height: 30px; padding: 6px 7px; margin-top: 5px; border: 1px solid color-mix(in srgb,currentColor 25%,transparent); border-radius: 6px; background: rgba(255,255,255,.17); font: 600 6px/1.4 var(--sans); text-transform: none !important; letter-spacing: 0 !important; }
.card-stats { margin-top: 6px; padding-top: 5px; }
.card-stats div { justify-items: start; }
.card-footer { position: absolute; z-index: 5; left: 11px; right: 11px; bottom: 7px; display: flex; justify-content: space-between; color: inherit; font-size: 4.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
.collectible.comun .card-front { color: #352014; background: linear-gradient(135deg,#c59a68,#aa7947); }
.collectible.comun .card-face { border-color: #6d4629; }
.collectible.rara .card-front { color: #20292d; background: linear-gradient(135deg,#eef2f1,#99a8ad 42%,#e5e8e6 70%,#7f8e94); }
.collectible.rara .card-face { border-color: #d9e0e0; box-shadow: 0 20px 45px rgba(0,0,0,.48),0 0 18px rgba(197,222,229,.24),inset 0 0 0 1px #fff; }
.collectible.epica .card-front { color: #fbf4ff; background: linear-gradient(135deg,#3c1759,#9b48bf 42%,#42236f 72%,#ce83de); }
.collectible.epica .card-face { border-color: #ad63c8; box-shadow: 0 20px 45px rgba(0,0,0,.52),0 0 22px rgba(190,92,222,.3),inset 0 0 0 1px #efc8ff; }
.collectible.epica .card-blurb { background: rgba(22,8,37,.28); }
.collectible.legendaria .card-front { color: #34210b; background: linear-gradient(135deg,#8d5915,#ffe394 30%,#b97920 57%,#fff0a8 76%,#9b5d13); }
.collectible.legendaria .card-face { border-color: #ffdc76; }
.collectible.legendaria .foil { opacity: .3; }
.collectible.compact .card-front { padding: 4px; }
.collectible.compact .card-title-band { min-height: 26px; padding: 3px 4px; }
.collectible.compact .card-title-band h3 { font-size: 8px; }
.collectible.compact .card-title-band > span { font-size: 0; width: 7px; height: 7px; padding: 0; border-radius: 50%; background: currentColor; }
.collectible.compact .illustration { margin: 0; height: 48%; }
.collectible.compact .card-band { padding: 4px 2px 0; }
.collectible.compact .card-location { font-size: 3px; }
.collectible.compact .card-blurb { min-height: 20px; margin-top: 3px; padding: 3px; font-size: 3.4px; }
.collectible.compact .card-footer { left: 7px; right: 7px; bottom: 4px; font-size: 2.6px; }
.collectible.compact .card-stats { margin-top: 3px; }
.mini-card-map { height: 37px; margin-top: 7px; padding: 5px 7px; position: relative; overflow: hidden; border: 1px solid rgba(220,180,93,.16); border-radius: 6px; display: flex; align-items: center; gap: 6px; color: var(--gold-light); background: #2b2119; font-size: 5px; }
.mini-card-map i,.mini-card-map b { position: absolute; display: block; width: 90px; height: 4px; background: #514335; transform: rotate(20deg); right: -8px; }
.mini-card-map b { transform: rotate(-28deg); right: 2px; }
.mini-card-map svg,.mini-card-map span { position: relative; z-index: 2; }
.collectible.compact .mini-card-map { height: 20px; margin-top: 3px; padding: 2px; font-size: 2.6px; }

/* Album lightbox */
.card-lightbox { position: absolute; z-index: 60; inset: 0; padding: 35px 18px 22px; display: grid; place-items: center; background: rgba(8,5,3,.76); backdrop-filter: blur(12px); animation: lightbox-in .25s ease both; }
.card-modal { width: 100%; display: flex; flex-direction: column; align-items: center; position: relative; animation: card-zoom .38s cubic-bezier(.2,.8,.2,1.08) both; touch-action: pan-y; }
.card-modal .collectible { width: min(270px,72vw); }
.lightbox-close { position: absolute; z-index: 10; right: 3px; top: -17px; width: 38px; height: 38px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; display: grid; place-items: center; color: white; background: rgba(20,12,7,.8); font-size: 23px; line-height: 1; }
.lightbox-actions { width: min(300px,85vw); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
.lightbox-actions .button { min-height: 43px; }
@keyframes lightbox-in { from { opacity: 0; } }
@keyframes card-zoom { from { opacity: 0; transform: translateY(35px) scale(.72); } }

@media (max-width: 1100px) {
  .header-inner { grid-template-columns: 1fr auto auto; }
  .competition-label { display: none; }
  .theme-toggle { width: 190px; }
}

@media (max-width: 760px) {
  .fixed-header { height: 158px; }
  .header-inner { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; padding: 7px 16px; }
  .header-inner .logo { grid-column: 1/-1; }
  .role-toggle,.theme-toggle { width: 100%; grid-column: auto; grid-row: 2; }
  .theme-toggle button,.role-toggle button { min-height: 36px; font-size: 8px; }
  .product-stage { padding-top: 184px; }
  .business-nav { top: 158px; }
}

@media (max-width: 450px) {
  .fixed-header { height: 150px; }
  .header-inner .logo { transform: scale(.7); }
  .product-stage { padding-top: 170px; }
  .business-nav { top: 150px; }
}

/* Compact device layout: content reaches the bottom navigation */
.product-stage { padding-top: 104px; padding-bottom: 48px; }
.phone-home { display: none; }
.phone-screen { padding: 0; }
.consumer-nav { bottom: 0; }
.standard-view { padding-bottom: 76px; }
.map-view { height: 100%; padding: 0 0 76px; display: flex; flex-direction: column; overflow: hidden; }
.consumer-greeting { flex: 0 0 auto; padding: 42px 16px 11px; color: var(--ink); background: var(--bg); border-bottom: 1px solid var(--line); }
.consumer-greeting > span { display: block; color: var(--action); font-size: 9px; font-weight: 800; letter-spacing: .03em; }
.consumer-greeting h2 { color: var(--ink); font: 700 22px/1.15 var(--display); margin: 4px 0 12px; }
.consumer-greeting .map-filters { padding: 0; }
.map-canvas { flex: 1 1 auto; min-height: 0; position: relative; overflow: hidden; background: var(--bg); }
.map-canvas .tijuana-map { position: absolute; inset: 0; height: auto; min-height: 0; }
.map-canvas .map-place { bottom: 12px; }
.theme-light .consumer-greeting h2,
.theme-light .dashboard-title h2,
.theme-light .page-heading h2,
.theme-light .phone-heading h2,
.theme-light .section-title,
.theme-light .profile h2 { color: #2a1a0e; }
.theme-light .consumer-greeting { background: #fbf4e8; }
.theme-light .dashboard-title > div > span { color: var(--action); }

@media (max-width: 760px) {
  .product-stage { padding-top: 174px; padding-bottom: 24px; }
}

@media (max-width: 450px) {
  .product-stage { padding-top: 162px; padding-bottom: 0; }
  .phone-frame { height: calc(100dvh - 162px); min-height: 640px; }
}

/* Page header stays outside the device */
.header-inner { display: flex; }
.header-inner > .logo { margin-right: auto; }
.competition-label { order: 2; margin-right: 8px; }
.role-toggle { order: 3; }
.theme-toggle { order: 4; }
.theme-dark .fixed-header .logo strong { color: #f5edd8; }
.theme-light .fixed-header .logo strong { color: #2a1a0e; }
.fixed-header .logo { margin-top: 4px; }

/* Native phone status area */
.phone-status { position: absolute; z-index: 18; top: 0; left: 0; right: 0; height: 30px; padding: 7px 17px 0; display: flex; justify-content: space-between; align-items: flex-start; color: var(--ink); font-size: 7px; font-weight: 800; pointer-events: none; }
.phone-status > div { display: flex; align-items: center; gap: 4px; }
.status-signal { width: 11px; height: 7px; background: currentColor; clip-path: polygon(0 100%,0 72%,18% 72%,18% 52%,38% 52%,38% 32%,59% 32%,59% 14%,80% 14%,80% 0,100% 0,100% 100%); }
.status-wifi { width: 10px; height: 7px; border-top: 2px solid currentColor; border-radius: 50%; position: relative; }
.status-wifi::after { content: ''; position: absolute; width: 3px; height: 3px; border-radius: 50%; background: currentColor; left: 3px; bottom: 0; }
.status-battery { width: 13px; height: 7px; border: 1px solid currentColor; border-radius: 2px; position: relative; }
.status-battery::before { content: ''; position: absolute; inset: 1px; background: currentColor; }
.status-battery::after { content: ''; position: absolute; right: -3px; top: 1px; width: 2px; height: 3px; border-radius: 0 1px 1px 0; background: currentColor; }
.consumer-greeting { padding-top: 30px; }

/* Locatario uses the same full-screen phone */
.business-device { margin-inline: auto; }
.business-phone-view { position: absolute; inset: 30px 0 76px; overflow-y: auto; overflow-x: hidden; background: var(--bg); color: var(--ink); }
.business-bottom-nav { position: absolute; z-index: 15; left: 0; right: 0; bottom: 0; height: 76px; display: grid; grid-template-columns: repeat(5,1fr); padding: 6px 6px 14px; background: color-mix(in srgb,var(--panel) 95%,transparent); backdrop-filter: blur(18px); border-top: 1px solid var(--line); }
.business-bottom-nav button { min-width: 0; border: 0; border-radius: 10px; background: transparent; color: var(--dim); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 6px; font-weight: 800; }
.business-bottom-nav button.active { color: var(--action); background: color-mix(in srgb,var(--action) 10%,transparent); }
.theme-light .business-phone-view { background: #fbf4e8; }
.theme-light .business-bottom-nav { background: rgba(255,255,255,.95); }

/* Edge-to-edge consumer sections */
.standard-view { padding: 42px 16px 76px; }
.album-progress,
.locked-loyalty,
.unlocked-note,
.stamp-card,
.demo-box,
.claim-box,
.code-box,
.visit-meter,
.taquero-pass,
.achievements div,
.local-facts span { border-width: 0; border-radius: 0; box-shadow: none; background: transparent; }
.album-progress,
.locked-loyalty,
.stamp-card,
.profile,
.taquero-pass { padding: 14px 0; border-bottom: 1px solid var(--line); }
.rarity-progress { gap: 0; border-bottom: 1px solid var(--line); }
.rarity-progress span { border-radius: 0; background: transparent; }
.unlocked-note,
.demo-box,
.claim-box,
.code-box { padding: 12px 0; border-bottom: 1px solid var(--line); }
.achievements { gap: 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.achievements div { border-right: 1px solid var(--line); }
.achievements div:last-child { border-right: 0; }
.local-facts { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.local-facts span { padding-inline: 0; }
.visit-meter { padding: 12px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.theme-light .album-progress,
.theme-light .locked-loyalty,
.theme-light .unlocked-note,
.theme-light .demo-box,
.theme-light .claim-box,
.theme-light .code-box,
.theme-light .taquero-pass,
.theme-light .achievements div { background: transparent; }

/* Continuous dashboard canvas */
.dashboard-page,
.business-page { min-height: 0; padding: 16px 16px 12px; background: var(--bg); }
.dashboard-title { padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.slicer-bar { display: flex; align-items: flex-end; gap: 12px; margin: 12px -16px 8px; padding: 0 16px 8px; overflow-x: auto; border: 0; border-radius: 0; background: transparent; }
.slicer-bar > div { flex: 0 0 auto; min-width: 215px; }
.slicer-bar > div:nth-child(2) { min-width: 205px; }
.slicer-bar > div:nth-child(3) { min-width: 260px; }
.slicer-bar .button { flex: 0 0 auto; }
.cross-note { margin: 0 0 8px; padding: 7px 0; border: 0; border-radius: 0; border-bottom: 1px solid var(--line); background: transparent; }
.kpi-row { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.visual,
.kpi { border: 0; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-radius: 0; box-shadow: none; background: transparent; }
.kpi { min-height: 108px; padding: 10px; }
.kpi:nth-child(5) { grid-column: 1/-1; }
.dashboard-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); grid-template-rows: none; gap: 0; margin-top: 0; border-left: 1px solid var(--line); }
.dashboard-grid .visual { grid-column: auto; min-height: 220px; padding: 10px; }
.dashboard-grid .line-visual,
.dashboard-grid .table-visual { grid-column: 1/-1; }
.line-chart { height: 180px; }
.donut-wrap { height: 180px; }
.heat-visual,
.funnel-visual,
.rewards-visual,
.roi-visual { min-width: 0; }
.funnel button { grid-template-columns: 70px 1fr 20px 22px; }
.roi-numbers { grid-template-columns: 1fr; }
.table-visual { overflow-x: auto; }
.data-table { min-width: 360px; }
.theme-light .dashboard-page,
.theme-light .business-page,
.theme-light .visual,
.theme-light .kpi,
.theme-light .slicer-bar { background: transparent; }

/* Canjes and other business pages without floating containers */
.narrow-page,
.plan-page,
.qr-page { padding: 16px; }
.page-heading { padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.page-heading h2 { font-size: 23px; }
.redeem-panel { width: 100%; max-width: none; margin: 16px 0 0; padding: 0; border: 0; border-radius: 0; background: transparent; }
.scanner-graphic { margin-bottom: 16px; }
.program-toggle,
.program-rules,
.prize-editor,
.business-note,
.kit-panel,
.plan-cards article,
.plan-calculator,
.business-qr-card { max-width: none; border-width: 0; border-radius: 0; box-shadow: none; background: transparent; }
.program-toggle { margin-top: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.program-rules { gap: 0; margin-top: 0; border-bottom: 1px solid var(--line); }
.program-rules > span { border: 0; border-radius: 0; border-right: 1px solid var(--line); }
.program-rules > span:last-child { border-right: 0; }
.prize-editor { margin: 0; padding: 12px 0; border-bottom: 1px solid var(--line); grid-template-columns: 62px 1fr 72px; }
.business-note { padding: 12px 0; border-bottom: 1px solid var(--line); }
.qr-page { display: block; }
.business-qr-card { width: 100%; padding: 16px 0; color: var(--ink); border-bottom: 1px solid var(--line); }
.business-qr-card .logo { display: none; }
.kit-panel { padding: 16px 0; border-bottom: 1px solid var(--line); }
.kit-art { height: 150px; }
.kit-art > span { height: 135px; width: 120px; }
.plan-cards { grid-template-columns: 1fr 1fr; gap: 0; margin-top: 12px; }
.plan-cards article { min-height: 205px; padding: 12px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.plan-cards article:last-child { border-right: 0; }
.plan-calculator { margin: 0; padding: 14px 0; border-bottom: 1px solid var(--line); }
.plan-actions { display: grid; grid-template-columns: 1fr 1fr; }
.theme-light .redeem-panel,
.theme-light .program-toggle,
.theme-light .prize-editor,
.theme-light .kit-panel,
.theme-light .plan-cards article,
.theme-light .plan-calculator { background: transparent; }

@media (max-width: 760px) {
  .fixed-header { height: 120px; }
  .header-inner { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; padding: 5px 16px; }
  .header-inner > .logo { grid-column: 1/-1; margin: 0; }
  .role-toggle,.theme-toggle { grid-row: 2; width: 100%; }
  .product-stage { padding-top: 132px; }
}

@media (max-width: 450px) {
  .fixed-header { height: 116px; }
  .product-stage { padding-top: 116px; }
  .phone-frame { height: calc(100dvh - 116px); min-height: 620px; }
  .header-inner .logo { transform: scale(.68); }
}

/* Plan controls outside the phone */
.plan-control { order: 5; min-width: 190px; display: flex; flex-direction: column; gap: 3px; }
.plan-control > span { color: var(--muted); font-size: 6px; font-weight: 800; text-align: center; white-space: nowrap; }
.plan-toggle { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; border: 1px solid var(--line); border-radius: 13px; background: var(--panel); }
.plan-toggle button { min-height: 35px; padding: 0 10px; border: 0; border-radius: 9px; color: var(--muted); background: transparent; font-size: 8px; font-weight: 800; }
.plan-toggle button.active { color: var(--action-ink); background: var(--action); }
.compare-button { order: 6; min-height: 43px; flex: 0 0 auto; font-size: 8px; }
.competition-label { order: 2; }
.role-toggle { order: 3; }
.theme-toggle { order: 4; }

/* Side-by-side comparison */
.single-phone { width: 100%; }
.comparison-selector { max-width: 920px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.comparison-selector > span { color: var(--muted); font-size: 8px; text-transform: uppercase; letter-spacing: .1em; font-weight: 800; }
.comparison-selector > div { display: flex; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); overflow-x: auto; }
.comparison-selector button { min-height: 32px; padding: 0 11px; border: 0; border-radius: 8px; color: var(--muted); background: transparent; white-space: nowrap; font-size: 7px; font-weight: 800; }
.comparison-selector button.active { color: var(--action-ink); background: var(--action); }
.comparison-phones { max-width: 920px; margin: auto; display: grid; grid-template-columns: repeat(2,430px); justify-content: center; gap: 34px; }
.phone-take { min-width: 0; }
.take-label { min-height: 39px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.take-label span { color: var(--action); font-size: 7px; text-transform: uppercase; font-weight: 800; }
.take-label strong { font: 700 12px var(--display); }
.take-difference { max-width: 390px; margin: 11px auto 0; color: var(--muted); text-align: center; font-size: 8px; line-height: 1.45; }

/* Premium routes on the map */
.routes-button { position: absolute; z-index: 8; top: 12px; right: 12px; min-height: 34px; padding: 0 9px; border: 1px solid var(--line-strong); border-radius: 18px; display: flex; align-items: center; gap: 5px; color: var(--action-ink); background: var(--action); font-size: 7px; font-weight: 800; }
.routes-button small { position: absolute; right: 0; top: -8px; padding: 2px 5px; border-radius: 6px; color: var(--action-ink); background: var(--action); font-size: 5px; text-transform: uppercase; }
.routes-button.locked-feature { color: var(--muted); background: color-mix(in srgb,var(--panel) 94%,transparent); }
.premium-route { position: absolute; z-index: 2; inset: 0; pointer-events: none; }
.premium-route::before { content: ''; position: absolute; width: 265px; height: 125px; left: 70px; top: 125px; border: 4px solid var(--action); border-left-color: transparent; border-bottom-color: transparent; border-radius: 50%; transform: rotate(18deg); filter: drop-shadow(0 0 5px color-mix(in srgb,var(--action) 45%,transparent)); }
.premium-route i { position: absolute; width: 8px; height: 8px; border: 2px solid var(--action); border-radius: 50%; background: var(--panel); }
.premium-route i:nth-child(1) { left: 73px; top: 145px; }.premium-route i:nth-child(2) { left: 180px; top: 112px; }.premium-route i:nth-child(3) { right: 73px; top: 205px; }.premium-route i:nth-child(4) { left: 145px; top: 300px; }
.map-pin.featured { transform: rotate(-45deg) scale(1.38); box-shadow: 0 0 0 9px color-mix(in srgb,var(--action) 20%,transparent),0 8px 22px rgba(0,0,0,.5); }

/* Album premium content and coupons */
.album-tabs { display: grid; grid-template-columns: 1fr 1fr; margin: 0 0 10px; border-bottom: 1px solid var(--line); }
.album-tabs button { min-height: 37px; border: 0; border-bottom: 2px solid transparent; color: var(--muted); background: transparent; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 8px; font-weight: 800; }
.album-tabs button.active { color: var(--action); border-bottom-color: var(--action); }
.album-card-slot { position: relative; }
.pass-label { position: absolute; z-index: 9; left: 50%; bottom: 10px; transform: translateX(-50%); padding: 4px 7px; border-radius: 8px; display: flex; align-items: center; gap: 3px; color: var(--action-ink); background: var(--action); white-space: nowrap; font-size: 5px; font-weight: 800; text-transform: uppercase; }
.coupons-view { position: relative; min-height: 350px; }
.coupon-list article { min-height: 74px; display: grid; grid-template-columns: 55px 1fr; align-items: center; gap: 10px; border-bottom: 1px solid var(--line); }
.coupon-list article > span { color: var(--action); font: 700 18px var(--display); }
.coupon-list article div { display: flex; flex-direction: column; }
.coupon-list strong { font-size: 9px; }
.coupon-list small { color: var(--muted); font-size: 7px; margin-top: 3px; }
.feature-locked .coupon-list { filter: blur(4px) grayscale(.5); opacity: .55; pointer-events: none; }
.locked-message { position: absolute; z-index: 3; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 220px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.locked-message svg { color: var(--action); }.locked-message strong { margin-top: 7px; font-size: 10px; }.locked-message small { color: var(--muted); font-size: 7px; margin-top: 3px; }.locked-message span { margin-top: 8px; padding: 4px 7px; border-radius: 7px; color: var(--action-ink); background: var(--action); font-size: 6px; font-weight: 800; text-transform: uppercase; }

/* Consumer pass and upgrade sheet */
.avatar.premium { box-shadow: 0 0 0 4px color-mix(in srgb,var(--gold) 24%,transparent); }
.avatar > i { position: absolute; left: -3px; bottom: 2px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; color: #2b1a06; background: var(--gold); border: 2px solid var(--bg); }
.taquero-pass ul { list-style: none; padding: 0; margin: 10px 0 0; }
.taquero-pass li { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 7px; margin-top: 5px; }
.taquero-pass li svg { color: var(--action); }
.taquero-pass.active-pass > span { color: var(--gold); }
.upgrade-sheet-backdrop { position: absolute; z-index: 70; inset: 0; display: flex; align-items: flex-end; background: rgba(8,5,3,.68); backdrop-filter: blur(7px); animation: lightbox-in .2s ease both; }
.upgrade-sheet { width: 100%; max-height: 78%; overflow-y: auto; padding: 12px 18px 22px; color: var(--ink); background: var(--panel); border-radius: 20px 20px 0 0; animation: sheet-up .35s cubic-bezier(.2,.8,.2,1) both; position: relative; }
.upgrade-sheet > i:first-child { display: block; width: 38px; height: 4px; margin: 0 auto 16px; border-radius: 3px; background: var(--dim); }
.upgrade-sheet h2 { font: 700 20px/1.15 var(--display); margin: 6px 0 14px; }
.upgrade-sheet ul { list-style: none; padding: 0; margin: 0 0 14px; border-top: 1px solid var(--line); }
.upgrade-sheet li { min-height: 39px; display: flex; align-items: center; gap: 8px; color: var(--muted); border-bottom: 1px solid var(--line); font-size: 8px; }
.upgrade-sheet li svg { color: var(--action); }
.upgrade-price { display: flex; align-items: center; gap: 10px; margin: 14px 0; }
.upgrade-price strong { color: var(--action); font: 700 28px var(--display); }
.upgrade-price span { color: var(--muted); font-size: 7px; line-height: 1.5; }
.upgrade-sheet > .button { width: 100%; }
.upgrade-confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.upgrade-confetti i { position: absolute; left: calc((var(--n) * 37) % 100 * 1%); top: -10px; width: 6px; height: 10px; background: var(--action); animation: confetti .8s ease-out both; }
.upgrade-confetti i:nth-child(3n) { background: var(--gold); }
@keyframes sheet-up { from { transform: translateY(100%); } }

/* Locked business previews */
.dashboard-title b { margin-left: 5px; padding: 3px 6px; border-radius: 7px; color: var(--action-ink); background: var(--action); font-size: 5px; text-transform: uppercase; letter-spacing: .06em; }
.premium-visual-locked,.feature-preview-locked,.loyalty-preview { position: relative; overflow: hidden; }
.premium-visual-locked > :not(.plan-lock),.feature-preview-locked > :not(.plan-lock),.loyalty-preview > :not(.plan-lock) { filter: blur(3px) grayscale(.55); opacity: .5; pointer-events: none; user-select: none; }
.plan-lock { position: absolute; z-index: 8; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; color: var(--action); text-align: center; background: color-mix(in srgb,var(--bg) 38%,transparent); }
.plan-lock span { max-width: 125px; padding: 3px 5px; border-radius: 6px; color: var(--action-ink); background: var(--action); font-size: 5.5px; font-weight: 800; text-transform: uppercase; }
.upgrade-banner { min-height: 34px; margin: 0 -16px; padding: 7px 16px; display: flex; align-items: center; gap: 7px; color: var(--action-ink); background: var(--action); font-size: 7px; font-weight: 800; }
.feature-preview-locked { min-height: 420px; }
.loyalty-preview { min-height: 500px; }
.business-coupon { min-height: 58px; display: grid; grid-template-columns: auto 1fr auto; gap: 8px; align-items: center; border-bottom: 1px solid var(--line); color: var(--action); }
.business-coupon > span { display: flex; flex-direction: column; }.business-coupon strong { color: var(--ink); font-size: 8px; }.business-coupon small { color: var(--muted); font-size: 6px; margin-top: 2px; }.business-coupon .button { min-height: 30px; padding: 0 8px; font-size: 6px; }
.plan-cards article.current-plan { box-shadow: inset 0 3px 0 var(--action); }
.business-upgrade-sheet { max-height: 86%; }
.upgrade-comparison { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.upgrade-comparison > span { padding: 11px 8px; display: flex; flex-direction: column; border-right: 1px solid var(--line); }
.upgrade-comparison > span:last-child { border-right: 0; }
.upgrade-comparison strong { font-size: 9px; margin-bottom: 5px; }.upgrade-comparison small { color: var(--muted); font-size: 7px; margin-top: 3px; }
.sheet-saving { display: flex; gap: 8px; padding: 12px 0; color: var(--action); }
.sheet-saving > span { display: flex; flex-direction: column; }.sheet-saving strong { color: var(--ink); font-size: 9px; }.sheet-saving small { color: var(--muted); font-size: 7px; margin-top: 2px; }

@media (max-width: 1050px) {
  .comparison-phones { justify-content: flex-start; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 max(16px,calc((100vw - 430px)/2)); }
  .phone-take { flex: 0 0 430px; scroll-snap-align: center; }
  .comparison-phones { display: flex; }
}

@media (max-width: 760px) {
  .fixed-header { height: 112px; }
  .header-inner { display: flex; flex-wrap: nowrap; align-items: flex-end; padding: 43px 16px 6px; overflow-x: auto; }
  .header-inner > .logo { position: absolute; left: 16px; top: 4px; margin: 0; }
  .role-toggle { width: 190px; flex: 0 0 190px; }
  .theme-toggle { width: 165px; flex: 0 0 165px; }
  .plan-control { min-width: 180px; flex: 0 0 180px; }
  .compare-button { flex: 0 0 132px; }
  .competition-label { display: none; }
  .product-stage { padding-top: 124px; }
  .comparison-selector { padding: 0 16px; display: block; }
  .comparison-selector > span { display: block; margin-bottom: 7px; }
  .comparison-selector > div { width: 100%; }
}

@media (max-width: 450px) {
  .fixed-header { height: 106px; }
  .product-stage { padding-top: 106px; }
  .single-phone .phone-frame { height: calc(100dvh - 106px); }
  .comparison-phones .phone-frame { height: 760px; }
  .phone-take { flex-basis: min(430px,calc(100vw - 24px)); }
}

/* Light-only simplified application header */
.fixed-header { height: 78px; background: rgba(251,244,232,.94); }
.header-inner { display: flex; align-items: center; padding: 0 28px; overflow: visible; }
.header-inner > .logo { position: static; margin: 4px auto 0 0; transform: none; }
.fixed-header .logo strong { color: #2a1a0e; }
.fixed-header .logo small { color: var(--action); }
.role-toggle { order: 3; width: 330px; flex: 0 0 330px; }
.compare-button { order: 4; flex: 0 0 auto; }
.competition-label { order: 2; display: flex; }
.product-stage { padding-top: 94px; }

/* Compact in-app branding */
.greeting-brand-row { display: flex; align-items: center; justify-content: space-between; }
.greeting-brand-row > span { color: var(--action); font-size: 9px; font-weight: 800; }
.screen-brand { display: flex; align-items: center; gap: 6px; }
.screen-brand > i { width: 25px; height: 25px; display: grid; place-items: center; color: white; background: var(--action); border-radius: 7px; font: 800 7px var(--display); font-style: normal; }
.screen-brand > span { display: flex; flex-direction: column; }
.screen-brand strong { color: #2a1a0e; font: 700 8px/1 var(--display); }
.screen-brand small { color: var(--action); font-size: 4px; letter-spacing: .16em; margin-top: 3px; }
.dashboard-title > .screen-brand { align-self: center; }

@media (max-width: 760px) {
  .fixed-header { height: 74px; }
  .header-inner { display: flex; align-items: center; padding: 0 12px; overflow: hidden; }
  .header-inner > .logo { position: static; flex: 0 0 118px; margin: 0 auto 0 0; transform: scale(.68); transform-origin: left; }
  .role-toggle { flex: 0 0 170px; width: 170px; }
  .compare-button { flex: 0 0 126px; }
  .competition-label { display: none; }
  .product-stage { padding-top: 84px; }
}

@media (max-width: 450px) {
  .fixed-header { height: 68px; }
  .header-inner { padding-inline: 8px; gap: 5px; }
  .header-inner > .logo { flex-basis: 42px; transform: scale(.62); }
  .header-inner > .logo > div:last-child { display: none; }
  .role-toggle { flex-basis: 142px; width: 142px; }
  .role-toggle button { font-size: 7px; padding: 0 4px; }
  .compare-button { flex-basis: 112px; padding-inline: 6px; font-size: 7px; }
  .product-stage { padding-top: 68px; }
  .single-phone .phone-frame { height: calc(100dvh - 68px); }
}

@media (max-width: 350px) {
  .role-toggle { flex-basis: 132px; width: 132px; }
  .compare-button { flex-basis: 103px; font-size: 6px; }
}
````
