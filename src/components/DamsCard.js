import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const DamsCard = memo(({ presasEstado, estadoSeleccionado, ultimaActualizacion }) => {
  return (
    <View style={styles.telemetryCard}>
      <View style={styles.headerRow}>
        <Text style={styles.telemetryTitle}>Nivel de Presas ({estadoSeleccionado})</Text>
        <Text style={styles.actionHint}>Actualizado: {ultimaActualizacion}</Text>
      </View>
      <Text style={styles.telemetrySubtitle}>
        Monitoreo CONAGUA sincronizado (Ciclo de 2 horas)
      </Text>

      <View style={styles.listContainer}>
        {presasEstado.map((presa) => {
          const isUp = presa.tendencia === 'up';
          const isDown = presa.tendencia === 'down';
          const trendColor = isUp ? COLORS.success : isDown ? COLORS.danger : COLORS.warning;
          const trendIcon = isUp ? 'trending-up' : isDown ? 'trending-down' : 'remove';
          const fillColor = presa.almacenamiento < 30 
            ? COLORS.danger 
            : presa.almacenamiento < 60 
            ? COLORS.warning 
            : COLORS.success;

          return (
            <View key={presa.id} style={styles.presaRow}>
              <View style={styles.presaInfo}>
                <Text style={styles.presaNombre} numberOfLines={1}>{presa.nombre}</Text>
                <Text style={styles.presaCapacidad}>
                  Cap: {presa.capacidadMm3} Mm³ • Ext: {presa.extraccion}
                </Text>
              </View>

              <View style={styles.presaMetrics}>
                <View style={styles.trendRow}>
                  <Ionicons 
                    name={trendIcon} 
                    size={14} 
                    color={trendColor} 
                    style={styles.trendIcon} 
                  />
                  <Text style={styles.presaPorcentaje}>{presa.almacenamiento}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${Math.min(presa.almacenamiento, 100)}%`,
                        backgroundColor: fillColor
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  telemetryCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  telemetryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actionHint: {
    fontSize: 10,
    color: COLORS.accent,
  },
  telemetrySubtitle: {
    fontSize: 11,
    color: COLORS.accent,
    marginTop: 2,
    marginBottom: 14,
  },
  listContainer: {
    marginTop: 6,
  },
  presaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBgSecondary,
  },
  presaInfo: {
    flex: 1,
    marginRight: 10,
  },
  presaNombre: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
  },
  presaCapacidad: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  presaMetrics: {
    alignItems: 'flex-end',
    minWidth: 95,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 4,
  },
  presaPorcentaje: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.cardBgSecondary,
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
