// ponytail: Pure Button component returning HTMLButtonElement with accessible >=56px touch target
import { getIconSvg } from './Icon.js';

export function createButton({
  text = '',
  icon = null,
  iconSize = 22,
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
  if (icon) inner += getIconSvg(icon, iconSize);
  if (text) inner += `<span>${text}</span>`;
  btn.innerHTML = inner;

  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  return btn;
}
