import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeatherCondition,
  roundTemperature,
  formatForecastDate,
  formatCurrentDate
} from '../js/utils.js';

test('getWeatherCondition() - mapeamento de códigos WMO', async (t) => {
  await t.test('deve retornar descrição e ícone corretos para código de céu limpo (0)', () => {
    const result = getWeatherCondition(0);
    assert.deepEqual(result, { description: 'Céu limpo', icon: '☀️' });
  });

  await t.test('deve aceitar código numérico em formato de string ("0")', () => {
    const result = getWeatherCondition('0');
    assert.deepEqual(result, { description: 'Céu limpo', icon: '☀️' });
  });

  await t.test('deve retornar dados corretos para código de chuva leve (61)', () => {
    const result = getWeatherCondition(61);
    assert.deepEqual(result, { description: 'Chuva leve', icon: '🌦️' });
  });

  await t.test('deve retornar dados corretos para tempestade (95)', () => {
    const result = getWeatherCondition(95);
    assert.deepEqual(result, { description: 'Tempestade', icon: '⛈️' });
  });

  await t.test('deve retornar fallback para código numérico não mapeado (ex: 999)', () => {
    const result = getWeatherCondition(999);
    assert.deepEqual(result, { description: 'Condição desconhecida', icon: '🌡️' });
  });

  await t.test('deve retornar fallback para valores inválidos, null ou undefined', () => {
    assert.deepEqual(getWeatherCondition(null), { description: 'Condição desconhecida', icon: '🌡️' });
    assert.deepEqual(getWeatherCondition(undefined), { description: 'Condição desconhecida', icon: '🌡️' });
    assert.deepEqual(getWeatherCondition('texto_invalido'), { description: 'Condição desconhecida', icon: '🌡️' });
  });
});

test('roundTemperature() - arredondamento de temperaturas', async (t) => {
  await t.test('deve arredondar valores decimais corretamente', () => {
    assert.equal(roundTemperature(22.4), 22);
    assert.equal(roundTemperature(22.5), 23);
    assert.equal(roundTemperature(22.9), 23);
  });

  await t.test('deve tratar temperaturas negativas', () => {
    assert.equal(roundTemperature(-3.2), -3);
    assert.equal(roundTemperature(-3.8), -4);
  });

  await t.test('deve converter strings numéricas antes de arredondar', () => {
    assert.equal(roundTemperature('18.6'), 19);
  });

  await t.test('deve retornar "--" para valores nulos, vazios ou inválidos', () => {
    assert.equal(roundTemperature(null), '--');
    assert.equal(roundTemperature(undefined), '--');
    assert.equal(roundTemperature(''), '--');
    assert.equal(roundTemperature('abc'), '--');
  });
});

test('formatForecastDate() - formatação de data para os cards de previsão', async (t) => {
  await t.test('deve formatar data válida no formato "YYYY-MM-DD"', () => {
    const result = formatForecastDate('2026-11-13');
    assert.equal(result.date, '13/11');
    assert.ok(typeof result.weekday === 'string' && result.weekday.length > 0);
    assert.notEqual(result.weekday, '--');
  });

  await t.test('deve retornar valores de fallback para entradas inválidas', () => {
    assert.deepEqual(formatForecastDate(null), { weekday: '--', date: '--' });
    assert.deepEqual(formatForecastDate(undefined), { weekday: '--', date: '--' });
    assert.deepEqual(formatForecastDate(''), { weekday: '--', date: '--' });
    assert.deepEqual(formatForecastDate('data-invalida'), { weekday: '--', date: '--' });
  });
});

test('formatCurrentDate() - formatação da data do clima atual', async (t) => {
  await t.test('deve retornar uma string formatada em português com inicial maiúscula', () => {
    const fixedDate = new Date(2026, 10, 12); // 12 de novembro de 2026
    const result = formatCurrentDate(fixedDate);
    assert.ok(result.includes('12 de novembro'));
    assert.ok(result.charAt(0) === result.charAt(0).toUpperCase());
  });

  await t.test('deve retornar string vazia para data inválida', () => {
    assert.equal(formatCurrentDate('data-invalida'), '');
  });
});
