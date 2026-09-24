export const PRESAS_DATA = {
  "Sinaloa": [
    { id: 'p1', nombre: 'Luis Donaldo Colosio (Huites)', almacenamiento: 42.5, capacidadMm3: 3236, tendencia: 'stable', extraccion: '120 m³/s', aportacion: '45 m³/s' },
    { id: 'p2', nombre: 'Miguel Hidalgo y Costilla', almacenamiento: 31.2, capacidadMm3: 3058, tendencia: 'down', extraccion: '95 m³/s', aportacion: '12 m³/s' },
    { id: 'p3', nombre: 'Josefa Ortiz de Domínguez', almacenamiento: 28.4, capacidadMm3: 518, tendencia: 'stable', extraccion: '15 m³/s', aportacion: '5 m³/s' },
    { id: 'p4', nombre: 'Gustavo Díaz Ordaz (Bacurato)', almacenamiento: 54.8, capacidadMm3: 1618, tendencia: 'up', extraccion: '40 m³/s', aportacion: '70 m³/s' },
    { id: 'p5', nombre: 'Sanalona', almacenamiento: 61.3, capacidadMm3: 687, tendencia: 'up', extraccion: '25 m³/s', aportacion: '50 m³/s' }
  ],
  "Sonora": [
    { id: 'p6', nombre: 'Lázaro Cárdenas (La Angostura)', almacenamiento: 38.9, capacidadMm3: 714, tendencia: 'down', extraccion: '30 m³/s', aportacion: '8 m³/s' },
    { id: 'p7', nombre: 'Plutarco Elías Calles (El Novillo)', almacenamiento: 24.5, capacidadMm3: 2924, tendencia: 'down', extraccion: '110 m³/s', aportacion: '15 m³/s' },
    { id: 'p8', nombre: 'Álvaro Obregón (El Oviáchic)', almacenamiento: 30.1, capacidadMm3: 2989, tendencia: 'stable', extraccion: '85 m³/s', aportacion: '20 m³/s' }
  ],
  "Chihuahua": [
    { id: 'p9', nombre: 'La Boquilla', almacenamiento: 35.2, capacidadMm3: 2895, tendencia: 'down', extraccion: '75 m³/s', aportacion: '10 m³/s' },
    { id: 'p10', nombre: 'Francisco Murguía (Las Vírgenes)', almacenamiento: 40.8, capacidadMm3: 330, tendencia: 'stable', extraccion: '22 m³/s', aportacion: '14 m³/s' }
  ],
  "Durango": [
    { id: 'p11', nombre: 'Lázaro Cárdenas (El Palmito)', almacenamiento: 58.4, capacidadMm3: 2577, tendencia: 'up', extraccion: '50 m³/s', aportacion: '95 m³/s' },
    { id: 'p12', nombre: 'Francisco Zarco', almacenamiento: 65.1, capacidadMm3: 380, tendencia: 'stable', extraccion: '18 m³/s', aportacion: '25 m³/s' }
  ],
  "Baja California Sur": [
    { id: 'p13', nombre: 'La Buena Mujer', almacenamiento: 22.0, capacidadMm3: 8, tendencia: 'down', extraccion: '1.2 m³/s', aportacion: '0 m³/s' },
    { id: 'p14', nombre: 'Santa Rosa', almacenamiento: 45.5, capacidadMm3: 11, tendencia: 'stable', extraccion: '0.5 m³/s', aportacion: '1.0 m³/s' }
  ]
};

export const getPresasPorEstado = (estado) => {
  if (PRESAS_DATA[estado]) {
    return PRESAS_DATA[estado];
  }
  return [
    { 
      id: `gen-p-${estado}`, 
      nombre: `Sistema Hidrológico Regional (${estado})`, 
      almacenamiento: 45.0, 
      capacidadMm3: 1000, 
      tendencia: 'stable', 
      extraccion: '10 m³/s', 
      aportacion: '10 m³/s' 
    }
  ];
};
