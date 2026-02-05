import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Wallet } from 'lucide-react-native';

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { completeOnboarding, signInWithGoogle } = useAppContext();
  const [userName, setUserName] = useState('');

  const handleStart = () => {
    if (userName.trim().length > 0) {
      completeOnboarding(userName);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: theme.primary }]}>
          <Wallet color="#fff" size={48} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Selamat Datang di CATATABUNG</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Mari mulai mengatur keuangan Anda dengan lebih cerdas dan bergaya.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Siapa nama Anda?</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
            placeholder="Masukkan nama panggilan"
            placeholderTextColor={theme.textSecondary}
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleStart}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Lanjutkan</Text>
          <ArrowRight color="#fff" size={20} />
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.textSecondary }]}>Atau</Text>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>

        <TouchableOpacity 
          style={[styles.googleButton, { borderColor: theme.border }]}
          onPress={signInWithGoogle}
        >
          <Text style={[styles.googleButtonText, { color: theme.text }]}>Masuk dengan Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  iconBox: { width: 90, height: 90, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 5 },
  title: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 15, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  inputContainer: { width: '100%', marginBottom: 30 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 60, borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 20, fontSize: 16, fontWeight: '500' },
  button: { width: '100%', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 3 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25, gap: 15 },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '600' },
  googleButton: { width: '100%', height: 60, borderRadius: 18, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  googleButtonText: { fontSize: 16, fontWeight: '600' }
});

export default OnboardingScreen;
