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
      Alert.alert('Data Kosong', 'Harap isi impian dan target nominal Anda.');
      return;
    }
    const newGoal = {
      title,
      targetAmount: parseFloat(target),
      deadline: deadline.toISOString(),
      reminderTime: reminderTime.getHours().toString().padStart(2, '0') + ':' + reminderTime.getMinutes().toString().padStart(2, '0') + ':00'
    };
    addGoal(newGoal);
    setTitle('');
    setTarget('');
    setModalVisible(false);
  };

  const handleDeleteGoal = (id) => {
    Alert.alert('Hapus Impian', 'Hapus target ini dari daftar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteGoal(id) }
    ]);
  };

  const GoalItem = ({ item }) => {
    const targetAmount = item.targetAmount || item.target_amount;
    const currentAmount = item.currentAmount || item.current_amount || 0;
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);
    const est = calculateEstimation(targetAmount, currentAmount, item.deadline);
    const isCompleted = progress >= 100;

    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
                <Text style={[styles.goalTitle, { color: theme.text }]}>{item.title}</Text>
                {isCompleted && <CheckCircle2 size={18} color={theme.positive} />}
            </View>
            <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.trashCircle}>
                <Trash2 size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.targetAmountText, { color: theme.textSecondary }]}>
            Rp {currentAmount.toLocaleString('id-ID')} / {targetAmount.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={[styles.progressBackground, { backgroundColor: theme.background }]}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.primary }]} />
        </View>

        {!isCompleted && (
          <View style={[styles.estimationBox, { backgroundColor: theme.background }]}>
             <Text style={[styles.estTitle, { color: theme.textSecondary }]}>Saran Menabung:</Text>
             <View style={styles.estRow}>
                <View style={styles.estCol}>
                    <Text style={[styles.estValue, { color: theme.text }]}>Rp {Math.ceil(est.daily).toLocaleString('id-ID')}</Text>
                    <Text style={[styles.estLabel, { color: theme.textSecondary }]}>Harian</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.estCol}>
                    <Text style={[styles.estValue, { color: theme.text }]}>Rp {Math.ceil(est.weekly).toLocaleString('id-ID')}</Text>
                    <Text style={[styles.estLabel, { color: theme.textSecondary }]}>Mingguan</Text>
                </View>
             </View>
             <View style={styles.deadlineBadge}>
                <Text style={[styles.deadlineInfo, { color: theme.primary }]}>
                   Target: {est.daysLeft} hari lagi
                </Text>
             </View>
          </View>
        )}

        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.quickAddButton, { backgroundColor: isCompleted ? theme.positive : theme.primary }]} 
          onPress={() => {
            setSelectedGoal(item);
            setAddFundModalVisible(true);
          }}
        >
          <TrendingUp size={16} color="#fff" />
          <Text style={[styles.quickAddText, { color: '#fff' }]}>{isCompleted ? 'Target Selesai!' : 'Tabung Sekarang'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Impian & Target</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Atur strategi untuk masa depan</Text>
        </View>
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(true)}>
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {goals.map((item) => <GoalItem key={item.id} item={item} />)}
        {goals.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: theme.card }]}>
               <Target size={50} color={theme.textSecondary} strokeWidth={1} />
            </View>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Belum ada target impian.</Text>
            <TouchableOpacity style={[styles.emptyAddBtn, { borderColor: theme.primary }]} onPress={() => setModalVisible(true)}>
               <Text style={{ color: theme.primary, fontWeight: '700' }}>Buat Impian Pertama</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal New Goal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Buat Target Baru</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color={theme.text} size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrap}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Nama Impian</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]} 
                  placeholder="Misal: Umroh 2026" 
                  placeholderTextColor={theme.textSecondary}
                  value={title} onChangeText={setTitle} 
                />
            </View>
            <View style={styles.inputWrap}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Target Dana (Rp)</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border, fontSize: 24, fontWeight: '800' }]} 
                  placeholder="0" 
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric" value={target} onChangeText={setTarget} 
                />
            </View>
            
            <View style={styles.pickerRow}>
                <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => setShowDatePicker(true)}>
                    <CalendarIcon size={18} color={theme.primary} />
                    <Text style={{ color: theme.text, fontWeight: '600' }}>{deadline.toLocaleDateString('id-ID')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => setShowTimePicker(true)}>
                    <Clock size={18} color={theme.primary} />
                    <Text style={{ color: theme.text, fontWeight: '600' }}>{reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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

            <TouchableOpacity activeOpacity={0.8} style={[styles.modalButton, { backgroundColor: theme.primary }]} onPress={handleSaveGoal}>
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>Simpan Target</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Add Fund */}
      <Modal animationType="fade" transparent={true} visible={addFundModalVisible}>
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card, marginBottom: 100 }]}>
                <View style={styles.modalHeader}>
                    <View>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Tabung Sekarang</Text>
                        <Text style={[styles.goalSub, { color: theme.textSecondary }]}>{selectedGoal?.title}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setAddFundModalVisible(false)} style={styles.closeBtn}>
                        <X color={theme.text} size={20} />
                    </TouchableOpacity>
                </View>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.primary, fontSize: 32, fontWeight: '900', textAlign: 'center', paddingVertical: 25 }]} 
                  placeholder="0" 
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric" value={fundAmount} onChangeText={setFundAmount} 
                  autoFocus
                />
                <TouchableOpacity activeOpacity={0.8} style={[styles.modalButton, { backgroundColor: theme.primary }]} onPress={() => {
                    const amount = parseFloat(fundAmount);
                    if (amount > 0) {
                        updateGoalProgress(selectedGoal.id, amount);
                        addTransaction({
                            title: `Tabung: ${selectedGoal.title}`,
                            amount: amount,
                            type: 'expense',
                            date: new Date().toISOString(),
                            category: 'Tabungan'
                        });
                        setFundAmount('');
                        setAddFundModalVisible(false);
                    }
                }}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Konfirmasi Tabungan</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 13, marginTop: 4, fontWeight: '600' },
  fab: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  list: { paddingHorizontal: 25, paddingBottom: 100 },
  card: { padding: 22, borderRadius: 28, marginBottom: 20, borderWidth: 1.5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { marginBottom: 18 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  goalTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
  trashCircle: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)' },
  targetAmountText: { fontSize: 13, fontWeight: '700', marginTop: 5 },
  progressBackground: { height: 10, borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
  progressBar: { height: '100%', borderRadius: 10 },
  estimationBox: { padding: 18, borderRadius: 20, marginBottom: 22 },
  estTitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  estRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  estCol: { alignItems: 'center' },
  estValue: { fontSize: 18, fontWeight: '800' },
  estLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  divider: { width: 1.5, height: 30 },
  deadlineBadge: { alignSelf: 'center', marginTop: 15, backgroundColor: 'rgba(79, 70, 229, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  deadlineInfo: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  quickAddButton: { flexDirection: 'row', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 3 },
  quickAddText: { fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIconBox: { width: 100, height: 100, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  emptyText: { fontSize: 16, fontWeight: '600', marginBottom: 20 },
  emptyAddBtn: { borderWidth: 2, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { padding: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 35 },
  modalTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  goalSub: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  closeBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)' },
  inputWrap: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 5 },
  input: { padding: 20, borderRadius: 22, borderWidth: 1.5, fontSize: 16, fontWeight: '600' },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  pickerBtn: { flex: 1, padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', borderWidth: 1.5 },
  modalButton: { padding: 22, borderRadius: 22, alignItems: 'center', marginTop: 10, elevation: 5 },
  modalButtonText: { fontSize: 17, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
});

export default SavingGoalsScreen;
