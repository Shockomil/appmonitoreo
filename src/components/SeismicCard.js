import React, { memo } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const SeismicCard = memo(({ listaSismos, loading, ultimaActualizacion, onRecargar }) => {
  return (
    <View style={styles.telemetryCard}>
      {/* CABECERA */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="pulse" size={18} color="#ef4444" />
          <Text style={styles.telemetryTitle}>Actividad Sísmica Reciente</Text>
        </View>
        <View style={styles.badgeLive}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>EN VIVO • CADA 30 MIN</Text>
        </View>
      </View>

      <Text style={styles.telemetrySubtitle}>
        Monitoreo satelital y telúrico en México • Sincronización continua
      </Text>

      {/* BARRA DE ESTADO DE SINCRONIZACIÓN */}
      <View style={styles.syncBar}>
        <View style={styles.syncLeft}>
          <Ionicons name="time-outline" size={13} color={COLORS.textDim} />
          <Text style={styles.syncText}>
            Última lectura: <Text style={styles.syncTime}>{ultimaActualizacion || 'En proceso...'}</Text>
          </Text>
        </View>
        {onRecargar && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRecargar}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons 
              name="refresh-outline" 
              size={13} 
              color={COLORS.accent} 
              style={loading ? styles.refreshSpinner : null} 
            />
            <Text style={styles.refreshText}>{loading ? 'Consultando...' : 'Actualizar'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LISTADO DE EVENTOS SÍSMICOS */}
      <View style={styles.contentContainer}>
        {loading && listaSismos.length === 0 ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingText}>Rastreando eventos telúricos recientes...</Text>
          </View>
        ) : listaSismos && listaSismos.length > 0 ? (
          listaSismos.map((sismo, index) => {
            const colorMag = sismo.colorMagnitud || '#ef4444';
            const bgMag = sismo.bgMagnitud || 'rgba(239, 68, 68, 0.18)';
            const borderMag = sismo.borderMagnitud || 'rgba(239, 68, 68, 0.4)';

            return (
              <View 
                key={sismo.id || index} 
                style={[
                  styles.sismoContainer, 
                  index < listaSismos.length - 1 && styles.sismoSeparator
                ]}
              >
                {/* CAJA DE MAGNITUD CON COLOR DINÁMICO */}
                <View style={[styles.sismoMagBox, { backgroundColor: bgMag, borderColor: borderMag }]}>
                  <Text style={[styles.sismoMagLabel, { color: colorMag }]}>MAGNITUD</Text>
                  <Text style={[styles.sismoMagValue, { color: colorMag }]}>{sismo.magnitud}</Text>
                  <View style={[styles.severidadPill, { backgroundColor: colorMag + '25' }]}>
                    <Text style={[styles.severidadText, { color: colorMag }]}>
                      {sismo.severidad || 'LEVE'}
                    </Text>
                  </View>
                </View>

                {/* DETALLES DEL EVENTO */}
                <View style={styles.sismoDetails}>
                  {/* UBICACIÓN */}
                  <View style={styles.detailRow}>
                    <Ionicons 
                      name="location-sharp" 
                      size={14} 
                      color={COLORS.accent} 
                      style={styles.detailIcon} 
                    />
                    <Text style={styles.sismoUbicacion} numberOfLines={2}>
                      {sismo.ubicacion}
                    </Text>
                  </View>

                  {/* FECHA Y HORA EXACTAS (PRECISIÓN TEMPORAL) */}
                  <View style={styles.dateBadgeRow}>
                    <View style={styles.dateGroup}>
                      <Ionicons name="calendar-outline" size={12} color="#94a3b8" style={styles.detailIcon} />
                      <Text style={styles.sismoFechaText}>
                        {sismo.fecha} • {sismo.hora}
                      </Text>
                    </View>
                    {sismo.tiempoRelativo ? (
                      <View style={styles.timeAgoPill}>
                        <Text style={styles.timeAgoText}>{sismo.tiempoRelativo}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* PROFUNDIDAD Y ESPECIFICACIÓN */}
                  <View style={styles.detailRowSecondary}>
                    <Ionicons 
                      name="git-commit-outline" 
                      size={13} 
                      color={COLORS.warning} 
                      style={styles.detailIcon} 
                    />
                    <Text style={styles.sismoDetalle}>
                      Profundidad: <Text style={styles.boldText}>{sismo.profundidad}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
            <Text style={styles.emptyText}>Sin eventos telúricos significativos en territorio mexicano en las últimas horas.</Text>
          </View>
        )}
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  telemetryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 5,
  },
  badgeText: {
    fontSize: 9,
    color: '#fca5a5',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetrySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    marginBottom: 10,
  },
  syncBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 10,
    color: COLORS.textDim,
    marginLeft: 5,
  },
  syncTime: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  refreshText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
    marginLeft: 4,
  },
  refreshSpinner: {
    transform: [{ rotate: '45deg' }],
  },
  contentContainer: {
    marginTop: 2,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  sismoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121a2d',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorderSecondary,
  },
  sismoSeparator: {
    marginBottom: 10,
  },
  sismoMagBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    borderWidth: 1,
  },
  sismoMagLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sismoMagValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 1,
  },
  severidadPill: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginTop: 2,
  },
  severidadText: {
    fontSize: 8,
    fontWeight: '800',
  },
  sismoDetails: {
    flex: 1,
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailRowSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailIcon: {
    marginRight: 4,
  },
  sismoUbicacion: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  dateBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginVertical: 3,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sismoFechaText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },
  timeAgoPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  timeAgoText: {
    fontSize: 9,
    color: COLORS.accent,
    fontWeight: '700',
  },
  sismoDetalle: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  boldText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});
