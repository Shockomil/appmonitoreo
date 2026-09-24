/**
 * Utilidades y catálogo de códigos meteorológicos WMO (Open-Meteo)
 * Proporciona mapeos descriptivos, iconos, paletas de color y recomendaciones intuitivas.
 */

export const WMO_WEATHER_CODES = {
  0: {
    day: { label: 'Soleado / Despejado', icon: 'sunny', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    night: { label: 'Despejado', icon: 'moon', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' },
    tip: 'Cielo completamente despejado. Ideal para labores en campo abierto.'
  },
  1: {
    day: { label: 'Mayormente soleado', icon: 'sunny-outline', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    night: { label: 'Mayormente despejado', icon: 'moon-outline', color: '#93c5fd', bg: 'rgba(147, 197, 253, 0.15)' },
    tip: 'Nubosidad escasa. Radiación solar directa moderada-alta.'
  },
  2: {
    day: { label: 'Parcialmente nublado', icon: 'partly-sunny', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    night: { label: 'Parcialmente nublado', icon: 'cloudy-night', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' },
    tip: 'Intervalos de nubes y claros. Condiciones de temperatura templada.'
  },
  3: {
    day: { label: 'Nublado / Cubierto', icon: 'cloudy', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    night: { label: 'Nublado / Cubierto', icon: 'cloudy', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    tip: 'Cielo cubierto. Reducción en la visibilidad e iluminación solar.'
  },
  45: {
    day: { label: 'Niebla matutina', icon: 'cloud', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)' },
    night: { label: 'Niebla espesa', icon: 'cloud', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    tip: 'Visibilidad reducida. Conducción con precaución en carreteras.'
  },
  48: {
    day: { label: 'Neblina escarchada', icon: 'cloud', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)' },
    night: { label: 'Neblina escarchada', icon: 'cloud', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    tip: 'Condensación con escarcha. Precaución con superficies resbaladizas.'
  },
  51: {
    day: { label: 'Llovizna ligera', icon: 'rainy-outline', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)' },
    night: { label: 'Llovizna ligera', icon: 'rainy-outline', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)' },
    tip: 'Brizna leve intermitente. Sin acumulación de agua crítica.'
  },
  53: {
    day: { label: 'Llovizna moderada', icon: 'rainy-outline', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)' },
    night: { label: 'Llovizna moderada', icon: 'rainy-outline', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)' },
    tip: 'Precipitación continua leve. Pavimento mojado.'
  },
  55: {
    day: { label: 'Llovizna intensa', icon: 'rainy', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' },
    night: { label: 'Llovizna intensa', icon: 'rainy', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' },
    tip: 'Precipitación densa. Portar impermeable o protección para equipos.'
  },
  61: {
    day: { label: 'Lluvia ligera', icon: 'rainy-outline', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)' },
    night: { label: 'Lluvia ligera', icon: 'rainy-outline', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)' },
    tip: 'Lluvia suave. Actividades de monitoreo en exterior con resguardo.'
  },
  63: {
    day: { label: 'Lluvia moderada', icon: 'rainy', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.2)' },
    night: { label: 'Lluvia moderada', icon: 'rainy', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.2)' },
    tip: 'Lluvia constante. Posibles encharcamientos en zonas bajas.'
  },
  65: {
    day: { label: 'Lluvia fuerte', icon: 'rainy', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.25)' },
    night: { label: 'Lluvia fuerte', icon: 'rainy', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.25)' },
    tip: 'Alerta por precipitación copiosa. Evitar zonas de escorrentía rápida.'
  },
  71: {
    day: { label: 'Nevada ligera', icon: 'snow-outline', color: '#bae6fd', bg: 'rgba(186, 230, 253, 0.2)' },
    night: { label: 'Nevada ligera', icon: 'snow-outline', color: '#bae6fd', bg: 'rgba(186, 230, 253, 0.2)' },
    tip: 'Caída de nieve leve. Bajas temperaturas.'
  },
  73: {
    day: { label: 'Nevada moderada', icon: 'snow', color: '#7dd3fc', bg: 'rgba(125, 211, 252, 0.25)' },
    night: { label: 'Nevada moderada', icon: 'snow', color: '#7dd3fc', bg: 'rgba(125, 211, 252, 0.25)' },
    tip: 'Acumulación de nieve en techos y caminos.'
  },
  75: {
    day: { label: 'Nevada intensa', icon: 'snow', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.3)' },
    night: { label: 'Nevada intensa', icon: 'snow', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.3)' },
    tip: 'Tormenta de nieve. Riesgo de congelamiento severo.'
  },
  80: {
    day: { label: 'Chubascos ligeros', icon: 'rainy-outline', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' },
    night: { label: 'Chubascos ligeros', icon: 'rainy-outline', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' },
    tip: 'Chubasco pasajero. Posibles ráfagas repentinas de viento.'
  },
  81: {
    day: { label: 'Chubascos moderados', icon: 'rainy', color: '#0369a1', bg: 'rgba(3, 105, 161, 0.25)' },
    night: { label: 'Chubascos moderados', icon: 'rainy', color: '#0369a1', bg: 'rgba(3, 105, 161, 0.25)' },
    tip: 'Chubascos fuertes de corta duración.'
  },
  82: {
    day: { label: 'Chubascos violentos', icon: 'thunderstorm-outline', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)' },
    night: { label: 'Chubascos violentos', icon: 'thunderstorm-outline', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)' },
    tip: 'Chubascos de alta intensidad con riesgo de inundación repentina.'
  },
  95: {
    day: { label: 'Tormenta eléctrica', icon: 'thunderstorm', color: '#eab308', bg: 'rgba(234, 179, 8, 0.25)' },
    night: { label: 'Tormenta eléctrica', icon: 'thunderstorm', color: '#eab308', bg: 'rgba(234, 179, 8, 0.25)' },
    tip: 'Actividad eléctrica detectada. Suspender maniobras en exteriores y antenas.'
  },
  96: {
    day: { label: 'Tormenta con granizo', icon: 'thunderstorm', color: '#f97316', bg: 'rgba(249, 115, 22, 0.25)' },
    night: { label: 'Tormenta con granizo', icon: 'thunderstorm', color: '#f97316', bg: 'rgba(249, 115, 22, 0.25)' },
    tip: 'Peligro por granizo y descargas eléctricas. Resguardar vehículos e infraestructura.'
  },
  99: {
    day: { label: 'Tormenta severa', icon: 'thunderstorm', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.3)' },
    night: { label: 'Tormenta severa', icon: 'thunderstorm', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.3)' },
    tip: 'Condición climática peligrosa. Mantenerse en instalaciones cerradas.'
  }
};

/**
 * Obtiene la información visual e interpretativa a partir del código WMO y condición día/noche.
 */
export const getWeatherInfo = (code, isDay = 1) => {
  const numericCode = Number(code) || 0;
  const config = WMO_WEATHER_CODES[numericCode] || WMO_WEATHER_CODES[0];
  const variant = isDay ? config.day : config.night;

  return {
    label: variant.label,
    icon: variant.icon,
    color: variant.color,
    bg: variant.bg,
    tip: config.tip,
    isDay: Boolean(isDay)
  };
};

/**
 * Calcula nivel de riesgo y estilo para probabilidad de lluvia
 */
export const getRainRiskInfo = (probabilidad) => {
  const p = Number(probabilidad) || 0;
  if (p >= 60) {
    return {
      nivel: 'Alta',
      color: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.18)',
      icon: 'rainy',
      texto: `${p}% • Probabilidad Alta`
    };
  }
  if (p >= 25) {
    return {
      nivel: 'Moderada',
      color: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.18)',
      icon: 'umbrella-outline',
      texto: `${p}% • Probabilidad Media`
    };
  }
  return {
    nivel: 'Baja',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    icon: 'water-outline',
    texto: `${p}% • Muy Baja`
  };
};

/**
 * Descriptor e interpretación para la velocidad del viento (km/h)
 */
export const getWindDescriptor = (velocidad) => {
  const v = Number(velocidad) || 0;
  if (v > 45) return { texto: 'Viento Fuerte', color: '#ef4444', icono: 'warning-outline' };
  if (v > 25) return { texto: 'Brisa Fresca / Intensa', color: '#f59e0b', icono: 'flag-outline' };
  if (v > 10) return { texto: 'Brisa Moderada', color: '#38bdf8', icono: 'flag-outline' };
  return { texto: 'Calma / Suave', color: '#34d399', icono: 'checkmark-circle-outline' };
};

/**
 * Descriptor e interpretación para la humedad relativa (%)
 */
export const getHumidityDescriptor = (humedad) => {
  const h = Number(humedad) || 0;
  if (h > 80) return { texto: 'Muy Húmedo / Sofocante', color: '#0284c7' };
  if (h > 60) return { texto: 'Húmedo', color: '#38bdf8' };
  if (h > 35) return { texto: 'Confortable', color: '#34d399' };
  return { texto: 'Ambiente Seco', color: '#f59e0b' };
};
