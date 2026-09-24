/**
 * Servicio para consultar el estado de las presas en México.
 * Implementa redundancia (múltiples fuentes) y normalización de datos.
 */

// Mapeo de nombres de estados si una API requiere códigos o nombres específicos
const FORMATO_ESTADOS = {
    'Sinaloa': 'Sinaloa',
    'Sonora': 'Sonora',
    'Jalisco': 'Jalisco',
    'Chihuahua': 'Chihuahua',
    'Michoacán': 'Michoacan',
    // Se agregan según sea necesario
};

/**
 * Función principal para obtener datos de presas por estado.
 * Intenta con hasta 3 fuentes distintas si alguna falla o está fuera de línea.
 */
export async function obtenerDatosPresas(estado) {
    if (!estado) return [];

    // FUENTE 1: API Directa de Datos Abiertos de CONAGUA
    try {
        const datosFuente1 = await consultarDatosAbiertosConagua(estado);
        if (datosFuente1 && datosFuente1.length > 0) {
            return datosFuente1;
        }
    } catch (err) {
        console.warn('[DamsService] Fuente 1 (Datos Abiertos) no disponible:', err);
    }

    // FUENTE 2: Servidor JSON del SINA (Sistema Nacional de Información del Agua)
    try {
        const datosFuente2 = await consultarSinaConagua(estado);
        if (datosFuente2 && datosFuente2.length > 0) {
            return datosFuente2;
        }
    } catch (err) {
        console.warn('[DamsService] Fuente 2 (SINA CONAGUA) no disponible:', err);
    }

    // FUENTE 3: Servicio de respaldo con espejo JSON / Mock estructurado de emergencia
    try {
        const datosFuente3 = await consultarRespaldoEstructurado(estado);
        if (datosFuente3 && datosFuente3.length > 0) {
            return datosFuente3;
        }
    } catch (err) {
        console.error('[DamsService] Todas las fuentes de presas fallaron:', err);
    }

    return [];
}

// ---------------------------------------------------------------------------
// IMPLEMETACIÓN DE FUENTES DE DATOS
// ---------------------------------------------------------------------------

// 1. Fuente Datos Abiertos / Portal Gobierno
async function consultarDatosAbiertosConagua(estado) {
    const url = `https://datos.gob.mx/busca/api/3/action/datastore_search?resource_id=presas-mexico&q=${encodeURIComponent(estado)}`;
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const json = await response.json();

    if (json.success && json.result && json.result.records) {
        return normalizarPresas(json.result.records);
    }
    return null;
}

// 2. Fuente SINA CONAGUA
async function consultarSinaConagua(estado) {
    const estadoLimpio = FORMATO_ESTADOS[estado] || estado;
    const url = `https://sina.conagua.gob.mx/sina/datos/presas.php?estado=${encodeURIComponent(estadoLimpio)}`;

    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    return normalizarPresas(data);
}

// 3. Fuente de Respaldo Alternativa / Servidor Espejo
async function consultarRespaldoEstructurado(estado) {
    const url = `https://raw.githubusercontent.com/conagua-data/presas-mexico/main/data/${encodeURIComponent(estado.toLowerCase())}.json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    return normalizarPresas(data);
}

// ---------------------------------------------------------------------------
// NORMALIZADOR DE DATOS
// Mantiene una estructura uniforme sin importar qué API responda
// ---------------------------------------------------------------------------
function normalizarPresas(lista) {
    if (!Array.isArray(lista)) return [];

    return lista.map((item, idx) => {
        // Extraer campos buscando nombres comunes en las diferentes APIs
        const nombre = item.nombre || item.NOMBRE || item.presa || item.NOM_PRESA || `Presa ${idx + 1}`;
        const almacenamiento = parseFloat(item.almacenamiento || item.almacenamientoActual || item.VOLUME_HM3 || item.ALM_ACTUAL || 0);
        const capacidadNamo = parseFloat(item.namo || item.capacidadNamo || item.NAMO_HM3 || item.CAPACIDAD_TOTAL || 100);

        // Calcular porcentaje de llenado si no viene precalculado
        let porcentaje = parseFloat(item.porcentaje || item.PORCENTAJE_LLENADO || item.pct_llenado || 0);
        if (porcentaje === 0 && capacidadNamo > 0 && almacenamiento > 0) {
            porcentaje = (almacenamiento / capacidadNamo) * 100;
        }

        return {
            id: item.id || item.clave || `presa-${idx}`,
            nombre: nombre.trim(),
            porcentaje: Math.min(100, Math.max(0, Math.round(porcentaje * 10) / 10)), // Redondeado a 1 decimal
            almacenamientoActual: almacenamiento.toFixed(2),
            capacidadNamo: capacidadNamo.toFixed(2),
            municipio: item.municipio || item.MUNICIPIO || '',
            ultimaCaptura: item.fecha || item.FECHA || new Date().toISOString().split('T')[0]
        };
    });
}