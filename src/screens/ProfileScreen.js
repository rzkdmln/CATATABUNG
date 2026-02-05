import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Switch, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Camera, User, ChevronRight, Moon, Sun, Save, Shield, Download, Info, LogOut } from 'lucide-react-native';

const ProfileScreen = () => {
  const { user, updateUser, transactions, goals, getBalance, logout } = useAppContext();
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
    { label: 'Selesai', value: goals.filter(g => g.currentAmount >= (g.targetAmount || g.target_amount)).length.toString() },
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

          <Text style={[styles.menuHeader, { color: theme.textSecondary, marginTop: 25 }]}>DATA & INFORMASI</Text>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={exportData}>
            <View style={styles.menuLeft}>
              <Download size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Ekspor Laporan</Text>
            </View>
            <ChevronRight color={theme.textSecondary} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => Alert.alert('Tentang CATATABUNG', 'Versi 2.0 (Professional)\nBuild with Cloud Sync & Google Auth.')}>
            <View style={styles.menuLeft}>
              <Info size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text, marginLeft: 12 }]}>Versi Aplikasi</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>2.0</Text>
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
