/**
 * main.js - Orquestrador principal da aplicação.
 * Conecta eventos de formulário às chamadas da API e renderização de UI.
 */

import { searchCity, getWeather } from './api.js';
import { showLoading, showError, renderCurrentWeather } from './ui.js';

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

    renderCurrentWeather(location, weather.current);
  } catch (error) {
    showError(error.message);
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
