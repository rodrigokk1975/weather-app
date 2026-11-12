/**
 * Dicionário de códigos meteorológicos WMO (World Meteorological Organization)
 * mapeados para descrições em Português e emojis representativos.
 */
export const WMO_WEATHER_CODES = {
  0: { description: 'Céu limpo', icon: '☀️' },
  1: { description: 'Principalmente limpo', icon: '🌤️' },
  2: { description: 'Parcialmente nublado', icon: '⛅' },
  3: { description: 'Encoberto', icon: '☁️' },
  45: { description: 'Nevoeiro', icon: '🌫️' },
  48: { description: 'Nevoeiro com geada', icon: '🌫️' },
  51: { description: 'Garoa leve', icon: '🌦️' },
  53: { description: 'Garoa moderada', icon: '🌦️' },
  55: { description: 'Garoa densa', icon: '🌧️' },
  56: { description: 'Garoa congelante leve', icon: '🌨️' },
  57: { description: 'Garoa congelante densa', icon: '🌨️' },
  61: { description: 'Chuva leve', icon: '🌦️' },
  63: { description: 'Chuva moderada', icon: '🌧️' },
  65: { description: 'Chuva forte', icon: '🌧️' },
  66: { description: 'Chuva congelante leve', icon: '🌨️' },
  67: { description: 'Chuva congelante forte', icon: '🌨️' },
  71: { description: 'Neve fraca', icon: '🌨️' },
  73: { description: 'Neve moderada', icon: '🌨️' },
  75: { description: 'Neve intensa', icon: '❄️' },
  77: { description: 'Grãos de neve', icon: '❄️' },
  80: { description: 'Pancadas de chuva leves', icon: '🌦️' },
  81: { description: 'Pancadas de chuva moderadas', icon: '🌧️' },
  82: { description: 'Pancadas de chuva violentas', icon: '⛈️' },
  85: { description: 'Pancadas de neve leves', icon: '🌨️' },
  86: { description: 'Pancadas de neve pesadas', icon: '❄️' },
  95: { description: 'Tempestade', icon: '⛈️' },
  96: { description: 'Tempestade com granizo leve', icon: '⛈️' },
  99: { description: 'Tempestade com granizo forte', icon: '⛈️' },
};

/**
 * Retorna a condição climática (descrição e ícone) correspondente a um código WMO.
 * @param {number|string} code - Código WMO numérico retornado pela Open-Meteo.
 * @returns {{ description: string, icon: string }}
 */
export function getWeatherCondition(code) {
  const numericCode = Number(code);
  if (!Number.isNaN(numericCode) && WMO_WEATHER_CODES[numericCode]) {
    return WMO_WEATHER_CODES[numericCode];
  }
  return { description: 'Condição desconhecida', icon: '🌡️' };
}

/**
 * Arredonda um valor numérico para o número inteiro mais próximo.
 * Retorna '--' se o valor for inválido.
 * @param {number|string|null|undefined} value
 * @returns {number|string}
 */
export function roundTemperature(value) {
  if (value === null || value === undefined || value === '') {
    return '--';
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return '--';
  }
  return Math.round(num);
}

/**
 * Formata a data atual por extenso em Português.
 * Exemplo: "Quinta-feira, 12 de novembro"
 * @param {Date|string|number} [date=new Date()]
 * @returns {string}
 */
export function formatCurrentDate(date = new Date()) {
  const targetDate = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(targetDate.getTime())) {
    return '';
  }

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  const formatted = targetDate.toLocaleDateString('pt-BR', options);
  // Deixa a primeira letra da semana em maiúscula
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formata uma data no formato "YYYY-MM-DD" para exibição abreviada no card de previsão.
 * Exemplo de retorno: { weekday: "Seg", date: "12/11" }
 * @param {string} dateString - Data em formato ISO/YYYY-MM-DD.
 * @returns {{ weekday: string, date: string }}
 */
export function formatForecastDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return { weekday: '--', date: '--' };
  }

  // Adiciona horário de meio-dia para evitar desvios de fuso horário ao instanciar Date
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { weekday: '--', date: '--' };
  }

  const rawWeekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const weekday = rawWeekday.replace('.', '').toUpperCase();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateFormatted = `${day}/${month}`;

  return {
    weekday,
    date: dateFormatted
  };
}
