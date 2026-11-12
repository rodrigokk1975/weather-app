/**
 * api.js - Módulo de integração com os serviços da Open-Meteo.
 * Gerencia geocodificação de cidades e busca de previsão meteorológica,
 * com tratamento defensivo de falhas de rede, HTTP e dados não encontrados.
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Busca as coordenadas geográficas de uma cidade pelo nome.
 * @param {string} cityName - Nome da localidade informada pelo usuário.
 * @returns {Promise<{ name: string, country: string, admin1: string, latitude: number, longitude: number }>}
 */
export async function searchCity(cityName) {
  const query = cityName ? cityName.trim() : '';
  if (!query) {
    throw new Error('Por favor, informe o nome de uma cidade.');
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=1&language=pt&format=json`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error('Falha na conexão de rede. Verifique seu acesso à internet e tente novamente.');
  }

  if (!response.ok) {
    throw new Error(`Falha no serviço de localização (Status HTTP ${response.status}). Tente novamente em instantes.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('A resposta do serviço de busca é inválida ou inesperada.');
  }

  if (!data.results || data.results.length === 0) {
    throw new Error(`Não encontramos nenhuma cidade com o nome "${query}". Verifique a ortografia.`);
  }

  const primaryResult = data.results[0];

  return {
    name: primaryResult.name,
    country: primaryResult.country || '',
    admin1: primaryResult.admin1 || '',
    latitude: primaryResult.latitude,
    longitude: primaryResult.longitude
  };
}

/**
 * Obtém os dados de clima atual e previsão diária para as coordenadas fornecidas.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{
 *   current: { temperature: number, humidity: number, windSpeed: number, weatherCode: number, time: string },
 *   daily: Array<{ date: string, weatherCode: number, tempMax: number, tempMin: number }>
 * }>}
 */
export async function getWeather(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Coordenadas geográficas inválidas para consulta de clima.');
  }

  // Solicitamos 6 dias para extrair os próximos 5 dias subsequentes ao dia atual
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '6',
    timezone: 'auto'
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error('Falha na conexão ao obter dados meteorológicos. Verifique sua conexão.');
  }

  if (!response.ok) {
    throw new Error(`Falha no serviço meteorológico (Status HTTP ${response.status}). Tente mais tarde.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Formato inválido na resposta meteorológica da Open-Meteo.');
  }

  if (!data.current || !data.daily) {
    throw new Error('Dados meteorológicos incompletos retornados pelo serviço.');
  }

  const current = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    time: data.current.time
  };

  // Os próximos 5 dias subsequentes ao dia corrente (índices 1 a 5)
  const daily = [];
  const totalDays = data.daily.time ? data.daily.time.length : 0;
  
  // Se vier com 6 ou mais dias, pegamos do dia 1 em diante; se vier com 5, usamos os disponíveis
  const startIndex = totalDays >= 6 ? 1 : 0;
  const endIndex = Math.min(startIndex + 5, totalDays);

  for (let i = startIndex; i < endIndex; i++) {
    daily.push({
      date: data.daily.time[i],
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i]
    });
  }

  return {
    current,
    daily
  };
}
