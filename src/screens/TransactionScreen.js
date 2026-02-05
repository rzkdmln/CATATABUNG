import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Save, MinusCircle, PlusCircle, Tag, CreditCard, Layout } from 'lucide-react-native';

const CATEGORIES = {
  expense: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Lainnya'],
  income: ['Gaji', 'Bonus', 'Investasi', 'Hadiah', 'Penjualan', 'Lainnya']
};

const TransactionScreen = () => {
  const { addTransaction } = useAppContext();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSave = () => {
    if (!title || !amount) {
      Alert.alert('Data Belum Lengkap', 'Judul dan nominal harus diisi.');
      return;
    }

    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Harap masukkan angka yang benar.');
      return;
    }

    const newTransaction = {
      title,
      amount: numAmount,
      type,
      category,
      date: new Date().toISOString(),
    };

    addTransaction(newTransaction);
    setTitle('');
    setAmount('');
    Alert.alert('Berhasil', 'Transaksi telah dicatat ke dalam database.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerArea}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Input Transaksi</Text>
            <Text style={[styles.headerSub, { color: theme.accent }]}>Catat arus kas Anda secara presisi</Text>
          </View>
          
          <View style={[styles.typeSwitcher, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'expense' && { backgroundColor: theme.text }]} 
              onPress={() => handleTypeChange('expense')}
            >
              <MinusCircle size={16} color={type === 'expense' ? theme.background : theme.negative} />
              <Text style={[styles.typeText, { color: type === 'expense' ? theme.background : theme.text }]}>Pengeluaran</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, type === 'income' && { backgroundColor: theme.text }]} 
              onPress={() => handleTypeChange('income')}
            >
              <PlusCircle size={16} color={type === 'income' ? theme.background : theme.positive} />
              <Text style={[styles.typeText, { color: type === 'income' ? theme.background : theme.text }]}>Pemasukan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Layout size={14} color={theme.accent} />
                    <Text style={[styles.label, { color: theme.text }]}>Keterangan</Text>
                </View>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]} 
                  placeholder="Contoh: Makan siang di kantor" 
                  placeholderTextColor={theme.accent}
                  value={title}
                  onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <CreditCard size={14} color={theme.accent} />
                    <Text style={[styles.label, { color: theme.text }]}>Nominal (Rp)</Text>
                </View>
                <TextInput 
                  style={[styles.input, styles.amountInput, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]} 
                  placeholder="0" 
                  placeholderTextColor={theme.accent}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Tag size={14} color={theme.accent} />
                    <Text style={[styles.label, { color: theme.text }]}>Kategori</Text>
                </View>
                <View style={styles.categoryGrid}>
                    {CATEGORIES[type].map(cat => (
                        <TouchableOpacity 
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={[
                                styles.categoryTag, 
                                { borderColor: theme.border },
                                category === cat && { backgroundColor: theme.text, borderColor: theme.text }
                            ]}
                        >
                            <Text style={[
                                styles.categoryTagText, 
                                { color: theme.text },
                                category === cat && { color: theme.background }
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.saveBtn, { backgroundColor: theme.text, shadowColor: theme.text }]} 
            onPress={handleSave}
          >
            <Save color={theme.background} size={20} />
            <Text style={[styles.saveBtnText, { color: theme.background }]}>Simpan Transaksi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 25 },
  headerArea: { marginBottom: 30 },
  headerTitle: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  typeSwitcher: { flexDirection: 'row', borderRadius: 20, padding: 6, marginBottom: 35, borderWidth: 1 },
  typeButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  typeText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  formSection: { gap: 25 },
  inputGroup: { },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginLeft: 5 },
  label: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 },
  input: { borderWidth: 1, borderRadius: 18, padding: 18, fontSize: 16, fontWeight: '600' },
  amountInput: { fontSize: 24, fontWeight: '900', paddingVertical: 22 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryTag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  categoryTagText: { fontSize: 13, fontWeight: '700' },
  saveBtn: { 
    flexDirection: 'row', 
    padding: 22, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    marginTop: 40,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
});

export default TransactionScreen;
