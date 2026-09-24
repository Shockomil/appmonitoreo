import React, { memo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { ESTADOS_RAPIDOS } from '../constants/locations';

export const StateSelector = memo(({ estadoSeleccionado, onSelectEstado, onOpenModal }) => {
  const isCustomState = !ESTADOS_RAPIDOS.includes(estadoSeleccionado);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>ESTADO SELECCIONADO (CONTEXTO REGIONAL):</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalList}
      >
        {ESTADOS_RAPIDOS.map((estado) => {
          const isSelected = estadoSeleccionado === estado;
          return (
            <TouchableOpacity
              key={estado}
              style={[styles.btnPill, isSelected && styles.btnPillSelected]}
              onPress={() => onSelectEstado(estado)}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnPillText, isSelected && styles.btnPillTextSelected]}>
                {estado}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={[
            styles.btnPill, 
            styles.btnOtros,
            isCustomState && styles.btnPillSelected
          ]} 
          onPress={onOpenModal}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.btnPillText, 
            styles.btnOtrosText,
            isCustomState && styles.btnPillTextSelected
          ]}>
            {isCustomState ? estadoSeleccionado : "Otros Estados"}
          </Text>
          <Ionicons 
            name="chevron-down" 
            size={14} 
            color={isCustomState ? COLORS.text : COLORS.accent} 
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSection,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  horizontalList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  btnPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
  },
  btnPillText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  btnPillTextSelected: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  btnOtros: {
    borderColor: COLORS.primary,
  },
  btnOtrosText: {
    color: COLORS.accent,
  },
  chevronIcon: {
    marginLeft: 4,
  },
});
