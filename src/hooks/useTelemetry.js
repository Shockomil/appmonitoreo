import { useState, useEffect, useRef, useCallback } from 'react';

import { AppState } from 'react-native';

import { getMunicipiosPorEstado } from '../constants/locations';

import { getPresasPorEstado } from '../constants/dams';

import { BANCO_NOTICIAS } from '../constants/news';

import { fetchWeatherData } from '../services/weatherService';

import { fetchRecentEarthquakes } from '../services/seismicService';



// CONFIGURACIÓN: Reemplaza TU_USUARIO y TU_REPOSITORIO con tus datos reales de GitHub

const GITHUB_USERNAME = 'shockomil';

const GITHUB_REPO = 'appmonitoreo';

const GITHUB_BRANCH = 'main';



export const useTelemetry = () => {

  const [estadoSeleccionado, setEstadoSeleccionadoState] = useState('Sinaloa');

  const [listaMunicipios, setListaMunicipios] = useState(() => getMunicipiosPorEstado('Sinaloa'));

  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(() => listaMunicipios[0]);



  // Clima

  const [climaActual, setClimaActual] = useState(null);

  const [pronostico12h, setPronostico12h] = useState([]);

  const [loadingClima, setLoadingClima] = useState(false);

  const [errorClima, setErrorClima] = useState(null);



  // Presas

  const [presasEstado, setPresasEstado] = useState(() => getPresasPorEstado('Sinaloa'));

  const [loadingPresas, setLoadingPresas] = useState(false);

  const [ultimaActualizacionPresas, setUltimaActualizacionPresas] = useState(

    () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  );



  // Sismos

  const [listaSismos, setListaSismos] = useState([]);

  const [loadingSismos, setLoadingSismos] = useState(false);

  const [ultimaActualizacionSismos, setUltimaActualizacionSismos] = useState(

    () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

  );



  // Noticias

  const [noticiasList, setNoticiasList] = useState(BANCO_NOTICIAS);



  // Pull to refresh

  const [refreshing, setRefreshing] = useState(false);



  // Controladores de cancelación (AbortController)

  const weatherAbortControllerRef = useRef(null);

  const seismicAbortControllerRef = useRef(null);

  const damsAbortControllerRef = useRef(null);



  // Referencia para rastrear el estado de la app (active / background)

  const appState = useRef(AppState.currentState);



  // 1. Obtención de Clima

  const cargarClima = useCallback(async (lat, lon) => {

    if (weatherAbortControllerRef.current) {

      weatherAbortControllerRef.current.abort();

    }

    const controller = new AbortController();

    weatherAbortControllerRef.current = controller;



    setLoadingClima(true);

    setErrorClima(null);



    try {

      const { climaActual, pronostico12h } = await fetchWeatherData(lat, lon, controller.signal);

      setClimaActual(climaActual);

      setPronostico12h(pronostico12h);

    } catch (err) {

      if (err.name !== 'AbortError') {

        console.error('Error al consultar clima:', err);

        setErrorClima('Error de conexión a la API meteorológica.');

      }

    } finally {

      setLoadingClima(false);

    }

  }, []);



  // 2. Obtención de Sismos

  const cargarSismos = useCallback(async () => {

    if (seismicAbortControllerRef.current) {

      seismicAbortControllerRef.current.abort();

    }

    const controller = new AbortController();

    seismicAbortControllerRef.current = controller;



    setLoadingSismos(true);

    try {

      const sismos = await fetchRecentEarthquakes(4, controller.signal);

      if (sismos.length > 0) {

        setListaSismos(sismos);

        setUltimaActualizacionSismos(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

      }

    } catch (err) {

      if (err.name !== 'AbortError') {

        console.error('Error al consultar sismos:', err);

      }

    } finally {

      setLoadingSismos(false);

    }

  }, []);



  // 3. Consulta de datos reales extraídos del boletín diario (PASO 3 APLICADO)

  // 3. Consulta de datos reales extraídos automáticamente de CONAGUA
  const cargarPresas = useCallback(async (estado) => {
    if (damsAbortControllerRef.current) {
      damsAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    damsAbortControllerRef.current = controller;

    setLoadingPresas(true);

    try {
      // Petición directa que purga la caché de React Native y CDN
      const timestamp = Date.now();
      const jsonUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${GITHUB_REPO}@${GITHUB_BRANCH}/presas_sinaloa.json?t=${timestamp}`;

      const response = await fetch(jsonUrl, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const listaPresas = Array.isArray(data) ? data : (data && data.presas ? data.presas : []);

        if (listaPresas.length > 0) {
          setPresasEstado(listaPresas);

          if (data.ultimaActualizacion) {
            setUltimaActualizacionPresas(
              new Date(data.ultimaActualizacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );
          } else {
            setUltimaActualizacionPresas(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
          return;
        }
      }

      throw new Error('Respuesta remota vacía');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Error obteniendo datos remotos:', err);
      }
    } finally {
      setLoadingPresas(false);
    }
  }, []);



  // 4. Noticias

  const agregarBoletinNoticias = useCallback((estado) => {

    const horaActualStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setNoticiasList(prev => [

      {

        id: `n-new-${Date.now()}`,

        titulo: `Actualización meteorológica e hidrológica para ${estado} (${horaActualStr})`,

        fuente: 'MX-Telemetry Network',

        tiempo: 'Hace un momento',

        categoria: 'Operativo',

        url: 'https://open-meteo.com/'

      },

      ...prev.slice(0, 3)

    ]);

  }, []);



  // 5. Función global de recarga total

  const refrescarTodo = useCallback(() => {

    cargarPresas(estadoSeleccionado);

    cargarSismos();

    if (municipioSeleccionado?.lat && municipioSeleccionado?.lon) {

      cargarClima(municipioSeleccionado.lat, municipioSeleccionado.lon);

    }

  }, [estadoSeleccionado, municipioSeleccionado, cargarPresas, cargarSismos, cargarClima]);



  // Listener para actualizar automáticamente al abrir o reanudar la App

  useEffect(() => {

    const subscription = AppState.addEventListener('change', nextAppState => {

      if (

        appState.current.match(/inactive|background/) &&

        nextAppState === 'active'

      ) {

        refrescarTodo();

      }

      appState.current = nextAppState;

    });



    return () => {

      subscription.remove();

    };

  }, [refrescarTodo]);



  // Carga inicial al iniciar la aplicación

  useEffect(() => {

    cargarPresas(estadoSeleccionado);

    cargarSismos();

  }, []);



  // Cambio de estado

  const handleSelectEstado = useCallback((nuevoEstado) => {

    setEstadoSeleccionadoState(nuevoEstado);

    const nuevosMunicipios = getMunicipiosPorEstado(nuevoEstado);

    setListaMunicipios(nuevosMunicipios);

    setMunicipioSeleccionado(nuevosMunicipios[0]);

    cargarPresas(nuevoEstado);

  }, [cargarPresas]);



  // Cambio de municipio

  useEffect(() => {

    if (municipioSeleccionado?.lat && municipioSeleccionado?.lon) {

      cargarClima(municipioSeleccionado.lat, municipioSeleccionado.lon);

    }

  }, [municipioSeleccionado, cargarClima]);



  // Accion Pull-to-refresh

  const onRefresh = useCallback(async () => {

    setRefreshing(true);

    agregarBoletinNoticias(estadoSeleccionado);

    await refrescarTodo();

    setRefreshing(false);

  }, [estadoSeleccionado, agregarBoletinNoticias, refrescarTodo]);



  // Limpieza al desmontar

  useEffect(() => {

    return () => {

      if (weatherAbortControllerRef.current) weatherAbortControllerRef.current.abort();

      if (seismicAbortControllerRef.current) seismicAbortControllerRef.current.abort();

      if (damsAbortControllerRef.current) damsAbortControllerRef.current.abort();

    };

  }, []);



  return {

    estadoSeleccionado,

    listaMunicipios,

    municipioSeleccionado,

    climaActual,

    pronostico12h,

    loadingClima,

    errorClima,

    presasEstado,

    loadingPresas,

    ultimaActualizacionPresas,

    listaSismos,

    loadingSismos,

    ultimaActualizacionSismos,

    noticiasList,

    refreshing,

    onRefresh,

    handleSelectEstado,

    setMunicipioSeleccionado

  };

};

