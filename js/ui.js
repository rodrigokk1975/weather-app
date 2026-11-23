/**
 * ui.js - Módulo de manipulação do DOM e estados da interface.
 * Controla os estados de feedback (vazio, carregando, erro) e renderização do clima.
 */

import {
  getWeatherCondition,
  roundTemperature,
  formatCurrentDate,
  formatForecastDate
} from './utils.js';
import { getWeatherVisual } from './icons.js';

const elements = {
  feedbackRegion: document.getElementById('feedback-region'),
  weatherSection: document.getElementById('weather-section'),
  cityInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),

  // Clima Atual
  currentCity: document.getElementById('current-city'),
  currentDate: document.getElementById('current-date'),
  currentIcon: document.getElementById('current-icon'),
  currentTemp: document.getElementById('current-temp'),
  currentCondition: document.getElementById('current-condition'),
  currentHumidity: document.getElementById('current-humidity'),
  currentWind: document.getElementById('current-wind'),

  // Previsão Diária
  forecastGrid: document.getElementById('forecast-grid')
};

const QUICK_CITIES = ['São Paulo', 'Lisboa', 'Tóquio'];

/**
 * Escapa caracteres HTML para evitar injeção ao renderizar texto dinâmico.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Atualiza o tema atmosférico sutil da página.
 * @param {string} theme
 */
function setWeatherTheme(theme = 'default') {
  document.body.dataset.weather = theme;
}

/**
 * Habilita ou desabilita os controles de busca durante requisições.
 * @param {boolean} disabled
 */
function setSearchDisabled(disabled) {
  if (elements.cityInput) elements.cityInput.disabled = disabled;
  if (elements.searchBtn) elements.searchBtn.disabled = disabled;
}

/**
 * Exibe o estado inicial/vazio da aplicação.
 */
export function showEmptyState() {
  setSearchDisabled(false);
  setWeatherTheme('default');
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  const chipsHtml = QUICK_CITIES.map(
    (city) => `<button type="button" class="city-chip" data-city="${city}">${city}</button>`
  ).join('');

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="status" aria-live="polite" class="status-panel empty-state">
      <p class="status-title">Consulte o tempo em qualquer cidade</p>
      <p class="status-desc">Digite o nome acima ou escolha um destino para começar.</p>
      <div class="quick-cities" aria-label="Sugestões de cidades">
        ${chipsHtml}
      </div>
    </div>
  `;
}

/**
 * Exibe o estado de carregamento e desabilita nova submissão.
 * @param {string} [cityName='']
 */
export function showLoading(cityName = '') {
  setSearchDisabled(true);
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  const safeCity = escapeHtml(cityName);
  const label = safeCity ? `Buscando ${safeCity}...` : 'Carregando previsão...';

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="status" aria-live="polite" class="status-panel loading-state">
      <div class="spinner" aria-hidden="true"></div>
      <p class="status-desc">${label}</p>
    </div>
  `;
}

/**
 * Exibe mensagem amigável de erro na interface.
 * @param {string} errorMessage
 */
