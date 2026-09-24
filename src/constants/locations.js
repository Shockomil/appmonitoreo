export const ESTADOS_RAPIDOS = [
  "Sinaloa",
  "Sonora",
  "Chihuahua",
  "Durango",
  "Baja California",
  "Baja California Sur"
];

export const TODOS_LOS_ESTADOS = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

export const MUNICIPIOS_DATA = {
  "Sinaloa": [
    { id: '1', nombre: 'Ahome (Los Mochis)', lat: 25.7909, lon: -109.0332 },
    { id: '2', nombre: 'Culiacán', lat: 24.8091, lon: -107.3940 },
    { id: '3', nombre: 'Mazatlán', lat: 23.2494, lon: -106.4111 },
    { id: '4', nombre: 'Guasave', lat: 25.5755, lon: -108.4688 },
  ],
  "Sonora": [
    { id: '5', nombre: 'Hermosillo', lat: 29.0729, lon: -110.9559 },
    { id: '6', nombre: 'Ciudad Obregón', lat: 27.4828, lon: -109.9304 },
    { id: '7', nombre: 'Nogales', lat: 31.3145, lon: -110.9413 },
  ],
  "Baja California": [
    { id: '8', nombre: 'Mexicali', lat: 32.6245, lon: -115.4523 },
    { id: '9', nombre: 'Tijuana', lat: 32.5149, lon: -117.0382 },
    { id: '10', nombre: 'Ensenada', lat: 31.8667, lon: -116.5964 },
  ],
  "Chihuahua": [
    { id: '11', nombre: 'Chihuahua', lat: 28.6353, lon: -106.0889 },
    { id: '12', nombre: 'Ciudad Juárez', lat: 31.7333, lon: -106.4833 },
  ],
  "Durango": [
    { id: '13', nombre: 'Durango', lat: 24.0277, lon: -104.6532 },
    { id: '14', nombre: 'Gómez Palacio', lat: 25.5615, lon: -103.4984 },
  ],
  "Baja California Sur": [
    { id: '15', nombre: 'La Paz', lat: 24.1426, lon: -110.3128 },
    { id: '16', nombre: 'Los Cabos', lat: 23.0593, lon: -109.7029 },
  ]
};

export const getMunicipiosPorEstado = (estado) => {
  if (MUNICIPIOS_DATA[estado]) {
    return MUNICIPIOS_DATA[estado];
  }
  return [
    { id: `gen-${estado}`, nombre: `Cabecera Municipal (${estado})`, lat: 23.6345, lon: -102.5528 }
  ];
};
