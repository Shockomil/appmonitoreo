// File: api/presas.js (Vercel Serverless Function)
export default async function handler(req, res) {
    const { estado = 'Sinaloa' } = req.query;

    try {
        const response = await fetch(
            `https://sina.conagua.gob.mx/sina/datos/presas.php?estado=${encodeURIComponent(estado)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*'
                }
            }
        );

        if (!response.ok) throw new Error('Error al conectar con CONAGUA');

        const rawText = await response.text();
        let data;

        try {
            data = JSON.parse(rawText);
        } catch {
            const match = rawText.match(/\[\s*\{.*\}\s*\]/s);
            if (match) data = JSON.parse(match[0]);
        }

        if (!data || !Array.isArray(data)) throw new Error('Formato no válido');

        const presasNormalizadas = data.map((item, idx) => {
            const almacenamiento = parseFloat(item.AlmacenamientoActual || item.almacenamiento || 0);
            const capacidadNamo = parseFloat(item.NAMO || item.capacidadNamo || 1);
            let porcentaje = parseFloat(item.PorcentajeLlenado || item.porcentaje || 0);

            if (porcentaje === 0 && capacidadNamo > 0 && almacenamiento > 0) {
                porcentaje = (almacenamiento / capacidadNamo) * 100;
            }

            return {
                id: item.Clave || `presa-${idx}`,
                nombre: (item.NombreOficial || item.nombre || `Presa ${idx + 1}`).trim(),
                almacenamiento: Math.min(100, Math.max(0, Math.round(porcentaje * 10) / 10)),
                almacenamientoActual: almacenamiento.toFixed(2),
                capacidadNamo: capacidadNamo.toFixed(2),
                municipio: item.Municipio || ''
            };
        });

        // Cacheamos la respuesta por 12 horas en Vercel (se actualiza 2 veces al día)
        res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(presasNormalizadas);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}