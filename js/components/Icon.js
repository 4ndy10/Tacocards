// ponytail: Native SVG icon helper with semantic culinary symbols. Zero external icon fonts.

const iconPaths = {
  album: '<rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h6" />',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
  back: '<path d="m15 18-6-6 6-6" />',
  card: '<rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" />',
  chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />',
  check: '<path d="m5 12 4 4L19 6" />',
  clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
  crown: '<path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z" />',
  edit: '<path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 6l3 3" />',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-5-4-8-7-12 0 5-7 6-7 12 0 4 3 7 7 7Z" /><path d="M12 22c2 0 3-2 3-4s-2-3-3-5c0 3-3 3-3 6 0 2 1 3 3 3Z" />',
  gift: '<path d="M4 10h16v10H4zM2 6h20v4H2zM12 6v14M12 6c-2-4-7-3-6 0M12 6c2-4 7-3 6 0" />',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15" />',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />',
  person: '<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />',
  qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 19v2" />',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10" />',
  shop: '<path d="M4 10v10h16V10M3 4h18l-1 6a3 3 0 0 1-5 1 3 3 0 0 1-6 0 3 3 0 0 1-5-1L3 4ZM9 20v-5h6v5" />',
  spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />',
  ticket: '<path d="M3 8a3 3 0 0 0 0 6v4h18v-4a3 3 0 0 0 0-6V4H3v4ZM13 7h4M13 11h4M13 15h2" />',
  trend: '<path d="m3 17 6-6 4 4 8-9M15 6h6v6" />',
  wallet: '<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12v3M16 11h5v4h-5a2 2 0 0 1 0-4Z" />',
  
  // Semantic food icons for map markers
  taco: '<path d="M3 17C4.5 9 10 5 18 6.5c-4.5 1-8 4.5-10 10.5l-5-1ZM9.5 17.5c1.8-5 5.5-7.5 11.5-6.5-3.5 1-6 3.5-7 6.5h-4.5Z" />',
  fish: '<path d="M2 16c5-2 9-6 11-10 3 4 7 8 9 9-4 2-8 3-11 2-2 3-5 4-9-1Z" /><circle cx="16" cy="8" r="1.2" fill="currentColor"/>',
  goat: '<path d="M4 10h16c0 6-3 9-8 9s-8-3-8-9Z" /><path d="M2 10h20M8 6c0-2 2-2 2-4M13 7c0-2 2-2 2-4" />',
  dessert: '<path d="M5 11h14l-1 9H6l-1-9ZM7 11c0-4 2-6 5-6s5 2 5 6M12 5V2" />',
  cutlery: '<path d="M5 4v6a2 2 0 0 0 2 2v8M7 4v6M9 4v6a2 2 0 0 1-2 2M15 4v16M13 4h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4V4Z" />'
};

export function getIconSvg(name, size = 20) {
  const content = iconPaths[name] || '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}

export function createIcon(name, size = 20) {
  const div = document.createElement('div');
  div.innerHTML = getIconSvg(name, size);
  return div.firstElementChild;
}
