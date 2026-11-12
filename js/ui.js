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

// Cache de elementos do DOM
const elements = {
  feedbackRegion: document.getElementById('feedback-region'),
  statusMessage: document.getElementById('status-message'),
  weatherSection: document.getElementById('weather-section'),
  searchForm: document.getElementById('search-form'),
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
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="status" aria-live="polite" class="status-box empty-state">
      <span class="status-icon" aria-hidden="true">📍</span>
      <p class="status-title">Pesquise uma cidade</p>
      <p class="status-desc">Digite o nome de uma localidade acima para ver a previsão meteorológica.</p>
    </div>
  `;
}

/**
 * Exibe o estado de carregamento com spinner e desabilita nova submissão.
 * @param {string} [cityName='']
 */
export function showLoading(cityName = '') {
  setSearchDisabled(true);
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  const message = cityName
    ? `Buscando previsão meteorológica para <strong>${cityName}</strong>...`
    : 'Consultando serviço meteorológico...';

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="status" aria-live="polite" class="status-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="status-title">Carregando dados</p>
      <p class="status-desc">${message}</p>
    </div>
  `;
}

/**
 * Exibe mensagem amigável de erro na interface.
 * @param {string} errorMessage
 */
export function showError(errorMessage) {
  setSearchDisabled(false);
  elements.weatherSection.classList.add('hidden');
  elements.feedbackRegion.classList.remove('hidden');

  elements.feedbackRegion.innerHTML = `
    <div id="status-message" role="alert" aria-live="assertive" class="status-box error-state">
      <span class="status-icon" aria-hidden="true">⚠️</span>
      <p class="status-title">Não foi possível carregar</p>
      <p class="status-desc">${errorMessage}</p>
    </div>
  `;
}

/**
 * Formata o nome completo da localidade (Cidade, Estado - País).
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
  // Localização e Data
  elements.currentCity.textContent = formatLocationName(location);
  elements.currentDate.textContent = formatCurrentDate();

  // Condição meteorológica e ícone
  const condition = getWeatherCondition(current.weatherCode);
  elements.currentIcon.textContent = condition.icon;
  elements.currentIcon.setAttribute('aria-label', condition.description);
  elements.currentCondition.textContent = condition.description;

  // Temperatura e métricas
  elements.currentTemp.textContent = roundTemperature(current.temperature);
  elements.currentHumidity.textContent = `${Math.round(current.humidity)}%`;
  elements.currentWind.textContent = `${Math.round(current.windSpeed)} km/h`;
}

/**
 * Renderiza a lista de cards com a previsão dos próximos 5 dias.
 * @param {Array<{ date: string, weatherCode: number, tempMax: number, tempMin: number }>} dailyForecasts
 */
export function renderForecast(dailyForecasts) {
  if (!elements.forecastGrid) return;

  if (!dailyForecasts || dailyForecasts.length === 0) {
    elements.forecastGrid.innerHTML = '<p class="status-desc">Previsão estendida indisponível.</p>';
    return;
  }

  const cardsHtml = dailyForecasts.map((day) => {
    const { weekday, date } = formatForecastDate(day.date);
    const condition = getWeatherCondition(day.weatherCode);
    const maxTemp = roundTemperature(day.tempMax);
    const minTemp = roundTemperature(day.tempMin);

    return `
      <article class="forecast-card" aria-label="Previsão para ${weekday}, ${date}">
        <span class="forecast-day">${weekday}</span>
        <span class="forecast-date">${date}</span>
        <span class="forecast-icon" role="img" aria-label="${condition.description}">${condition.icon}</span>
        <span class="forecast-condition">${condition.description}</span>
        <div class="forecast-temps">
          <span class="temp-max" title="Temperatura máxima">${maxTemp}°</span>
          <span class="temp-min" title="Temperatura mínima">${minTemp}°</span>
        </div>
      </article>
    `;
  }).join('');

  elements.forecastGrid.innerHTML = cardsHtml;
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

  // Oculta área de feedback e revela a seção com o clima
  elements.feedbackRegion.classList.add('hidden');
  elements.weatherSection.classList.remove('hidden');

  renderCurrentWeather(location, weather.current);
  renderForecast(weather.daily);
}
