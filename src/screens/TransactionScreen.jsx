import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Save, MinusCircle, PlusCircle, Tag, CreditCard, Layout } from 'lucide-react-native';
import { formatNumber, cleanNumber } from '../utils/format';

const TransactionScreen = () => {
  const { addTransaction, expenseCategories, incomeCategories } = useAppContext();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(expenseCategories[0]);

  const CATEGORIES = {
    expense: expenseCategories,
    income: incomeCategories
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
  };

  const handleAmountChange = (text) => {
    const cleaned = cleanNumber(text);
    if (cleaned === '') {
      setDisplayAmount('');
      return;
    }
    setDisplayAmount(formatNumber(cleaned));
  };

  const handleSave = async () => {
    if (!title || !displayAmount) {
      Alert.alert('Data Belum Lengkap', 'Judul dan nominal harus diisi.');
      return;
    }

    const numAmount = parseFloat(cleanNumber(displayAmount));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Harap masukkan angka yang benar.');
      return;
    }

    try {
      const newTransaction = {
        title,
        amount: numAmount,
        type,
        category,
        date: new Date().toISOString(),
      };

      await addTransaction(newTransaction);
      setTitle('');
      setDisplayAmount('');
      Alert.alert('Berhasil', 'Transaksi telah dicatat secara permanen.');
    } catch (err) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const activeColor = type === 'income' ? theme.positive : theme.negative;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerArea}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Catat Transaksi</Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Pantau setiap rupiah yang mengalir</Text>
          </View>
          
          <View style={[styles.typeSwitcher, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.typeButton, type === 'expense' && { backgroundColor: theme.negative }]} 
              onPress={() => handleTypeChange('expense')}
            >
              <MinusCircle size={18} color={type === 'expense' ? '#fff' : theme.negative} />
              <Text style={[styles.typeText, { color: type === 'expense' ? '#fff' : theme.text }]}>Keluar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.typeButton, type === 'income' && { backgroundColor: theme.positive }]} 
              onPress={() => handleTypeChange('income')}
            >
              <PlusCircle size={18} color={type === 'income' ? '#fff' : theme.positive} />
              <Text style={[styles.typeText, { color: type === 'income' ? '#fff' : theme.text }]}>Masuk</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Layout size={14} color={theme.textSecondary} />
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Deskripsi</Text>
                </View>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]} 
                  placeholder="Misal: Kopi pagi" 
                  placeholderTextColor={theme.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <CreditCard size={14} color={theme.textSecondary} />
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Nominal (Rp)</Text>
                </View>
                <TextInput 
                  style={[styles.input, styles.amountInput, { color: activeColor, backgroundColor: theme.card, borderColor: theme.border }]} 
                  placeholder="0" 
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={displayAmount}
                  onChangeText={handleAmountChange}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Tag size={14} color={theme.textSecondary} />
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Kategori</Text>
                </View>
                <View style={styles.categoryGrid}>
                    {CATEGORIES[type].map(cat => (
                        <TouchableOpacity 
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={[
                                styles.categoryTag, 
                                { borderColor: theme.border, backgroundColor: theme.card },
                                category === cat && { backgroundColor: activeColor, borderColor: activeColor }
                            ]}
                        >
                            <Text style={[
                                styles.categoryTagText, 
                                { color: theme.text },
                                category === cat && { color: '#fff' }
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.9}
            style={[styles.saveBtn, { backgroundColor: activeColor }]} 
            onPress={handleSave}
          >
            <Save color="#fff" size={20} />
            <Text style={[styles.saveBtnText, { color: '#fff' }]}>Simpan Catatan</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingVertical: 20 },
  headerArea: { marginBottom: 35 },
  headerTitle: { fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  headerSub: { fontSize: 14, marginTop: 4, fontWeight: '600' },
  typeSwitcher: { flexDirection: 'row', borderRadius: 24, padding: 6, marginBottom: 40, borderWidth: 1.5 },
  typeButton: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: 18, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  typeText: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  formSection: { gap: 30 },
  inputGroup: { },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginLeft: 5 },
  label: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  input: { borderWidth: 1.5, borderRadius: 20, padding: 20, fontSize: 16, fontWeight: '600' },
  amountInput: { fontSize: 28, fontWeight: '900', paddingVertical: 25 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryTag: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5 },
  categoryTagText: { fontSize: 13, fontWeight: '700' },
  saveBtn: { 
    flexDirection: 'row', 
    padding: 22, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    marginTop: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
});

export default TransactionScreen;
