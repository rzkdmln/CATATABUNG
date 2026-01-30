import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Lock, Fingerprint, ShieldCheck } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SecurityScreen = () => {
  const { unlockApp } = useAppContext();
  const { theme } = useTheme();

  const handleBiometric = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        unlockApp(); // Fallback if no biometric set up but security enabled
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Konfirmasi identitas Anda',
        fallbackLabel: 'Gunakan PIN',
      });

      if (result.success) {
        unlockApp();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Gagal memverifikasi identitas');
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ShieldCheck size={60} color={theme.text} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Aplikasi Terkunci</Text>
        <Text style={[styles.subtitle, { color: theme.accent }]}>
          CATATABUNG dilindungi oleh sistem keamanan biometrik perangkat Anda.
        </Text>

        <TouchableOpacity 
          style={[styles.unlockBtn, { backgroundColor: theme.text }]} 
          onPress={handleBiometric}
        >
          <Fingerprint color={theme.background} size={22} />
          <Text style={[styles.unlockBtnText, { color: theme.background }]}>Buka Kunci</Text>
        </TouchableOpacity>

        <Text style={[styles.info, { color: theme.accent }]}>
          Data Anda disimpan secara lokal dan terenkripsi menggunakan SQLite.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconBox: { padding: 30, borderRadius: 35, borderWidth: 1, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 12 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 50 },
  unlockBtn: { 
    flexDirection: 'row', 
    paddingHorizontal: 40, 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    gap: 12 
  },
  unlockBtnText: { fontSize: 16, fontWeight: '800' },
  info: { position: 'absolute', bottom: 50, fontSize: 10, textAlign: 'center', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }
});

export default SecurityScreen;
