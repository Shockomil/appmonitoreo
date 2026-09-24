import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export const Header = memo(({ estado }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>MX-TELEMETRY</Text>
      <Text style={styles.headerSubtitle}>
        Plataforma Interactiva: {estado} • Modelo ECMWF / CONAGUA
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSubtitle,
  },
});
