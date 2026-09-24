import React, { memo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const MunicipalitySelector = memo(({ 
  estadoSeleccionado, 
  listaMunicipios, 
  municipioSeleccionado, 
  onSelectMunicipio, 
  onOpenModal 
}) => {
  const municipiosRapidos = listaMunicipios.slice(0, 3);
  const tieneMasMunicipios = listaMunicipios.length > 3;
  const isSelectedInRapidos = municipiosRapidos.some(m => m.id === municipioSeleccionado?.id);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        MUNICIPIOS DE ACCESO RÁPIDO ({estadoSeleccionado}):
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalList}
      >
        {municipiosRapidos.map((mun) => {
          const isSelected = municipioSeleccionado?.id === mun.id;
          return (
            <TouchableOpacity
              key={mun.id}
              style={[styles.btnPill, isSelected && styles.btnPillSelected]}
              onPress={() => onSelectMunicipio(mun)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="location-sharp" 
                size={14} 
                color={isSelected ? COLORS.text : COLORS.accent} 
                style={styles.locationIcon} 
              />
              <Text style={[styles.btnPillText, isSelected && styles.btnPillTextSelected]}>
                {mun.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}

        {tieneMasMunicipios && (
          <TouchableOpacity 
            style={[
              styles.btnPill, 
              styles.btnOtros,
              !isSelectedInRapidos && styles.btnPillSelected
            ]}
            onPress={onOpenModal}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.btnPillText, 
              styles.btnOtrosText,
              !isSelectedInRapidos && styles.btnPillTextSelected
            ]}>
              {!isSelectedInRapidos && municipioSeleccionado 
                ? municipioSeleccionado.nombre 
                : "Más Municipios"}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={14} 
              color={!isSelectedInRapidos ? COLORS.text : COLORS.accent} 
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        )}
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
  locationIcon: {
    marginRight: 6,
  },
  chevronIcon: {
    marginLeft: 4,
  },
});
