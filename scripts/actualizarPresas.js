const fs = require('fs');
const https = require('https');

async function obtenerDatosRealesConagua() {
    console.log('Consultando boletín/datos oficiales de CONAGUA...');

    // Agente para ignorar certificados SSL no válidos o autofirmados de CONAGUA
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const url = 'https://sinav30.conagua.gob.mx:8080/Presas/datos/presas.php?estado=Sinaloa';

    try {
        const response = await fetch(url, {
            dispatcher: undefined, // Para Node Native Fetch si usas agent o custom options
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': 'https://sinav30.conagua.gob.mx:8080/Presas/'
            }
        }).catch(async (err) => {
            // Fallback usando https nativo si fetch de Node falla por certificados
            return new Promise((resolve, reject) => {
                https.get(url, { rejectUnauthorized: false }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            resolve({
                                ok: res.statusCode === 200,
                                status: res.statusCode,
                                json: async () => JSON.parse(data)
                            });
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        const presasNormalizadas = data.map((item, idx) => {
            const almacenamiento = parseFloat(item.AlmacenamientoActual || item.almacenamiento || 0);
            const capacidadNamo = parseFloat(item.NAMO || item.capacidadNamo || 1);
            let porcentaje = parseFloat(item.PorcentajeLlenado || item.porcentaje || 0);

            if ((!porcentaje || porcentaje === 0) && capacidadNamo > 0) {
                porcentaje = (almacenamiento / capacidadNamo) * 100;
            }

            return {
                id: item.Clave || `presa-${idx}`,
                nombre: (item.NombreOficial || item.nombre || `Presa ${idx + 1}`).trim(),
                almacenamiento: Math.min(100, Math.max(0, Math.round(porcentaje * 10) / 10)),
                almacenamientoActual: almacenamiento.toFixed(2),
                capacidadNamo: capacidadNamo.toFixed(2),
                municipio: item.Municipio || '',
                fechaReporte: item.Fecha || new Date().toISOString().split('T')[0]
            };
        });

        fs.writeFileSync('./presas_sinaloa.json', JSON.stringify({
            ultimaActualizacion: new Date().toISOString(),
            presas: presasNormalizadas
        }, null, 2));

        console.log('✅ Archivo presas_sinaloa.json actualizado con éxito.');

    } catch (error) {
        console.error('❌ Error al extraer boletín:', error.message);
    }
}

obtenerDatosRealesConagua();