/**
 * icons.js - Ícones SVG minimalistas e temas atmosféricos por código WMO.
 */

const ICONS = {
  clear: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5"></circle>
      <path d="M12 2.5v2M12 19.5v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2.5 12h2M19.5 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
    </svg>
  `,
  partlyCloudy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15.5 3v1.5M20 5l-1 1M21.5 9.5H20M11 5l1 1"></path>
      <path d="M12.75 9.5a2.75 2.75 0 1 1 5.08 1.45"></path>
      <path d="M6.5 18.5h9a3.25 3.25 0 0 0 .45-6.47 4.75 4.75 0 0 0-9.1-.68A3.5 3.5 0 0 0 6.5 18.5Z"></path>
    </svg>
  `,
  cloudy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 18.5h10.5a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.4 9.6 4.25 4.25 0 0 0 7 18.5Z"></path>
    </svg>
  `,
  fog: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 9h16M6 13h12M4 17h14"></path>
    </svg>
  `,
  drizzle: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 15h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.7 7.3 3.75 3.75 0 0 0 7 15Z"></path>
      <path d="M9 18.5v1.5M13 18.5v1.5M17 18.5v1.5"></path>
    </svg>
  `,
  rain: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 14.5h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.7 6.8 3.75 3.75 0 0 0 7 14.5Z"></path>
      <path d="M8.5 17.5 7.5 21M12.5 17.5 11.5 21M16.5 17.5 15.5 21"></path>
    </svg>
  `,
  snow: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 14.5h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.7 6.8 3.75 3.75 0 0 0 7 14.5Z"></path>
      <circle cx="8.5" cy="18.5" r="0.75" fill="currentColor"></circle>
      <circle cx="12" cy="20" r="0.75" fill="currentColor"></circle>
      <circle cx="15.5" cy="18.5" r="0.75" fill="currentColor"></circle>
    </svg>
  `,
  storm: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 14.5h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.7 6.8 3.75 3.75 0 0 0 7 14.5Z"></path>
      <path d="m12.8 14.5-2.3 3.75h2.6L11.2 22"></path>
    </svg>
  `,
  unknown: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5"></circle>
      <path d="M12 8.5v4M12 15.5h.01"></path>
    </svg>
  `
};

/**
 * Retorna o ícone SVG e o tema atmosférico correspondente ao código WMO.
 * @param {number|string} code
 * @returns {{ svg: string, theme: string }}
 */
export function getWeatherVisual(code) {
  const numeric = Number(code);
  if (code === null || code === undefined || code === '' || Number.isNaN(numeric)) {
    return { svg: ICONS.unknown, theme: 'default' };
  }

  if (numeric === 0) return { svg: ICONS.clear, theme: 'clear' };
  if (numeric === 1 || numeric === 2) return { svg: ICONS.partlyCloudy, theme: 'clear' };
  if (numeric === 3) return { svg: ICONS.cloudy, theme: 'cloudy' };
  if (numeric === 45 || numeric === 48) return { svg: ICONS.fog, theme: 'fog' };
  if (numeric >= 51 && numeric <= 55) return { svg: ICONS.drizzle, theme: 'rain' };
  if (numeric >= 56 && numeric <= 57) return { svg: ICONS.snow, theme: 'snow' };
  if ((numeric >= 61 && numeric <= 65) || (numeric >= 80 && numeric <= 81)) {
    return { svg: ICONS.rain, theme: 'rain' };
  }
  if ((numeric >= 66 && numeric <= 77) || numeric === 85 || numeric === 86) {
    return { svg: ICONS.snow, theme: 'snow' };
  }
  if (numeric === 82 || numeric >= 95) return { svg: ICONS.storm, theme: 'storm' };

  return { svg: ICONS.unknown, theme: 'default' };
}
