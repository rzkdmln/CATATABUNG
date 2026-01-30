import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Switch, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Camera, User, ChevronRight, Moon, Sun, Save, Shield, Download, Info, LogOut } from 'lucide-react-native';

const ProfileScreen = () => {
  const { user, updateUser, transactions, goals, getBalance } = useAppContext();
  const { theme, isDark, toggleTheme } = useTheme();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [securityEnabled, setSecurityEnabled] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      updateUser({ profileImage: result.assets[0].uri });
    }
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ name: newName });
      setEditingName(false);
    }
  };

  const exportData = async () => {
    const data = { user, transactions, goals, exportedAt: new Date().toISOString() };
    try {
        await Share.share({ message: JSON.stringify(data, null, 2), title: 'Backup CATATABUNG' });
    } catch (e) {
        Alert.alert('Error', 'Gagal ekspor data');
    }
  };

  const stats = [
    { label: 'Saldo', value: `Rp ${getBalance().toLocaleString('id-ID')}` },
    { label: 'Target', value: goals.length.toString() },
    { label: 'Selesai', value: goals.filter(g => g.currentAmount >= g.targetAmount).length.toString() },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Pengaturan Profil</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.card }]}>
                <User color={theme.accent} size={40} />
              </View>
            )}
            <View style={[styles.cameraIcon, { backgroundColor: theme.text }]}>
              <Camera color={theme.background} size={14} />
            </View>
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderBottomColor: theme.border }]}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName} style={[styles.saveBtn, { backgroundColor: theme.text }]}>
                <Save color={theme.background} size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'} <Text style={{ fontSize: 14, color: theme.accent }}>✎</Text></Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.userEmail, { color: theme.accent }]}>Principal Manager</Text>
        </View>

        <View style={[styles.statsRow, { borderColor: theme.border }]}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statItem, index !== stats.length - 1 && { borderRightWidth: 1, borderRightColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.accent }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuHeader, { color: theme.accent }]}>INSTALASI & KEAMANAN</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
            <View style={styles.menuLeft}>
              <Moon size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Mode Gelap Kontras</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.text }} />
          </View>

          <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
            <View style={styles.menuLeft}>
              <Shield size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>PIN & Biometrik</Text>
            </View>
            <Switch value={securityEnabled} onValueChange={setSecurityEnabled} trackColor={{ true: theme.text }} />
          </View>

          <Text style={[styles.menuHeader, { color: theme.accent, marginTop: 25 }]}>DATA MANAGEMENT</Text>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={exportData}>
            <View style={styles.menuLeft}>
              <Download size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Ekspor Data (CSV/JSON)</Text>
            </View>
            <ChevronRight color={theme.accent} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => Alert.alert('Developer Utama', 'Rizki AM - Principal Mobile Architect\nVersi 1.0 (Professional Build)')}>
            <View style={styles.menuLeft}>
              <Info size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Tentang Aplikasi</Text>
            </View>
            <Text style={{ color: theme.accent }}>v1.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card, marginTop: 15 }]}>
            <View style={styles.menuLeft}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={[styles.menuText, { color: '#FF3B30', marginLeft: 12 }]}>Keluar Aplikasi</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.accent, fontSize: 10 }}>Copyright 2026 CATATABUNG - Rizki AM</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  imageContainer: { position: 'relative' },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#fff' },
  placeholderImage: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { position: 'absolute', bottom: 5, right: 5, padding: 8, borderRadius: 20, borderWeight: 2, borderColor: '#fff' },
  userName: { fontSize: 24, fontWeight: '900', marginTop: 15 },
  userEmail: { fontSize: 13, marginTop: 4, opacity: 0.7, fontWeight: '600' },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  nameInput: { borderBottomWidth: 2, fontSize: 20, textAlign: 'center', width: 180, paddingVertical: 5 },
  saveBtn: { padding: 10, borderRadius: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 25, paddingVertical: 25, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 6, fontWeight: '500' },
  menuSection: { padding: 25 },
  menuHeader: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 15 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, marginBottom: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 15, fontWeight: '600' }
});

export default ProfileScreen;
