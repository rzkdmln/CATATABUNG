import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Wallet } from 'lucide-react-native';

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { completeOnboarding } = useAppContext();
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
        <View style={[styles.iconBox, { backgroundColor: theme.text }]}>
          <Wallet color={theme.background} size={48} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Selamat Datang di CATATABUNG</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Mari mulai mengatur keuangan Anda dengan lebih cerdas dan bergaya.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Siapa nama panggilan Anda?</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
            placeholder="Masukkan nama"
            placeholderTextColor={theme.accent}
            value={userName}
            onChangeText={setUserName}
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.text }]}
          onPress={handleStart}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>Mulai Sekarang</Text>
          <ArrowRight color={theme.background} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  iconBox: { width: 100, height: 100, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 50, lineHeight: 24 },
  inputContainer: { width: '100%', marginBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  input: { height: 60, borderWidth: 1, borderRadius: 15, paddingHorizontal: 20, fontSize: 18 },
  button: { width: '100%', height: 60, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  buttonText: { fontSize: 18, fontWeight: '700' }
});

export default OnboardingScreen;
