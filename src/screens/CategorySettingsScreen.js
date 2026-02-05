import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, Trash2, ArrowLeft, Tag, MinusCircle, PlusCircle } from 'lucide-react-native';

const CategorySettingsScreen = ({ navigation }) => {
  const { expenseCategories, incomeCategories, addCategory, removeCategory } = useAppContext();
  const { theme } = useTheme();
  const [type, setType] = useState('expense');
  const [newCat, setNewCat] = useState('');

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleAdd = () => {
    if (newCat.trim()) {
      if (currentCategories.includes(newCat.trim())) {
        Alert.alert('Gagal', 'Kategori ini sudah ada.');
        return;
      }
      addCategory(type, newCat.trim());
      setNewCat('');
    }
  };

  const handleDelete = (cat) => {
    Alert.alert(
      'Hapus Kategori',
      `Apakah Anda yakin ingin menghapus kategori "${cat}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => removeCategory(type, cat) }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <ArrowLeft color={theme.text} size={22} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Kelola Kategori</Text>
      </View>

      <View style={[styles.typeSwitcher, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.typeButton, type === 'expense' && { backgroundColor: theme.negative }]} 
          onPress={() => setType('expense')}
        >
          <MinusCircle size={16} color={type === 'expense' ? '#fff' : theme.negative} />
          <Text style={[styles.typeText, { color: type === 'expense' ? '#fff' : theme.text }]}>Pengeluaran</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeButton, type === 'income' && { backgroundColor: theme.positive }]} 
          onPress={() => setType('income')}
        >
          <PlusCircle size={16} color={type === 'income' ? '#fff' : theme.positive} />
          <Text style={[styles.typeText, { color: type === 'income' ? '#fff' : theme.text }]}>Pemasukan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
          placeholder="Nama kategori baru..."
          placeholderTextColor={theme.textSecondary}
          value={newCat}
          onChangeText={setNewCat}
        />
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={handleAdd}>
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentCategories}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={[styles.catItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.catLeft}>
              <Tag size={18} color={theme.primary} />
              <Text style={[styles.catName, { color: theme.text }]}>{item}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Trash2 size={18} color={theme.negative} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>Belum ada kategori kustom.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, gap: 15 },
  headerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  backBtn: { padding: 10, borderRadius: 12 },
  typeSwitcher: { flexDirection: 'row', marginHorizontal: 25, borderRadius: 20, padding: 5, marginBottom: 25, borderWidth: 1.5 },
  typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  typeText: { fontSize: 13, fontWeight: '800' },
  addSection: { flexDirection: 'row', paddingHorizontal: 25, gap: 10, marginBottom: 25 },
  input: { flex: 1, borderWidth: 1.5, borderRadius: 15, paddingHorizontal: 20, paddingVertical: 12, fontWeight: '600' },
  addBtn: { padding: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 25, paddingBottom: 40 },
  catItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, marginBottom: 10, borderWidth: 1 },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catName: { fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 50, fontWeight: '600' }
});

export default CategorySettingsScreen;
