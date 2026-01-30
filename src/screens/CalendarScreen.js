import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import TransactionCard from '../components/TransactionCard';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

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
      const parts = tx.date.split('/');
      if (parts.length === 3) {
        const isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        marks[isoDate] = { 
          marked: true, 
          dotColor: tx.type === 'income' ? theme.positive : theme.negative 
        };
      }
    });

    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: theme.text,
      selectedTextColor: theme.background 
    };
    return marks;
  }, [transactions, selectedDate, theme]);

  const filteredTransactions = transactions.filter(tx => {
    const parts = tx.date.split('/');
    if (parts.length === 3) {
       const isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Kalender Pro</Text>
        <Text style={[styles.headerSub, { color: theme.accent }]}>Manajemen keuangan berbasis waktu</Text>
      </View>
      
      <View style={[styles.calendarBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Calendar
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: theme.text,
            selectedDayBackgroundColor: theme.text,
            selectedDayTextColor: theme.background,
            todayTextColor: theme.positive,
            dayTextColor: theme.text,
            textDisabledColor: theme.accent,
            dotColor: theme.positive,
            monthTextColor: theme.text,
            indicatorColor: theme.text,
            arrowColor: theme.text,
            textDayFontWeight: '600',
            textMonthFontWeight: '900',
            textDayHeaderFontWeight: '700',
          }}
          markedDates={markedDates}
          onDayPress={day => setSelectedDate(day.dateString)}
          enableSwipeMonths={true}
          renderArrow={(dir) => dir === 'left' ? <ChevronLeft size={20} color={theme.text} /> : <ChevronRight size={20} color={theme.text} />}
        />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
             <Text style={[styles.sumLabel, { color: theme.accent }]}>Pemasukan hari ini</Text>
             <Text style={[styles.sumValue, { color: theme.positive }]}>+Rp {dailySummary.income.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
             <Text style={[styles.sumLabel, { color: theme.accent }]}>Pengeluaran hari ini</Text>
             <Text style={[styles.sumValue, { color: theme.negative }]}>-Rp {dailySummary.expense.toLocaleString()}</Text>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TransactionCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={[styles.listHeader, { color: theme.text }]}>Detail Aktivitas</Text>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.accent }]}>Hening... Tidak ada aktivitas tercatat.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25 },
  headerTitle: { fontSize: 26, fontWeight: '900' },
  headerSub: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  calendarBox: { marginHorizontal: 20, borderRadius: 24, padding: 10, borderWidth: 1, overflow: 'hidden' },
  summaryRow: { flexDirection: 'row', padding: 25, gap: 15 },
  summaryItem: { flex: 1 },
  sumLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 5 },
  sumValue: { fontSize: 16, fontWeight: '800' },
  listHeader: { fontSize: 14, fontWeight: '800', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  listContent: { padding: 25, paddingTop: 0 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 13, fontStyle: 'italic', fontWeight: '500' }
});

export default CalendarScreen;
