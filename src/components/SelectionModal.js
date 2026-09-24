import React, { useState, useMemo, memo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const SelectionModal = memo(({
  visible,
  title,
  placeholder,
  data,
  selectedIdOrName,
  getId = (item) => (typeof item === 'string' ? item : item.id),
  getName = (item) => (typeof item === 'string' ? item : item.nombre),
  onSelect,
  onClose
}) => {
  const [query, setQuery] = useState('');

  // Filtrado memorizado dependiente solo de data y la búsqueda interna
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(item => getName(item).toLowerCase().includes(lowerQuery));
  }, [data, query, getName]);

  const handleSelect = (item) => {
    onSelect(item);
    setQuery('');
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const renderItem = ({ item }) => {
    const itemId = getId(item);
    const itemName = getName(item);
    const isSelected = itemId === selectedIdOrName || itemName === selectedIdOrName;

    return (
      <TouchableOpacity
        style={[styles.modalItem, isSelected && styles.modalItemSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
          {itemName}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={18} color={COLORS.accent} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textDim}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => String(getId(item))}
            renderItem={renderItem}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '75%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
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
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchInput: {
    backgroundColor: COLORS.cardBgSecondary,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorderSecondary,
    marginBottom: 12,
    fontSize: 13,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBgSecondary,
  },
  modalItemSelected: {
    backgroundColor: '#1a2436',
  },
  modalItemText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  modalItemTextSelected: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});
