// ponytail: Centralized static mock data extracted from reference prototype
export const photos = {
  tacos: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1000&q=85',
  birria: 'https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?auto=format&fit=crop&w=1000&q=85',
  seafood: 'https://images.unsplash.com/photo-1749847259651-22276f9b3e54?auto=format&fit=crop&w=1000&q=85',
  street: 'https://images.unsplash.com/photo-1737017218249-a497e2a5ff50?auto=format&fit=crop&w=1000&q=85',
  dessert: 'https://images.unsplash.com/photo-1601579110733-f654670d8c30?auto=format&fit=crop&w=1000&q=85',
  tacos2: 'https://images.unsplash.com/photo-1683062332605-4e1209d75346?auto=format&fit=crop&w=1000&q=85'
};

export const rarityLabel = {
  comun: 'Común',
  rara: 'Rara',
  epica: 'Épica',
  legendaria: 'Legendaria'
};

export const cardDetails = {
  1: { blurb: 'Carbón de mezquite, tortillas al momento y una historia familiar que sigue creciendo.', address: 'Paseo del Río 184, Zona Río' },
  2: { blurb: 'Birria de cocción lenta preparada con una receta que ha unido a tres generaciones.', address: 'Calle Segunda 811, Centro' },
  3: { blurb: 'Producto del Pacífico comprado directo a pescadores y preparado frente a cada cliente.', address: 'Av. Revolución 1260, Zona Centro' },
  4: { blurb: 'Una tortería honesta que alimenta al barrio desde antes de que salga el sol.', address: 'Calle Quinta 420, Centro' },
  5: { blurb: 'Repostería fronteriza hecha en pequeños lotes y con recetas nacidas en casa.', address: 'Blvd. Sánchez Taboada 944, Zona Río' },
  6: { blurb: 'Una plancha de barrio, servicio nocturno y campechanos que ya son tradición.', address: 'Av. Revolución 1664, Zona Centro' },
  7: { blurb: 'La pieza legendaria reservada para quienes convierten la ciudad en su ruta gastronómica.', address: 'Disponible en toda Tijuana' }
};

