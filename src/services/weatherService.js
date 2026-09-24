/**
 * Servicio de telemetría meteorológica con Open-Meteo
 * Incluye soporte para cancelación de solicitudes (AbortController)
 * y resolución precisa de zona horaria local.
 */

export const fetchWeatherData = async (lat, lon, signal = null) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,apparent_temperature,precipitation,weather_code,is_day&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,cloud_cover,weather_code,is_day&forecast_days=2&timezone=auto`;
  
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Error en el servidor meteorológico (${response.status})`);
  }
  
  const data = await response.json();
  if (!data || !data.current || !data.hourly) {
    throw new Error('Datos meteorológicos no disponibles.');
  }

  const climaActual = {
    temperature_2m: data.current.temperature_2m,
    relative_humidity_2m: data.current.relative_humidity_2m,
    wind_speed_10m: data.current.wind_speed_10m,
    apparent_temperature: data.current.apparent_temperature ?? data.current.temperature_2m,
    surface_pressure: data.current.surface_pressure ?? 1013,
    precipitation: data.current.precipitation ?? 0,
    weather_code: data.current.weather_code ?? 0,
    is_day: data.current.is_day ?? 1
  };

  // Encontrar el índice de inicio exacto usando el timestamp devuelto por la API local
  let indexInicio = -1;
  if (data.current.time) {
    indexInicio = data.hourly.time.indexOf(data.current.time);
    if (indexInicio === -1) {
      const horaPrefix = data.current.time.slice(0, 13);
      indexInicio = data.hourly.time.findIndex(t => t.startsWith(horaPrefix));
    }
  }
  if (indexInicio === -1) {
    indexInicio = 0;
  }

  const horasFuturas = [];
  const maxHoras = Math.min(indexInicio + 12, data.hourly.time.length);

  for (let i = indexInicio; i < maxHoras; i++) {
    const rawTime = data.hourly.time[i];
    const fechaHora = new Date(rawTime);
    const horaFormateada = fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    horasFuturas.push({
      hora: horaFormateada,
      isNow: i === indexInicio,
      temp: data.hourly.temperature_2m[i],
      humedad: data.hourly.relative_humidity_2m[i],
      viento: data.hourly.wind_speed_10m[i],
      precipitacion: data.hourly.precipitation_probability?.[i] ?? 0,
      nubes: data.hourly.cloud_cover?.[i] ?? 0,
      weather_code: data.hourly.weather_code?.[i] ?? 0,
      is_day: data.hourly.is_day?.[i] ?? 1
    });
  }

  return { climaActual, pronostico12h: horasFuturas };
};
