import React, { memo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getWeatherInfo, getRainRiskInfo } from '../utils/weatherUtils';

export const HourlyForecastCard = memo(({ pronostico12h, loading, onSelectHora }) => {
  return (
    <View style={styles.telemetryCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="time-outline" size={18} color={COLORS.accent} />
          <Text style={styles.telemetryTitle}>Pronóstico Próximas 12 Horas</Text>
        </View>
        <Text style={styles.headerBadge}>Desliza horizontal ➔</Text>
      </View>
      
      <Text style={styles.telemetrySubtitle}>
        Monitoreo dinámico hora por hora con iconos de condición y riesgo de lluvia
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.accent} />
          <Text style={styles.loadingText}>Calculando proyección horaria...</Text>
        </View>
      ) : pronostico12h && pronostico12h.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
          style={styles.horizontalScroll}
        >
          {pronostico12h.map((item, index) => {
            const weather = getWeatherInfo(item.weather_code, item.is_day);
            const rainRisk = getRainRiskInfo(item.precipitacion);
            const isNow = index === 0 || item.isNow;

            return (
              <TouchableOpacity 
                key={item.hora || index} 
                style={[
                  styles.hourlyCard,
                  isNow && styles.hourlyCardNow,
                  item.precipitacion >= 40 && styles.hourlyCardRainAlert
                ]}
                onPress={() => onSelectHora({ ...item, weatherInfo: weather, rainRiskInfo: rainRisk })}
                activeOpacity={0.7}
              >
                {/* ETIQUETA DE HORA O 'AHORA' */}
                <View style={[styles.timePill, isNow && styles.timePillNow]}>
                  <Text style={[styles.hourlyTime, isNow && styles.hourlyTimeNow]}>
                    {isNow ? 'AHORA' : item.hora}
                  </Text>
                </View>

                {/* ICONO DEL CLIMA DINÁMICO */}
                <View style={[styles.iconContainer, { backgroundColor: weather.bg }]}>
                  <Ionicons 
                    name={weather.icon} 
                    size={28} 
                    color={weather.color} 
                  />
                </View>

                {/* ESTADO BREVE EN TEXTO */}
                <Text style={styles.weatherStateText} numberOfLines={1}>
                  {weather.label}
                </Text>

                {/* TEMPERATURA */}
                <Text style={styles.hourlyTemp}>{Math.round(item.temp)}°C</Text>
                
                {/* PROBABILIDAD DE LLUVIA */}
                <View style={[styles.rainBadge, { backgroundColor: rainRisk.badgeBg }]}>
                  <Ionicons name={rainRisk.icon} size={11} color={rainRisk.color} />
                  <Text style={[styles.rainText, { color: rainRisk.color }]}>
                    {item.precipitacion}%
                  </Text>
                </View>

                {/* DETALLES SECUNDARIOS (HUMEDAD Y VIENTO) */}
                <View style={styles.secondaryDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="water-outline" size={11} color={COLORS.accent} />
                    <Text style={styles.detailValue}>{item.humedad}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="compass-outline" size={11} color={COLORS.warning} />
                    <Text style={styles.detailValue}>{Math.round(item.viento)} km/h</Text>
                  </View>
                </View>

                {/* INDICADOR PARA ABRIR */}
                <View style={styles.cardFooter}>
                  <Text style={styles.moreDetailsText}>Ver más</Text>
                  <Ionicons name="chevron-forward" size={10} color={COLORS.accent} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>No hay pronóstico horario disponible.</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  telemetryCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  headerBadge: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
  },
  telemetrySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  horizontalScroll: {
    marginTop: 2,
    marginHorizontal: -4,
  },
  scrollContainer: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  hourlyCard: {
    backgroundColor: '#121a2d',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    width: 108,
    borderWidth: 1,
    borderColor: COLORS.cardBorderSecondary,
  },
  hourlyCardNow: {
    borderColor: COLORS.accent,
    backgroundColor: '#10223f',
  },
  hourlyCardRainAlert: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  timePill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
  },
  timePillNow: {
    backgroundColor: COLORS.accent,
  },
  hourlyTime: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  hourlyTimeNow: {
    color: '#08101e',
    fontWeight: '800',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  weatherStateText: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
    height: 14,
  },
  hourlyTemp: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  rainText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },
  secondaryDetails: {
    width: '100%',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailValue: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '500',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  moreDetailsText: {
    fontSize: 9,
    color: COLORS.accent,
    fontWeight: '600',
    marginRight: 2,
  },
  noDataText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 14,
  },
});
