import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Target, Plus, CheckCircle2, TrendingUp, X, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SavingGoalsScreen = () => {
  const { goals, addGoal, updateGoalProgress, addTransaction, deleteGoal } = useAppContext();
  const { theme } = useTheme();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [addFundModalVisible, setAddFundModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const calculateEstimation = (targetAmt, currentAmt, dl) => {
    const remaining = targetAmt - currentAmt;
    if (remaining <= 0) return { daily: 0, weekly: 0 };
    
    const now = new Date();
    const targetDate = new Date(dl);
    const diffTime = Math.max(targetDate - now, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const diffWeeks = Math.ceil(diffDays / 7) || 1;
    
    return {
      daily: remaining / diffDays,
      weekly: remaining / diffWeeks,
      daysLeft: diffDays
    };
  };

  const handleSaveGoal = () => {
    if (!title || !target) {
      Alert.alert('Error', 'Harap isi semua kolom');
      return;
    }
    const newGoal = {
      title,
      targetAmount: parseFloat(target),
      deadline: deadline.toISOString(),
      reminderTime: reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    addGoal(newGoal);
    setTitle('');
    setTarget('');
    setModalVisible(false);
  };

  const handleDeleteGoal = (id) => {
    Alert.alert('Hapus Target', 'Apakah Anda yakin ingin menghapus impian ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteGoal(id) }
    ]);
  };

  const GoalItem = ({ item }) => {
    const progress = Math.min((item.currentAmount / item.targetAmount) * 100, 100);
    const est = calculateEstimation(item.targetAmount, item.currentAmount, item.deadline);
    const isCompleted = progress >= 100;

    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
                <Text style={[styles.goalTitle, { color: theme.text }]}>{item.title}</Text>
                {isCompleted && <CheckCircle2 size={16} color={theme.positive} />}
            </View>
            <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
                <Trash2 size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.targetAmount, { color: theme.accent }]}>
            Rp {item.currentAmount.toLocaleString()} / {item.targetAmount.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.progressBackground, { backgroundColor: theme.background }]}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.text }]} />
        </View>

        {!isCompleted && (
          <View style={[styles.estimationBox, { backgroundColor: theme.background }]}>
             <Text style={[styles.estTitle, { color: theme.accent }]}>Estimasi Nabung:</Text>
             <View style={styles.estRow}>
                <View>
                    <Text style={[styles.estValue, { color: theme.text }]}>Rp {est.daily.toLocaleString()}</Text>
                    <Text style={[styles.estLabel, { color: theme.accent }]}>Harian</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View>
                    <Text style={[styles.estValue, { color: theme.text }]}>Rp {est.weekly.toLocaleString()}</Text>
                    <Text style={[styles.estLabel, { color: theme.accent }]}>Mingguan</Text>
                </View>
             </View>
             <Text style={[styles.deadlineInfo, { color: theme.accent }]}>
                Sisa waktu: {est.daysLeft} hari lagi
             </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.quickAddButton, { backgroundColor: theme.text }]} 
          onPress={() => {
            setSelectedGoal(item);
            setAddFundModalVisible(true);
          }}
        >
          <TrendingUp size={16} color={theme.background} />
          <Text style={[styles.quickAddText, { color: theme.background }]}>Tambah Saldo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Impian Kamu</Text>
          <Text style={[styles.subtitle, { color: theme.accent }]}>Wujudkan rencana masa depanmu</Text>
        </View>
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.text }]} onPress={() => setModalVisible(true)}>
          <Plus color={theme.background} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {goals.map((item) => <GoalItem key={item.id} item={item} />)}
        {goals.length === 0 && (
          <View style={styles.emptyContainer}>
            <Target size={50} color={theme.accent} strokeWidth={1} />
            <Text style={[styles.emptyText, { color: theme.accent }]}>Belum ada target tabungan.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal New Goal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Desain Impian</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={theme.text} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]} 
              placeholder="Contoh: Beli Laptop Pro" 
              placeholderTextColor={theme.accent}
              value={title} onChangeText={setTitle} 
            />
            <TextInput 
              style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]} 
              placeholder="Target Nominal (Rp)" 
              placeholderTextColor={theme.accent}
              keyboardType="numeric" value={target} onChangeText={setTarget} 
            />
            
            <View style={styles.pickerRow}>
                <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.background }]} onPress={() => setShowDatePicker(true)}>
                    <CalendarIcon size={18} color={theme.text} />
                    <Text style={{ color: theme.text }}>{deadline.toLocaleDateString('id-ID')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.background }]} onPress={() => setShowTimePicker(true)}>
                    <Clock size={18} color={theme.text} />
                    <Text style={{ color: theme.text }}>{reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={deadline}
                    mode="date"
                    display="default"
                    onChange={(e, date) => { setShowDatePicker(false); if (date) setDeadline(date); }}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    display="default"
                    is24Hour={true}
                    onChange={(e, time) => { setShowTimePicker(false); if (time) setReminderTime(time); }}
                />
            )}

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.text }]} onPress={handleSaveGoal}>
              <Text style={[styles.modalButtonText, { color: theme.background }]}>Simpan Impian</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Add Fund */}
      <Modal animationType="fade" transparent={true} visible={addFundModalVisible}>
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Tambah Saldo</Text>
                <TouchableOpacity onPress={() => setAddFundModalVisible(false)}>
                    <X color={theme.text} size={24} />
                </TouchableOpacity>
                </View>
                <Text style={[styles.label, { color: theme.text, marginBottom: 15 }]}>{selectedGoal?.title}</Text>
                <TextInput 
                style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border, fontSize: 24, fontWeight: '700' }]} 
                placeholder="0" 
                placeholderTextColor={theme.accent}
                keyboardType="numeric" value={fundAmount} onChangeText={setFundAmount} 
                autoFocus
                />
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.text }]} onPress={() => {
                    const amount = parseFloat(fundAmount);
                    if (amount > 0) {
                        updateGoalProgress(selectedGoal.id, amount);
                        addTransaction({
                            title: `Tabung: ${selectedGoal.title}`,
                            amount: amount,
                            type: 'expense',
                            date: new Date().toLocaleDateString('id-ID'),
                            category: 'Tabungan'
                        });
                        setFundAmount('');
                        setAddFundModalVisible(false);
                    }
                }}>
                <Text style={[styles.modalButtonText, { color: theme.background }]}>Konfirmasi Tabungan</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  fab: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  card: { padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1 },
  cardHeader: { marginBottom: 15 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5, flex: 1 },
  goalTitle: { fontSize: 18, fontWeight: '800' },
  targetAmount: { fontSize: 12, fontWeight: '600' },
  progressBackground: { height: 8, borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
  progressBar: { height: '100%', borderRadius: 10 },
  estimationBox: { padding: 15, borderRadius: 16, marginBottom: 20 },
  estTitle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
  estRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  estValue: { fontSize: 16, fontWeight: '800' },
  estLabel: { fontSize: 10, fontWeight: '500' },
  divider: { width: 1, height: 20 },
  deadlineInfo: { fontSize: 10, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
  quickAddButton: { flexDirection: 'row', padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickAddText: { fontSize: 14, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 20, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { padding: 30, borderTopLeftRadius: 36, borderTopRightRadius: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900' },
  input: { padding: 18, borderRadius: 18, marginBottom: 15, borderWidth: 1, fontSize: 16 },
  pickerRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pickerBtn: { flex: 1, padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  modalButton: { padding: 20, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  modalButtonText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 16, fontWeight: '600' }
});

export default SavingGoalsScreen;
