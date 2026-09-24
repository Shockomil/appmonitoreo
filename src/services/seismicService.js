/**
 * Servicio de monitoreo sísmico con la API de USGS
 * Filtrado exclusivo para territorio mexicano con fechas precisas,
 * traducción de coordenadas/rumbo y formateo en español.
 */

const REGEX_MEXICO = /(sinaloa|sonora|chiapas|oaxaca|michoacan|guerrero|jalisco|colima|baja california|veracruz|puebla|hidalgo|durango|chihuahua|nayarit|tabasco|campeche|yucatan|quintana roo|coahuila|nuevo leon|tamaulipas|zacatecas|san luis potosi|queretaro|guanajuato|aguascalientes|estado de mexico|ciudad de mexico|cdmx|morelos|tlaxcala|golfo de california|, mexico|, mx)/i;
const REGEX_EXCLUIR_USA = /(new mexico|california|texas|arizona|united states|usa|ca-mx border)/i;

/**
 * Traduce rumbos y nombres geográficos al español
 */
const traducirUbicacion = (lugar) => {
  if (!lugar) return 'Región de México';

  return lugar
    .replace(/, MX$/i, ', México')
    .replace(/, Mexico$/i, ', México')
    .replace(/B\.C\./i, 'Baja California')
    .replace(/Gulf of California/i, 'Golfo de California')
    .replace(/(\d+)\s*km\s*NNE\s*of/i, '$1 km al NNE de')
    .replace(/(\d+)\s*km\s*NNW\s*of/i, '$1 km al NNO de')
    .replace(/(\d+)\s*km\s*SSE\s*of/i, '$1 km al SSE de')
    .replace(/(\d+)\s*km\s*SSW\s*of/i, '$1 km al SSO de')
    .replace(/(\d+)\s*km\s*ENE\s*of/i, '$1 km al ENE de')
    .replace(/(\d+)\s*km\s*ESE\s*of/i, '$1 km al ESE de')
    .replace(/(\d+)\s*km\s*WNW\s*of/i, '$1 km al ONO de')
    .replace(/(\d+)\s*km\s*WSW\s*of/i, '$1 km al OSO de')
    .replace(/(\d+)\s*km\s*NE\s*of/i, '$1 km al NE de')
    .replace(/(\d+)\s*km\s*NW\s*of/i, '$1 km al NO de')
    .replace(/(\d+)\s*km\s*SE\s*of/i, '$1 km al SE de')
    .replace(/(\d+)\s*km\s*SW\s*of/i, '$1 km al SO de')
    .replace(/(\d+)\s*km\s*N\s*of/i, '$1 km al Norte de')
    .replace(/(\d+)\s*km\s*S\s*of/i, '$1 km al Sur de')
    .replace(/(\d+)\s*km\s*E\s*of/i, '$1 km al Este de')
    .replace(/(\d+)\s*km\s*W\s*of/i, '$1 km al Oeste de');
};

/**
 * Convierte un timestamp en fecha legible, hora precisa y tiempo transcurrido
 */
export const formatearFechaSismo = (timestamp) => {
  if (!timestamp) {
    return {
      fechaCorta: 'Fecha N/D',
      fechaCompleta: 'Fecha no disponible',
      hora: '--:--',
      tiempoRelativo: ''
    };
  }

  const fechaObj = new Date(timestamp);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fechaObj.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let tiempoRelativo = '';
  if (diffMins < 2) {
    tiempoRelativo = 'Justo ahora';
  } else if (diffMins < 60) {
    tiempoRelativo = `Hace ${diffMins} min`;
  } else if (diffHoras < 24) {
    tiempoRelativo = `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
  } else if (diffDias === 1) {
    tiempoRelativo = 'Ayer';
  } else if (diffDias < 30) {
    tiempoRelativo = `Hace ${diffDias} días`;
  } else {
    tiempoRelativo = `Hace +30 días`;
  }

  // Nombre de meses en español
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const anio = fechaObj.getFullYear();
  const fechaCorta = `${dia} ${mes} ${anio}`;

  const hora = fechaObj.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    fechaCorta,
    hora,
    fechaCompleta: `${fechaCorta} a las ${hora}`,
    tiempoRelativo
  };
};

/**
 * Consulta de eventos sísmicos recientes en México
 */
export const fetchRecentEarthquakes = async (limit = 3, signal = null) => {
  const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=14&maxlatitude=32.7&minlongitude=-118&maxlongitude=-86&minmagnitude=2.8&limit=40';

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Error al consultar sismos (${response.status})`);
  }

  const data = await response.json();
  if (!data || !data.features || data.features.length === 0) {
    return [];
  }

  const sismosExclusivosMexico = data.features.filter(item => {
    const lugar = item.properties.place || '';
    return REGEX_MEXICO.test(lugar) && !REGEX_EXCLUIR_USA.test(lugar);
  });

  const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return sismosExclusivosMexico.slice(0, limit).map(item => {
    const props = item.properties;
    const geom = item.geometry;
    const mag = props.mag != null ? Number(props.mag.toFixed(1)) : 3.0;

    const fechaInfo = formatearFechaSismo(props.time);
    const ubicacionLimpia = traducirUbicacion(props.place);

    // Clasificación de severidad y paleta de color
    let severidad = 'LEVE';
    let colorMagnitud = '#38bdf8';
    let bgMagnitud = 'rgba(56, 189, 248, 0.15)';
    let borderMagnitud = 'rgba(56, 189, 248, 0.35)';

    if (mag >= 5.0) {
      severidad = 'FUERTE';
      colorMagnitud = '#ef4444';
      bgMagnitud = 'rgba(239, 68, 68, 0.2)';
      borderMagnitud = 'rgba(239, 68, 68, 0.5)';
    } else if (mag >= 4.0) {
      severidad = 'MODERADO';
      colorMagnitud = '#f59e0b';
      bgMagnitud = 'rgba(245, 158, 11, 0.2)';
      borderMagnitud = 'rgba(245, 158, 11, 0.45)';
    }

    const profundidadKm = geom.coordinates?.[2] != null ? Math.round(geom.coordinates[2]) : 10;

    return {
      id: item.id,
      magnitud: mag.toFixed(1),
      severidad,
      colorMagnitud,
      bgMagnitud,
      borderMagnitud,
      ubicacion: ubicacionLimpia,
      profundidad: `${profundidadKm} km`,
      fecha: fechaInfo.fechaCorta,
      hora: fechaInfo.hora,
      fechaCompleta: fechaInfo.fechaCompleta,
      tiempoRelativo: fechaInfo.tiempoRelativo,
      timestamp: props.time,
      coordenadas: {
        lon: geom.coordinates?.[0],
        lat: geom.coordinates?.[1]
      },
      actualizado: nowFormatted
    };
  });
};
