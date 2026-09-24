import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { 
  getWeatherInfo, 
  getWindDescriptor, 
  getHumidityDescriptor,
  getRainRiskInfo 
} from '../utils/weatherUtils';

export const WeatherCard = memo(({ 
  climaActual, 
  municipioNombre, 
  loading, 
  errorMsg, 
  detalleActivo, 
  onToggleDetalle 
}) => {
  const weatherInfo = climaActual 
    ? getWeatherInfo(climaActual.weather_code, climaActual.is_day)
    : null;

  const windInfo = climaActual 
    ? getWindDescriptor(climaActual.wind_speed_10m)
    : null;

  const humidityInfo = climaActual 
    ? getHumidityDescriptor(climaActual.relative_humidity_2m)
    : null;

  const rainInfo = climaActual
    ? getRainRiskInfo((climaActual.precipitation > 0 ? 80 : 0))
    : null;

  return (
    <View style={styles.telemetryCard}>
      {/* CABECERA DE LA TARJETA */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color={COLORS.accent} />
          <Text style={styles.telemetryTitle} numberOfLines={1}>
            {municipioNombre || 'Condición Actual'}
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>EN VIVO</Text>
        </View>
      </View>
      
      <Text style={styles.telemetrySubtitle}>
        Telemetría satelital numérica ECMWF • Tiempo real
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.accent} />
          <Text style={styles.loadingText}>Sincronizando sensores atmosféricos...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : climaActual && weatherInfo ? (
        <View style={styles.contentContainer}>
          
          {/* BANNER PRINCIPAL DEL ESTADO DEL CLIMA (HERO DISPLAY) */}
          <View style={[styles.heroCard, { borderColor: weatherInfo.color + '40' }]}>
            <View style={styles.heroLeft}>
              <View style={[styles.iconHalo, { backgroundColor: weatherInfo.bg }]}>
                <Ionicons 
                  name={weatherInfo.icon} 
                  size={46} 
                  color={weatherInfo.color} 
                />
              </View>
              
              <View style={styles.conditionTextBlock}>
                <View style={[styles.conditionPill, { backgroundColor: weatherInfo.bg, borderColor: weatherInfo.color + '55' }]}>
                  <Text style={[styles.conditionPillText, { color: weatherInfo.color }]}>
                    {weatherInfo.label}
                  </Text>
                </View>
                <Text style={styles.conditionTipText} numberOfLines={2}>
                  {weatherInfo.tip}
                </Text>
              </View>
            </View>

            <View style={styles.heroRight}>
              <View style={styles.tempRow}>
                <Text style={styles.mainTemperature}>
                  {Math.round(climaActual.temperature_2m ?? 0)}
                </Text>
                <Text style={styles.tempUnit}>°C</Text>
              </View>
              <View style={styles.apparentTempPill}>
                <Text style={styles.apparentTempLabel}>Sensación</Text>
                <Text style={styles.apparentTempVal}>
                  {climaActual.apparent_temperature ?? '--'}°C
                </Text>
              </View>
            </View>
          </View>

          {/* INDICACIÓN INTERACTIVA */}
          <View style={styles.interactiveBar}>
            <Text style={styles.sectionLabel}>MÉTRICAS CLAVE EN SUPERFICIE</Text>
            <Text style={styles.actionHint}>Toca para evaluar detalles ℹ️</Text>
          </View>

          {/* CUADRÍCULA DE MÉTRICAS */}
          <View style={styles.metricsGrid}>
            
            {/* 1. SENSACIÓN TÉRMICA */}
            <TouchableOpacity 
              style={[
                styles.metricCard,
                detalleActivo === 'temp' && styles.metricCardActive
              ]}
              onPress={() => onToggleDetalle('temp')}
              activeOpacity={0.7}
            >
              <View style={styles.metricCardHeader}>
                <Ionicons name="thermometer" size={18} color="#ff6b6b" />
                <Text style={styles.metricCardTag}>Térmica</Text>
              </View>
              <Text style={styles.metricCardValue}>
                {climaActual.apparent_temperature ?? '--'} °C
              </Text>
              <Text style={styles.metricCardSub} numberOfLines={1}>
                {climaActual.apparent_temperature > climaActual.temperature_2m 
                  ? `+${(climaActual.apparent_temperature - climaActual.temperature_2m).toFixed(1)}° bochorno`
                  : 'Sensación nivelada'}
              </Text>
            </TouchableOpacity>

            {/* 2. HUMEDAD RELATIVA */}
            <TouchableOpacity 
              style={[
                styles.metricCard,
                detalleActivo === 'humedad' && styles.metricCardActive
              ]}
              onPress={() => onToggleDetalle('humedad')}
              activeOpacity={0.7}
            >
              <View style={styles.metricCardHeader}>
                <Ionicons name="water" size={18} color={COLORS.accent} />
                <Text style={styles.metricCardTag}>Humedad</Text>
              </View>
              <Text style={styles.metricCardValue}>
                {climaActual.relative_humidity_2m ?? '--'} %
              </Text>
              <Text style={[styles.metricCardSub, { color: humidityInfo?.color || COLORS.textMuted }]} numberOfLines={1}>
                {humidityInfo?.texto || 'Normal'}
              </Text>
            </TouchableOpacity>

            {/* 3. VELOCIDAD DEL VIENTO */}
            <TouchableOpacity 
              style={[
                styles.metricCard,
                detalleActivo === 'viento' && styles.metricCardActive
              ]}
              onPress={() => onToggleDetalle('viento')}
              activeOpacity={0.7}
            >
              <View style={styles.metricCardHeader}>
                <Ionicons name="compass-outline" size={18} color={COLORS.warning} />
                <Text style={styles.metricCardTag}>Viento</Text>
              </View>
              <Text style={styles.metricCardValue}>
                {climaActual.wind_speed_10m ?? '--'} km/h
              </Text>
              <Text style={[styles.metricCardSub, { color: windInfo?.color || COLORS.textMuted }]} numberOfLines={1}>
                {windInfo?.texto || 'Calma'}
              </Text>
            </TouchableOpacity>

            {/* 4. PRESIÓN BAROMÉTRICA */}
            <TouchableOpacity 
              style={[
                styles.metricCard,
                detalleActivo === 'presion' && styles.metricCardActive
              ]}
              onPress={() => onToggleDetalle('presion')}
              activeOpacity={0.7}
            >
              <View style={styles.metricCardHeader}>
                <Ionicons name="speedometer-outline" size={18} color="#34d399" />
                <Text style={styles.metricCardTag}>Presión</Text>
              </View>
              <Text style={styles.metricCardValue}>
                {climaActual.surface_pressure ?? '--'} hPa
              </Text>
              <Text style={styles.metricCardSub} numberOfLines={1}>
                {climaActual.surface_pressure > 1013 ? 'Estable / Alta' : 'Baja presión'}
              </Text>
            </TouchableOpacity>

          </View>

          {/* DESGLOSE EXPANDIDO DINÁMICO */}
          {detalleActivo === 'temp' && (
            <View style={styles.detalleExpandidoBox}>
              <View style={styles.detalleTitleRow}>
                <Ionicons name="thermometer" size={16} color="#ff6b6b" />
                <Text style={styles.detalleHeaderTitle}>Análisis de Comportamiento Térmico</Text>
              </View>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Temperatura Real:</Text> {climaActual.temperature_2m}°C vs <Text style={styles.boldText}>Sensación:</Text> {climaActual.apparent_temperature}°C.
              </Text>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Impacto Operativo:</Text> {climaActual.apparent_temperature >= 35 
                  ? 'Exposición solar intensa. Requiere hidratación activa y pausas bajo sombra.'
                  : 'Condiciones óptimas sin estrés térmico severo.'}
              </Text>
            </View>
          )}

          {detalleActivo === 'humedad' && (
            <View style={styles.detalleExpandidoBox}>
              <View style={styles.detalleTitleRow}>
                <Ionicons name="water" size={16} color={COLORS.accent} />
                <Text style={styles.detalleHeaderTitle}>Saturación y Humedad Ambiental</Text>
              </View>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Nivel Registrado:</Text> {climaActual.relative_humidity_2m}% ({humidityInfo?.texto}).
              </Text>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Condensación:</Text> {climaActual.relative_humidity_2m > 75 
                  ? 'Riesgo alto de empañamiento o condensación en lentes, paneles y equipo sensible.' 
                  : 'Baja probabilidad de rocío o corrosión inmediata por humedad.'}
              </Text>
            </View>
          )}

          {detalleActivo === 'viento' && (
            <View style={styles.detalleExpandidoBox}>
              <View style={styles.detalleTitleRow}>
                <Ionicons name="flag" size={16} color={COLORS.warning} />
                <Text style={styles.detalleHeaderTitle}>Dinámica Eólica a 10 Metros</Text>
              </View>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Velocidad:</Text> {climaActual.wind_speed_10m} km/h ({windInfo?.texto}).
              </Text>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Operatividad de Drones/Grúas:</Text> {climaActual.wind_speed_10m > 30 
                  ? 'Viento moderado-alto. Precaución con sobrevuelos o maniobras en altura.'
                  : 'Condiciones seguras para vuelos técnicos y maniobras en altura.'}
              </Text>
            </View>
          )}

          {detalleActivo === 'presion' && (
            <View style={styles.detalleExpandidoBox}>
              <View style={styles.detalleTitleRow}>
                <Ionicons name="speedometer" size={16} color="#34d399" />
                <Text style={styles.detalleHeaderTitle}>Presión Barométrica Superficial</Text>
              </View>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Presión Atmosférica:</Text> {climaActual.surface_pressure} hPa.
              </Text>
              <Text style={styles.detalleTextoExpandido}>
                • <Text style={styles.boldText}>Estabilidad:</Text> {climaActual.surface_pressure < 1010
                  ? 'Presión barométrica baja: Mayor propensión a nubosidad convectiva o precipitaciones.'
                  : 'Presión barométrica alta y estable: Predominio de tiempo seco y calmo.'}
              </Text>
            </View>
          )}

        </View>
      ) : null}
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
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  telemetryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 5,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  telemetrySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  contentContainer: {
    marginTop: 2,
  },
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0c1322',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconHalo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conditionTextBlock: {
    flex: 1,
  },
  conditionPill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 4,
  },
  conditionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  conditionTipText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  heroRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainTemperature: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
  },
  tempUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginTop: 2,
    marginLeft: 2,
  },
  apparentTempPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgSecondary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorderSecondary,
  },
  apparentTempLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    marginRight: 4,
  },
  apparentTempVal: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
  },
  interactiveBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSection,
    letterSpacing: 0.5,
  },
  actionHint: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: '#131b2e',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentDark,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricCardTag: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  metricCardValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 2,
  },
  metricCardSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  detalleExpandidoBox: {
    backgroundColor: '#0c1427',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3.5,
    borderLeftColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  detalleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detalleHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  detalleTextoExpandido: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 4,
  },
  boldText: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
