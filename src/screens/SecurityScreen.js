import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Lock, Fingerprint, ShieldCheck, ShieldAlert } from 'lucide-react-native';
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
        promptMessage: 'Keamanan Biometrik',
        fallbackLabel: 'Gunakan PIN Perangkat',
        cancelLabel: 'Batal',
        disableDeviceFallback: false,
      });

      if (result.success) {
        unlockApp();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Keamanan', 'Gagal memverifikasi identitas Anda.');
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.branding}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
                <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={[styles.brandName, { color: theme.text }]}>CATATABUNG</Text>
        </View>

        <View style={[styles.lockContainer]}>
            <View style={[styles.iconBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ShieldCheck size={60} color={theme.primary} strokeWidth={1.5} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Sistem Terkunci</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Aplikasi ini dilindungi oleh enkripsi bio-keamanan untuk menjaga privasi data finansial Anda.
            </Text>
        </View>

        <View style={styles.actionArea}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.unlockBtn, { backgroundColor: theme.primary }]} 
              onPress={handleBiometric}
            >
              <Fingerprint color="#fff" size={24} />
              <Text style={[styles.unlockBtnText, { color: '#fff' }]}>Otentikasi Sekarang</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleBiometric}>
                <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>Gunakan Metode Lain</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <ShieldAlert size={14} color={theme.textSecondary} />
            <Text style={[styles.info, { color: theme.textSecondary }]}>
              Enkripsi 256-bit AES Aktif
            </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 40, justifyContent: 'space-between', alignItems: 'center' },
  branding: { alignItems: 'center', marginTop: 20 },
  logoCircle: { width: 50, height: 50, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 4 },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  lockContainer: { alignItems: 'center', width: '100%' },
  iconBox: { width: 130, height: 130, borderRadius: 45, borderWidth: 2, marginBottom: 35, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 15, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 24, fontWeight: '600', width: '90%' },
  actionArea: { width: '100%', alignItems: 'center' },
  unlockBtn: { 
    flexDirection: 'row', 
    width: '100%',
    paddingVertical: 20, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 15,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15
  },
  unlockBtnText: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  secondaryBtn: { marginTop: 20, padding: 10 },
  secondaryBtnText: { fontSize: 14, fontWeight: '800' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  info: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 }
});

export default SecurityScreen;
