/**
 * main.js - Orquestrador principal da aplicação.
 * Conecta eventos de formulário, persistência local, chamadas da API e renderização de UI.
 */

import { searchCity, getWeather } from './api.js';
import { showLoading, showError, renderWeatherData, showEmptyState } from './ui.js';
import { saveLastCity, getLastCity } from './storage.js';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');

/**
 * Executa a busca e renderização dos dados de clima para uma localidade.
 * @param {string} cityName
 */
export async function handleSearch(cityName) {
  const query = cityName ? cityName.trim() : '';
  if (!query) {
    showError('Por favor, informe o nome de uma cidade.');
    return;
  }

  showLoading(query);

  try {
    const location = await searchCity(query);
    const weather = await getWeather(location.latitude, location.longitude);

    renderWeatherData(location, weather);
    saveLastCity(location.name);

    if (cityInput) {
      cityInput.value = location.name;
    }
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Inicializa a aplicação ao carregar a página.
 * Restaura a última cidade pesquisada ou apresenta o estado inicial.
 */
export function initApp() {
  const lastCity = getLastCity();

  if (lastCity) {
    if (cityInput) {
      cityInput.value = lastCity;
    }
    handleSearch(lastCity);
  } else {
    showEmptyState();
  }
}

// Registro de eventos
if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = cityInput ? cityInput.value : '';
    handleSearch(cityName);
  });
}

// Inicialização automática no carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
