// ponytail: Renders decorative 9x9 QR grid
export function createFakeQR({ small = false } = {}) {
  const container = document.createElement('div');
  container.className = `fake-qr ${small ? 'small' : ''}`.trim();
  const filled = [0,1,2,3,4,5,6,8,10,12,14,16,18,19,20,22,24,25,26,28,30,32,34,36,38,40,42,44,46,48,49,50,52,54,56,58,60,62,64,66,68,70,72,73,74,76,78,80];

  for (let i = 0; i < 81; i++) {
    const bit = document.createElement('i');
    if (filled.includes(i)) bit.className = 'on';
    container.appendChild(bit);
  }

  return container;
}
