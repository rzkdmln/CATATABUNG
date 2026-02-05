import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Info, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const VersionHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const history = [
    {
      version: '2.1.0',
      date: 'Desember 2023',
      changes: [
        'Tema Emerald Green (Professional Green)',
        'Kustomisasi kategori Pengeluaran & Pemasukan',
        'Ekspor laporan transaksi ke format Excel (.xlsx)',
        'Mode Gelap yang independen dari sistem perangkat',
        'Optimasi scrolling pada daftar transaksi',
        'Fitur saran target menabung harian & mingguan',
        'Pembaruan label: "Total uang kamu"'
      ]
    },
    {
      version: '2.0.0',
      date: 'November 2023',
      changes: [
        'Integrasi Cloud Sync dengan Supabase',
        'Sistem Keamanan PIN & Biometrik',
        'Grafik Analisis Keuangan (Pie & Line Chart)',
        'Manajemen Target Impian (Saving Goals)'
      ]
    },
    {
      version: '1.0.0',
      date: 'Oktober 2023',
      changes: [
        'Rilis Awal Catatabung',
        'Pencatatan transaksi sederhana',
        'Penyimpanan lokal'
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <ChevronLeft color={theme.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Riwayat Versi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
            <Info size={24} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Kami terus melakukan pembaruan untuk memberikan pengalaman manajemen keuangan terbaik bagi Anda.
            </Text>
        </View>

        {history.map((item, index) => (
          <View key={index} style={[styles.versionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.versionHeader}>
              <Text style={[styles.versionNumber, { color: theme.primary }]}>v{item.version}</Text>
              <Text style={[styles.versionDate, { color: theme.textSecondary }]}>{item.date}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.changesList}>
              {item.changes.map((change, i) => (
                <View key={i} style={styles.changeItem}>
                  <CheckCircle2 size={14} color={theme.positive} />
                  <Text style={[styles.changeText, { color: theme.text }]}>{change}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>CATATABUNG © 2023</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, gap: 15 },
  backBtn: { padding: 10, borderRadius: 15 },
  headerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  content: { padding: 25 },
  infoBox: { flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 30, paddingRight: 20 },
  infoText: { fontSize: 13, fontWeight: '600', lineHeight: 20 },
  versionCard: { borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1.5 },
  versionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  versionNumber: { fontSize: 18, fontWeight: '900' },
  versionDate: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  changesList: { gap: 12 },
  changeItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  changeText: { fontSize: 14, fontWeight: '600', flex: 1, lineHeight: 20 }
});

export default VersionHistoryScreen;
