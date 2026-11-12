/**
 * storage.js - Módulo de persistência defensiva no localStorage.
 * Trata falhas comuns de indisponibilidade (navegação anônima, quota excedida, corrupção).
 */

const STORAGE_KEY = 'weather_app_last_city';

/**
 * Salva o nome da última cidade pesquisada com sucesso.
 * @param {string} cityName
 * @returns {boolean} Retorna true se salvo com sucesso, false em caso de falha.
 */
export function saveLastCity(cityName) {
  if (!cityName || typeof cityName !== 'string') {
    return false;
  }

  try {
    const payload = {
      city: cityName.trim(),
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    // Falha silenciosa para não quebrar a aplicação (ex: modo anônimo estrito)
    console.warn('Aviso: Não foi possível gravar no localStorage.', error);
    return false;
  }
}

/**
 * Recupera o nome da última cidade salva no localStorage.
 * @returns {string|null} Retorna o nome da cidade ou null se não houver registro ou falhar.
 */
export function getLastCity() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return null;
    }

    const parsed = JSON.parse(rawData);
    if (parsed && typeof parsed.city === 'string' && parsed.city.trim().length > 0) {
      return parsed.city.trim();
    }
    return null;
  } catch (error) {
    console.warn('Aviso: Falha ao ler ou interpretar dados do localStorage.', error);
    return null;
  }
}

/**
 * Remove o registro da última cidade salva.
 * @returns {boolean}
 */
export function clearLastCity() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Aviso: Falha ao limpar item do localStorage.', error);
    return false;
  }
}
