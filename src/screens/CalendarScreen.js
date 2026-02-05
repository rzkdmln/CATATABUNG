  import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import TransactionCard from '../components/TransactionCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown, Info } from 'lucide-react-native';

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
  today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id';

const CalendarScreen = () => {
  const { transactions } = useAppContext();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const markedDates = useMemo(() => {
    const marks = {};
    transactions.forEach(tx => {
      if (tx.date) {
        const isoDate = tx.date.split('T')[0];
        if (!marks[isoDate]) {
            marks[isoDate] = { marked: true, dots: [] };
        }
        // Multi-dot support
        const dotColor = tx.type === 'income' ? theme.positive : theme.negative;
        marks[isoDate].dotColor = dotColor; // Fallback for simple dots
      }
    });

    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: theme.primary,
      selectedTextColor: '#ffffff' 
    };
    return marks;
  }, [transactions, selectedDate, theme]);

  const filteredTransactions = transactions.filter(tx => {
    if (tx.date) {
       const isoDate = tx.date.split('T')[0];
       return isoDate === selectedDate;
    }
    return false;
  });

  const dailySummary = useMemo(() => {
    let inc = 0, exp = 0;
    filteredTransactions.forEach(t => {
        if (t.type === 'income') inc += t.amount;
        else exp += t.amount;
    });
    return { income: inc, expense: exp };
  }, [filteredTransactions]);

  const formatDateLabel = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TransactionCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Jejak Keuangan</Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Riwayat transaksi harian Anda</Text>
              </View>
              <View style={[styles.dateIcon, { backgroundColor: theme.card }]}>
                <CalendarIcon size={22} color={theme.primary} />
              </View>
            </View>
            
            <View style={[styles.calendarCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Calendar
                theme={{
                  calendarBackground: 'transparent',
                  textSectionTitleColor: theme.textSecondary,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.primary,
                  dayTextColor: theme.text,
                  textDisabledColor: theme.border,
                  dotColor: theme.primary,
                  monthTextColor: theme.text,
                  indicatorColor: theme.primary,
                  arrowColor: theme.primary,
                  textDayFontWeight: '600',
                  textMonthFontWeight: '900',
                  textDayHeaderFontWeight: '700',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  'stylesheet.calendar.header': {
                      header: {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingLeft: 10,
                          paddingRight: 10,
                          marginTop: 5,
                          alignItems: 'center',
                          marginBottom: 10
                      },
                      monthText: {
                          fontSize: 18,
                          fontWeight: '800',
                          color: theme.text,
                          letterSpacing: -0.5
                      }
                  }
                }}
                markedDates={markedDates}
                onDayPress={day => setSelectedDate(day.dateString)}
                enableSwipeMonths={true}
                renderArrow={(dir) => dir === 'left' ? <ChevronLeft size={20} color={theme.primary} /> : <ChevronRight size={20} color={theme.primary} />}
              />
            </View>

            <View style={styles.summaryContainer}>
              <View style={[styles.summaryBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.summaryHeader}>
                      <Info size={14} color={theme.textSecondary} />
                      <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>RINGKASAN HARI INI</Text>
                  </View>
                  <View style={styles.summaryRow}>
                      <View style={styles.sumItem}>
                          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                              <TrendingUp size={14} color={theme.positive} />
                          </View>
                          <View>
                              <Text style={[styles.sumLabel, { color: theme.textSecondary }]}>Pemasukan</Text>
                              <Text style={[styles.sumValue, { color: theme.positive }]}>+Rp {dailySummary.income.toLocaleString('id-ID')}</Text>
                          </View>
                      </View>
                      <View style={[styles.vDivider, { backgroundColor: theme.border }]} />
                      <View style={styles.sumItem}>
                          <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                              <TrendingDown size={14} color={theme.negative} />
                          </View>
                          <View>
                              <Text style={[styles.sumLabel, { color: theme.textSecondary }]}>Pengeluaran</Text>
                              <Text style={[styles.sumValue, { color: theme.negative }]}>-Rp {dailySummary.expense.toLocaleString('id-ID')}</Text>
                          </View>
                      </View>
                  </View>
              </View>
            </View>

            <View style={styles.listHeaderRow}>
                <Text style={[styles.listHeader, { color: theme.text }]}>{formatDateLabel(selectedDate)}</Text>
                <View style={[styles.countBadge, { backgroundColor: theme.primary }]}>
                    <Text style={styles.countText}>{filteredTransactions.length}</Text>
                </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: theme.card }]}>
                <CalendarIcon size={40} color={theme.textSecondary} strokeWidth={1} />
            </View>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Tidak ada aktivitas tercatat pada tanggal ini.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 25, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  headerSub: { fontSize: 13, marginTop: 4, fontWeight: '600' },
  dateIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  calendarCard: { marginHorizontal: 25, borderRadius: 28, padding: 10, borderWidth: 1.5, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  summaryContainer: { padding: 25 },
  summaryBox: { padding: 18, borderRadius: 22, borderWidth: 1.5 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  summaryTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sumItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sumLabel: { fontSize: 10, fontWeight: '700', marginBottom: 2 },
  sumValue: { fontSize: 14, fontWeight: '800' },
  vDivider: { width: 1.5, height: 30, marginHorizontal: 10 },
  listHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  listHeader: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8 },
  countText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  listContent: { paddingHorizontal: 25, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emptyText: { fontSize: 13, fontWeight: '600', textAlign: 'center', width: '70%' }
});

export default CalendarScreen;
