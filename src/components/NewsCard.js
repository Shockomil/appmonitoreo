import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const NewsCard = memo(({ noticiasList, estadoSeleccionado, onOpenLink }) => {
  return (
    <View style={styles.telemetryCard}>
      <View style={styles.headerRow}>
        <Text style={styles.telemetryTitle}>Noticias y Alertas Ambientales</Text>
        <Text style={styles.actionHint}>Toca para abrir enlace</Text>
      </View>
      <Text style={styles.telemetrySubtitle}>
        Boletines operativos para {estadoSeleccionado}
      </Text>

      <View style={styles.listContainer}>
        {noticiasList.map((noticia, idx) => (
          <TouchableOpacity 
            key={noticia.id || idx} 
            style={styles.noticiaItem}
            onPress={() => onOpenLink(noticia.url)}
            activeOpacity={0.7}
          >
            <View style={styles.metaRow}>
              <Text style={styles.noticiaCategoria}>{noticia.categoria}</Text>
              <Text style={styles.noticiaTiempo}>{noticia.tiempo}</Text>
            </View>
            <Text style={styles.noticiaTitulo}>{noticia.titulo}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.noticiaFuente}>Fuente: {noticia.fuente}</Text>
              <Ionicons name="open-outline" size={14} color={COLORS.accent} />
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 20,
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
    marginTop: 4,
  },
  noticiaItem: {
    backgroundColor: COLORS.cardBgSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorderSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noticiaCategoria: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noticiaTiempo: {
    fontSize: 10,
    color: COLORS.textDim,
  },
  noticiaTitulo: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  noticiaFuente: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
