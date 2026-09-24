import React, { memo } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { 
  getWeatherInfo, 
  getRainRiskInfo, 
  getWindDescriptor, 
  getHumidityDescriptor 
} from '../utils/weatherUtils';

export const HourlyDetailModal = memo(({ horaSeleccionada, onClose }) => {
  if (!horaSeleccionada) return null;

  const weather = horaSeleccionada.weatherInfo || 
    getWeatherInfo(horaSeleccionada.weather_code, horaSeleccionada.is_day);

  const rainRisk = horaSeleccionada.rainRiskInfo || 
    getRainRiskInfo(horaSeleccionada.precipitacion);

  const wind = getWindDescriptor(horaSeleccionada.viento);
  const humidity = getHumidityDescriptor(horaSeleccionada.humedad);

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          
          {/* HEADER DEL MODAL */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="time" size={18} color={COLORS.accent} />
              <Text style={styles.modalTitle}>
                Pronóstico para las {horaSeleccionada.hora}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* BANNER VISUAL RESUMEN */}
          <View style={[styles.heroSummary, { borderColor: weather.color + '40' }]}>
            <View style={[styles.iconHalo, { backgroundColor: weather.bg }]}>
              <Ionicons name={weather.icon} size={40} color={weather.color} />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={[styles.conditionTitle, { color: weather.color }]}>
                {weather.label}
              </Text>
              <Text style={styles.summaryTemp}>
                {horaSeleccionada.temp} °C
              </Text>
              <Text style={styles.summaryTip} numberOfLines={2}>
                {weather.tip}
              </Text>
            </View>
          </View>
          
          {/* GRILLA DE VARIABLES METEOROLÓGICAS */}
          <View style={styles.metricsGrid}>
            
            {/* LLUVIA */}
            <View style={styles.metricTile}>
              <View style={styles.metricHeader}>
                <Ionicons name={rainRisk.icon} size={16} color={rainRisk.color} />
                <Text style={styles.metricLabel}>Probabilidad Lluvia</Text>
              </View>
              <Text style={[styles.metricValue, { color: rainRisk.color }]}>
                {horaSeleccionada.precipitacion} %
              </Text>
              <Text style={styles.metricSub}>Riesgo {rainRisk.nivel}</Text>
            </View>

            {/* NUBES */}
            <View style={styles.metricTile}>
              <View style={styles.metricHeader}>
                <Ionicons name="cloud-outline" size={16} color="#94a3b8" />
                <Text style={styles.metricLabel}>Cobertura Nubosa</Text>
              </View>
              <Text style={styles.metricValue}>
                {horaSeleccionada.nubes} %
              </Text>
              <Text style={styles.metricSub}>
                {horaSeleccionada.nubes > 60 ? 'Cielo cubierto' : horaSeleccionada.nubes > 20 ? 'Parcial' : 'Despejado'}
              </Text>
            </View>

            {/* VIENTO */}
            <View style={styles.metricTile}>
              <View style={styles.metricHeader}>
                <Ionicons name={wind.icono} size={16} color={wind.color} />
                <Text style={styles.metricLabel}>Velocidad Viento</Text>
              </View>
              <Text style={styles.metricValue}>
                {horaSeleccionada.viento} km/h
              </Text>
              <Text style={[styles.metricSub, { color: wind.color }]}>
                {wind.texto}
              </Text>
            </View>

            {/* HUMEDAD */}
            <View style={styles.metricTile}>
              <View style={styles.metricHeader}>
                <Ionicons name="water-outline" size={16} color={COLORS.accent} />
                <Text style={styles.metricLabel}>Humedad Relativa</Text>
              </View>
              <Text style={styles.metricValue}>
                {horaSeleccionada.humedad} %
              </Text>
              <Text style={[styles.metricSub, { color: humidity.color }]}>
                {humidity.texto}
              </Text>
            </View>

          </View>

          {/* RECOMENDACIÓN OPERATIVA */}
          <View style={styles.adviceBox}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
            <Text style={styles.adviceText}>
              {horaSeleccionada.precipitacion >= 50
                ? 'Alta probabilidad de precipitación en este horario. Se sugiere resguardo preventivo de equipos y vehículos.'
                : horaSeleccionada.viento > 30
                ? 'Ráfagas de viento detectadas. Mantener precaución en maniobras elevadas o trabajo con grúas.'
                : 'Condiciones meteorológicas favorables para actividades al aire libre y operaciones logísticas.'}
            </Text>
          </View>

          {/* BOTÓN CERRAR */}
          <TouchableOpacity 
            style={styles.btnCerrarModal}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCerrarText}>Aceptar y Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
  },
  heroSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1322',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconHalo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryTextGroup: {
    flex: 1,
  },
  conditionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryTemp: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryTip: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  metricTile: {
    width: '48.5%',
    backgroundColor: '#131b2e',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 5,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricSub: {
    fontSize: 9,
    color: COLORS.textDim,
    marginTop: 2,
  },
  adviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 14,
  },
  adviceText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginLeft: 8,
  },
  btnCerrarModal: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCerrarText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 13,
  },
});
