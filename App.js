import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Linking, 
  RefreshControl,
  StatusBar
} from 'react-native';

import { COLORS } from './src/constants/theme';
import { TODOS_LOS_ESTADOS } from './src/constants/locations';
import { useTelemetry } from './src/hooks/useTelemetry';

// Componentes modulares optimizados
import { Header } from './src/components/Header';
import { StateSelector } from './src/components/StateSelector';
import { MunicipalitySelector } from './src/components/MunicipalitySelector';
import { WeatherCard } from './src/components/WeatherCard';
import { HourlyForecastCard } from './src/components/HourlyForecastCard';
import { DamsCard } from './src/components/DamsCard';
import { SeismicCard } from './src/components/SeismicCard';
import { NewsCard } from './src/components/NewsCard';
import { SelectionModal } from './src/components/SelectionModal';
import { HourlyDetailModal } from './src/components/HourlyDetailModal';

export default function App() {
  const {
    estadoSeleccionado,
    listaMunicipios,
    municipioSeleccionado,
    climaActual,
    pronostico12h,
    loadingClima,
    errorClima,
    presasEstado,
    ultimaActualizacionPresas,
    listaSismos,
    loadingSismos,
    ultimaActualizacionSismos,
    cargarSismos,
    noticiasList,
    refreshing,
    onRefresh,
    handleSelectEstado,
    setMunicipioSeleccionado
  } = useTelemetry();

  // Estados locales para interacción de UI y modales
  const [modalEstadosVisible, setModalEstadosVisible] = useState(false);
  const [modalMunicipiosVisible, setModalMunicipiosVisible] = useState(false);
  const [detalleClimaActivo, setDetalleClimaActivo] = useState(null);
  const [horaSeleccionadaDetalle, setHoraSeleccionadaDetalle] = useState(null);

  // Manejadores interactivos con useCallback para evitar re-creación de funciones
  const handleToggleDetalleClima = useCallback((tipo) => {
    setDetalleClimaActivo(prev => (prev === tipo ? null : tipo));
  }, []);

  const handleOpenLink = useCallback(async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('No se pudo abrir el enlace:', err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        {/* ENCABEZADO */}
        <Header estado={estadoSeleccionado} />

        {/* SELECTOR DE ESTADOS */}
        <StateSelector 
          estadoSeleccionado={estadoSeleccionado}
          onSelectEstado={handleSelectEstado}
          onOpenModal={() => setModalEstadosVisible(true)}
        />

        {/* SELECTOR DE MUNICIPIOS */}
        <MunicipalitySelector 
          estadoSeleccionado={estadoSeleccionado}
          listaMunicipios={listaMunicipios}
          municipioSeleccionado={municipioSeleccionado}
          onSelectMunicipio={setMunicipioSeleccionado}
          onOpenModal={() => setModalMunicipiosVisible(true)}
        />

        {/* CONDICIÓN CLIMÁTICA ACTUAL */}
        <WeatherCard 
          climaActual={climaActual}
          municipioNombre={municipioSeleccionado?.nombre}
          loading={loadingClima}
          errorMsg={errorClima}
          detalleActivo={detalleClimaActivo}
          onToggleDetalle={handleToggleDetalleClima}
        />

        {/* PRONÓSTICO 12 HORAS */}
        <HourlyForecastCard 
          pronostico12h={pronostico12h}
          loading={loadingClima}
          onSelectHora={setHoraSeleccionadaDetalle}
        />

        {/* MONITOREO DE PRESAS */}
        <DamsCard 
          presasEstado={presasEstado}
          estadoSeleccionado={estadoSeleccionado}
          ultimaActualizacion={ultimaActualizacionPresas}
        />

        {/* ACTIVIDAD SÍSMICA EN VIVO */}
        <SeismicCard 
          listaSismos={listaSismos}
          loading={loadingSismos}
          ultimaActualizacion={ultimaActualizacionSismos}
          onRecargar={cargarSismos}
        />

        {/* NOTICIAS Y ALERTAS AMBIENTALES */}
        <NewsCard 
          noticiasList={noticiasList}
          estadoSeleccionado={estadoSeleccionado}
          onOpenLink={handleOpenLink}
        />
      </ScrollView>

      {/* MODAL DETALLE DE HORA */}
      <HourlyDetailModal 
        horaSeleccionada={horaSeleccionadaDetalle}
        onClose={() => setHoraSeleccionadaDetalle(null)}
      />

      {/* MODAL SELECCIONAR ESTADO */}
      <SelectionModal
        visible={modalEstadosVisible}
        title="Seleccionar Estado (Nacional)"
        placeholder="Buscar estado..."
        data={TODOS_LOS_ESTADOS}
        selectedIdOrName={estadoSeleccionado}
        onSelect={handleSelectEstado}
        onClose={() => setModalEstadosVisible(false)}
      />

      {/* MODAL SELECCIONAR MUNICIPIO */}
      <SelectionModal
        visible={modalMunicipiosVisible}
        title={`Municipios (${estadoSeleccionado})`}
        placeholder="Buscar municipio..."
        data={listaMunicipios}
        selectedIdOrName={municipioSeleccionado?.id}
        getId={(item) => item.id}
        getName={(item) => item.nombre}
        onSelect={setMunicipioSeleccionado}
        onClose={() => setModalMunicipiosVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
  },
});