export function showError(errorMessage) {
  setSearchDisabled(false);
  setWeatherTheme('default');
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  const safeMessage = escapeHtml(errorMessage || 'Ocorreu um erro inesperado.');

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="alert" aria-live="assertive" class="status-panel error-state">
      <p class="status-title">Não foi possível carregar</p>
      <p class="status-desc">${safeMessage}</p>
    </div>
  `;
}

/**
 * Formata o nome completo da localidade (Cidade, Estado, País).
 * @param {{ name: string, country: string, admin1: string }} location
 * @returns {string}
 */
export function formatLocationName(location) {
  const parts = [location.name];
  if (location.admin1 && location.admin1 !== location.name) {
    parts.push(location.admin1);
  }
  if (location.country) {
    parts.push(location.country);
  }
  return parts.join(', ');
}

/**
 * Renderiza as informações do clima atual na tela.
 * @param {{ name: string, country: string, admin1: string }} location
 * @param {{ temperature: number, humidity: number, windSpeed: number, weatherCode: number }} current
 */
export function renderCurrentWeather(location, current) {
  elements.currentCity.textContent = formatLocationName(location);
  elements.currentDate.textContent = formatCurrentDate();

  const condition = getWeatherCondition(current.weatherCode);
  const visual = getWeatherVisual(current.weatherCode);

  setWeatherTheme(visual.theme);
  elements.currentIcon.innerHTML = visual.svg;
  elements.currentIcon.setAttribute('aria-label', condition.description);
  elements.currentCondition.textContent = condition.description;

  elements.currentTemp.textContent = roundTemperature(current.temperature);
  elements.currentHumidity.textContent = `${Math.round(current.humidity)}%`;
  elements.currentWind.textContent = `${Math.round(current.windSpeed)} km/h`;
}

/**
 * Renderiza a previsão dos próximos 5 dias com barra proporcional de amplitude térmica.
 * @param {Array<{ date: string, weatherCode: number, tempMax: number, tempMin: number }>} dailyForecasts
 */
export function renderForecast(dailyForecasts) {
  if (!elements.forecastGrid) return;

  if (!dailyForecasts || dailyForecasts.length === 0) {
    elements.forecastGrid.innerHTML = '<p class="status-desc">Previsão indisponível.</p>';
    return;
  }

  const validMins = dailyForecasts.map((d) => Number(d.tempMin)).filter((n) => !Number.isNaN(n));
  const validMaxs = dailyForecasts.map((d) => Number(d.tempMax)).filter((n) => !Number.isNaN(n));
  const weekMin = validMins.length ? Math.min(...validMins) : 0;
  const weekMax = validMaxs.length ? Math.max(...validMaxs) : 1;
  const span = Math.max(weekMax - weekMin, 1);

  const itemsHtml = dailyForecasts.map((day) => {
    const { weekday, date } = formatForecastDate(day.date);
    const condition = getWeatherCondition(day.weatherCode);
    const visual = getWeatherVisual(day.weatherCode);
    const maxTemp = roundTemperature(day.tempMax);
    const minTemp = roundTemperature(day.tempMin);

    const rawLeft = ((Number(day.tempMin) - weekMin) / span) * 100;
    const rawRight = ((Number(day.tempMax) - weekMin) / span) * 100;
    const leftPct = Number.isNaN(rawLeft) ? 0 : Math.max(0, Math.min(88, rawLeft));
    const widthPct = Number.isNaN(rawRight) ? 100 : Math.max(12, Math.min(100 - leftPct, rawRight - leftPct));

    return `
      <article class="forecast-item" aria-label="${weekday}, ${date}: ${condition.description}, mínima de ${minTemp} graus e máxima de ${maxTemp} graus">
        <div class="forecast-day-group">
          <span class="forecast-day">${weekday}</span>
          <span class="forecast-date">${date}</span>
        </div>
        <div class="forecast-icon" role="img" title="${condition.description}" aria-label="${condition.description}">
          ${visual.svg}
        </div>
        <div class="forecast-range">
          <span class="temp-min" title="Mínima">${minTemp}°</span>
          <div class="range-track" aria-hidden="true">
            <span class="range-fill" style="left: ${leftPct.toFixed(1)}%; width: ${widthPct.toFixed(1)}%;"></span>
          </div>
          <span class="temp-max" title="Máxima">${maxTemp}°</span>
        </div>
      </article>
    `;
  }).join('');

  elements.forecastGrid.innerHTML = itemsHtml;
}

/**
 * Renderiza todos os dados climáticos (atual + previsão estendida).
 * @param {{ name: string, country: string, admin1: string }} location
 * @param {{
 *   current: { temperature: number, humidity: number, windSpeed: number, weatherCode: number },
 *   daily: Array<{ date: string, weatherCode: number, tempMax: number, tempMin: number }>
 * }} weather
 */
export function renderWeatherData(location, weather) {
  setSearchDisabled(false);

  elements.feedbackRegion.classList.add('hidden');
  elements.weatherSection.classList.remove('hidden');

  renderCurrentWeather(location, weather.current);
  renderForecast(weather.daily);
}
