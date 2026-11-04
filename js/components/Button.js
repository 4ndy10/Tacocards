// ponytail: Pure Button component returning HTMLButtonElement with touch-friendly 44px target
import { getIconSvg } from './Icon.js';

export function createButton({
  text = '',
  icon = null,
  variant = 'primary', // 'primary' | 'outline' | 'quiet' | 'teal'
  className = '',
  disabled = false,
  onClick = null,
  type = 'button'
}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = `button button-${variant} ${className}`.trim();
  btn.disabled = disabled;

  let inner = '';
  if (icon) inner += getIconSvg(icon, 18);
  if (text) inner += `<span>${text}</span>`;
  btn.innerHTML = inner;

  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  return btn;
}