export const locals = [
  {
    id: 1,
    name: 'Tacos El Cometa',
    owner: 'Mateo y Rosa',
    since: 'Desde 2017',
    dish: 'Especialidad: Cometa de Asada',
    type: 'Taquería familiar',
    zone: 'Zona Río',
    rarity: 'epica',
    number: '#047/200',
    art: 'taco',
    stats: [94, 82, 3],
    history: 'En 2017, Mateo regresó de Chiapas a Tijuana buscando empezar de nuevo. Con Rosa, una parrilla prestada y recetas de su familia, abrió un carrito para salir adelante. Hoy su hija lleva las cuentas y su carbón de mezquite reúne a la colonia cada noche.',
    schedule: 'Lun–Dom · 12:00–00:00',
    photo: photos.tacos,
    pin: 'p1',
    coords: { x: 26, y: 22 }
  },
  {
    id: 2,
    name: 'Birria La Brava',
    owner: 'Doña Elena',
    since: 'Desde 2014',
    dish: 'Especialidad: La Brava Dorada',
    type: 'Birriería de barrio',
    zone: 'Centro',
    rarity: 'legendaria',
    number: '#008/200',
    art: 'bowl',
    stats: [98, 91, 8],
    history: 'Doña Elena comenzó en 2014 cocinando tres ollas cada domingo para pagar los estudios de sus hijos. La receta venía de su madre y el primer comedor fue la cochera de su casa. Diez años después, sus hijos atienden las mesas que ella soñó llenar.',
    schedule: 'Mar–Dom · 07:00–15:00',
    photo: photos.birria,
    pin: 'p2',
    coords: { x: 74, y: 35 }
  },
  {
    id: 3,
    name: 'Mariscos La Marea',
    owner: 'Lupita Sandoval',
    since: 'Desde 2019',
    dish: 'Especialidad: Tostada Marea Alta',
    type: 'Marisquería local',
    zone: 'Av. Revolución',
    rarity: 'rara',
    number: '#083/200',
    art: 'seafood',
    stats: [89, 76, 2],
    history: 'Lupita llegó desde San Quintín en 2019 con una hielera, una mesa plegable y el propósito de sostener a su familia. Su primera tostada se vendió en una banqueta. Ahora compra directo a pescadores y da trabajo a otras cuatro mujeres.',
    schedule: 'Lun–Sáb · 11:00–19:00',
    photo: photos.seafood,
    pin: 'p3',
    coords: { x: 44, y: 52 }
  },
  {
    id: 4,
    name: 'Tortas El Andén',
    owner: 'Don Ernesto',
    since: 'Desde 2009',
    dish: 'Especialidad: La Especial del Andén',
    type: 'Tortería tradicional',
    zone: 'Centro',
    rarity: 'comun',
    number: '#121/200',
    art: 'torta',
    stats: [84, 68, 1],
    history: 'Don Ernesto perdió su empleo en 2009 y convirtió el puesto de periódicos de su padre en una pequeña tortería. Empezó sirviendo a seis trabajadores del rumbo. Desde entonces abre antes que salga el sol y conoce a muchos clientes por su nombre.',
    schedule: 'Lun–Sáb · 08:00–20:00',
    photo: photos.street,
    pin: 'p4',
    coords: { x: 22, y: 68 }
  },
  {
    id: 5,
    name: 'Dulce Frontera',
    owner: 'Mariana Cota',
    since: 'Desde 2021',
    dish: 'Especialidad: Nube de Cajeta',
    type: 'Repostería independiente',
    zone: 'Zona Río',
    rarity: 'rara',
    number: '#105/200',
    art: 'dessert',
    stats: [91, 72, 0],
    history: 'Mariana empezó a hornear en 2021 después de cerrar el salón donde trabajaba. Vendía rebanadas por mensaje y hacía las entregas con su hermana. Cada postre conserva algo de aquellas primeras recetas: paciencia, frontera y ganas de volver a comenzar.',
    schedule: 'Mar–Dom · 13:00–21:00',
    photo: photos.dessert,
    pin: 'p5',
    coords: { x: 80, y: 24 }
  },
  {
    id: 6,
    name: 'La Esquina 664',
    owner: 'Chuy y Maribel',
    since: 'Desde 2018',
    dish: 'Especialidad: Campechano 664',
    type: 'Taquería nocturna',
    zone: 'Av. Revolución',
    rarity: 'comun',
    number: '#162/200',
    art: 'taco',
    stats: [86, 64, 0],
    history: 'Chuy y Maribel comenzaron en 2018 con una plancha afuera de su casa para completar el gasto familiar. Cuatro bancos después se volvieron la parada nocturna de la colonia. Su meta sigue siendo sencilla: que nadie se vaya con hambre.',
    schedule: 'Mié–Dom · 18:00–02:00',
    photo: photos.tacos2,
    pin: 'p6',
    coords: { x: 72, y: 68 }
  }
];

export const goldenLocal = {
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
  coords: { x: 50, y: 40 }
};

export const couponsData = [
  { id: 1, discount: '2×1', title: 'Agua fresca', subtitle: 'Birria La Brava · hasta el domingo' },
  { id: 2, discount: '15%', title: 'Tostadas al centro', subtitle: 'Mariscos La Marea · después de las 16 h' },
  { id: 3, discount: '+$0', title: 'Extra de cajeta', subtitle: 'Dulce Frontera · en tu próxima visita' }
];

export const businessKpis = [
  { label: 'Visitas con QR', value: 132, delta: '+18%', series: [7, 11, 9, 16, 13, 23, 18], negative: false },
  { label: 'Clientes únicos', value: 91, delta: '+12%', series: [6, 8, 10, 9, 15, 16, 19], negative: false },
  { label: 'Tasa de retorno', value: '34%', delta: '+6.2 pp', series: [5, 8, 10, 13, 16, 17, 21], negative: false },
  { label: 'Canjes validados', value: 18, delta: '-4%', series: [16, 11, 13, 9, 12, 8, 7], negative: true },
  { label: 'Ingreso atribuible', value: '$23,232', delta: '+21%', series: [4, 8, 7, 14, 13, 20, 23], negative: false }
];
