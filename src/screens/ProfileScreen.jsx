import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Switch, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Camera, User, ChevronRight, Moon, Sun, Save, Shield, Download, Info, LogOut, Tags } from 'lucide-react-native';
import { exportTransactionsToExcel } from '../utils/export';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, transactions, goals, getBalance, logout } = useAppContext();
  const { theme, isDark, toggleTheme } = useTheme();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [securityEnabled, setSecurityEnabled] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async () => {
            await updateUser({ profileImage: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      Alert.alert('Info', 'Fitur ganti foto profil memerlukan library native.');
    }
  };

  const handleSaveName = async () => {
    if (newName.trim()) {
      await updateUser({ name: newName });
      setEditingName(false);
    } else {
      Alert.alert('Error', 'Nama tidak boleh kosong');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleExport = async () => {
    await exportTransactionsToExcel(transactions);
  };

  const stats = [
    { label: 'Saldo', value: `Rp ${getBalance().toLocaleString('id-ID')}` },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Pengaturan Profil</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity style={[styles.imageContainer, { borderColor: theme.border }]} onPress={pickImage}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.card }]}>
                <User color={theme.primary} size={40} />
              </View>
            )}
            <View style={[styles.cameraIcon, { backgroundColor: theme.primary, borderColor: theme.background }]}>
              <Camera color="#fff" size={14} />
            </View>
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderBottomColor: theme.primary }]}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                <Save color="#fff" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)} style={styles.nameContainer}>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'}</Text>
              <Text style={{ fontSize: 13, color: theme.primary, fontWeight: '700', marginLeft: 8 }}>EDIT</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'Principal Manager'}</Text>
        </View>

        <View style={[styles.statsRow, { borderColor: theme.border, backgroundColor: theme.card }]}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statItem, index !== stats.length - 1 && { borderRightWidth: 1, borderRightColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.menuHeader, { color: theme.textSecondary }]}>PENGATURAN & KEAMANAN</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
            <View style={styles.menuLeft}>
              <Moon size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Mode Gelap</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.primary }} thumbColor="#fff" />
          </View>

          <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
            <View style={styles.menuLeft}>
              <Shield size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Keamanan PIN</Text>
            </View>
            <Switch value={securityEnabled} onValueChange={setSecurityEnabled} trackColor={{ true: theme.primary }} thumbColor="#fff" />
          </View>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('CategorySettings')}>
            <View style={styles.menuLeft}>
              <Tags size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Kustomisasi Kategori</Text>
            </View>
            <ChevronRight color={theme.textSecondary} size={20} />
          </TouchableOpacity>

          <Text style={[styles.menuHeader, { color: theme.textSecondary, marginTop: 25 }]}>DATA & INFORMASI</Text>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={handleExport}>
            <View style={styles.menuLeft}>
              <Download size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Ekspor ke Excel (.xlsx)</Text>
            </View>
            <ChevronRight color={theme.textSecondary} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('VersionHistory')}>
            <View style={styles.menuLeft}>
              <Info size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Versi Aplikasi</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>2.1.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card, marginTop: 15 }]} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <LogOut size={20} color={theme.negative} />
              <Text style={[styles.menuText, { color: theme.negative, marginLeft: 12 }]}>Keluar Akun</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '600' }}>CATATABUNG v2.0 - PROFESSIONAL FINANCE</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 25, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  profileSection: { alignItems: 'center', marginVertical: 35 },
  imageContainer: { position: 'relative', padding: 4, borderRadius: 65, borderWidth: 2 },
  profileImage: { width: 110, height: 110, borderRadius: 55 },
  placeholderImage: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { position: 'absolute', bottom: 5, right: 5, padding: 8, borderRadius: 20, borderWidth: 3 },
  nameContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  userName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  userEmail: { fontSize: 14, marginTop: 4, fontWeight: '600' },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  nameInput: { borderBottomWidth: 2, fontSize: 20, textAlign: 'center', width: 220, paddingVertical: 8, fontWeight: '700' },
  saveBtn: { padding: 12, borderRadius: 15 },
  statsRow: { flexDirection: 'row', marginHorizontal: 25, paddingVertical: 20, borderRadius: 24, marginBottom: 15 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 6, fontWeight: '600' },
  menuSection: { paddingHorizontal: 25, paddingVertical: 10 },
  menuHeader: { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 22, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.04, shadowRadius:10 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '700' }
});

export default ProfileScreen;
