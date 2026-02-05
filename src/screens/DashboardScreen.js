import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import TransactionCard from '../components/TransactionCard';
import GoalProgress from '../components/GoalProgress';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Bell, User2, LogOut } from 'lucide-react-native';
import { formatRupiah } from '../utils/format';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  const { getBalance, transactions, goals, user, loading, refreshData, logout } = useAppContext();
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Use theme colors directly from theme object
  const EMERALD = theme.positive;
  const ROSE = theme.negative;

  // 1. Data untuk Pie Chart (Aliran Dana per Kategori)
  const pieData = useMemo(() => {
    const categories = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return [];

    expenses.forEach(tx => {
      const cat = tx.category || 'Lainnya';
      categories[cat] = (categories[cat] || 0) + tx.amount;
    });

    return Object.keys(categories).map((key, index) => ({
      name: key,
      amount: categories[key],
      color: theme.charts[index % theme.charts.length],
      legendFontColor: theme.text,
      legendFontSize: 11,
    }));
  }, [transactions, theme]);

  // 2. Data untuk Line Chart (Tren Saldo)
  const lineData = useMemo(() => {
    if (transactions.length === 0) return { labels: ["-"], datasets: [{ data: [0] }] };
    
    const sorted = [...transactions].reverse();
    let currentBalance = 0;
    const history = sorted.map(tx => {
      currentBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      return currentBalance / 1000;
    });

    return {
      labels: sorted.slice(-6).map(t => {
        if (!t.date) return '-';
        const day = t.date.split('T')[0].split('-')[2];
        return day;
      }),
      datasets: [{ 
        data: history.slice(-6),
        color: (opacity = 1) => theme.primary,
        strokeWidth: 3
      }]
    };
  }, [transactions, theme.primary]);

  // 3. Data untuk Bar Chart (Income vs Expense)
  const barData = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += tx.amount;
      else exp += tx.amount;
    });

    return {
      labels: ["Masuk", "Keluar"],
      datasets: [{ 
        data: [inc / 1000, exp / 1000],
        colors: [
            (opacity = 1) => EMERALD,
            (opacity = 1) => ROSE
        ]
      }]
    };
  }, [transactions, EMERALD, ROSE]);

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => theme.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: theme.primary },
    propsForLabels: { fontSize: 10 }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
         <Text style={{ color: theme.textSecondary }}>Menyiapkan data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {/* Header Profil */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('Profil')} style={styles.avatarContainer}>
               {user?.profileImage ? (
                 <Image source={{ uri: user.profileImage }} style={[styles.avatar, { borderColor: theme.border }]} />
               ) : (
                 <View style={[styles.avatarPlaceholder, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <User2 size={24} color={theme.primary} />
                 </View>
               )}
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: theme.text }]}>Halo, {user?.name || 'Rizki'}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Strategi finansial hari ini?</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
             <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.card }]}>
                <Bell size={20} color={theme.text} />
             </TouchableOpacity>
          </View>
        </View>

        {/* Total Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
          <View style={styles.balanceHeader}>
            <Wallet color="rgba(255,255,255,0.8)" size={18} />
            <Text style={[styles.balanceLabel, { color: 'rgba(255,255,255,0.8)' }]}>Total Kekayaan Bersih</Text>
          </View>
          <Text style={[styles.balanceValue, { color: '#fff' }]}>{formatRupiah(getBalance())}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.stat}>
               <TrendingUp size={14} color="#10B981" />
               <Text style={[styles.statText, { color: '#fff' }]}>Laporan aman hari ini</Text>
            </View>
            <TouchableOpacity style={styles.detailsBtn} onPress={() => navigation.navigate('Riwayat')}>
               <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Rincian</Text>
               <ArrowRight size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Analisis Keuangan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartsScroll} snapToInterval={screenWidth - 35} decelerationRate="fast">
            {/* Pie Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>Alokasi Pengeluaran</Text>
              {pieData.length > 0 ? (
                <PieChart
                  data={pieData}
                  width={screenWidth - 90}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={[styles.noData, { color: theme.textSecondary }]}>Belum ada data pengeluaran</Text>
                </View>
              )}
            </View>

            {/* Line Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>Tren Saldo (IDR k)</Text>
              <LineChart
                data={lineData}
                width={screenWidth - 80}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={false}
              />
            </View>

            {/* Bar Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>Income vs Expense (k)</Text>
              <BarChart
                data={barData}
                width={screenWidth - 80}
                height={180}
                chartConfig={chartConfig}
                style={styles.chart}
                flatColor={true}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />
            </View>
          </ScrollView>
        </View>

        {/* Target Tabungan */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Target Tabungan</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tabungan')}>
              <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {goals.length > 0 ? (
            goals.slice(0, 2).map(goal => (
              <GoalProgress key={goal.id} goal={goal} />
            ))
          ) : (
            <TouchableOpacity style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => navigation.navigate('Tabungan')}>
               <Text style={{ color: theme.textSecondary }}>Mulai buat impianmu hari ini +</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Aktivitas Terakhir */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktivitas Terakhir</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Riwayat')}>
               <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>Semua</Text>
            </TouchableOpacity>
          </View>
          {transactions.slice(0, 5).map(tx => (
            <TransactionCard key={tx.id} item={tx} />
          ))}
          {transactions.length === 0 && (
            <Text style={[styles.noData, { textAlign: 'left', marginTop: 10 }]}>Catatanmu masih kosong.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  greeting: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarContainer: { width: 48, height: 48, borderRadius: 16, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%', borderWidth: 1.5 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 16, borderWeight: 1, justifyContent: 'center', alignItems: 'center' },
  iconBtn: { padding: 10, borderRadius: 14 },
  balanceCard: { marginHorizontal: 20, borderRadius: 28, padding: 25, marginBottom: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceLabel: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  balanceValue: { fontSize: 34, fontWeight: '900', marginVertical: 12, letterSpacing: -1 },
  balanceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 18 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 12, fontWeight: '500' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  section: { paddingHorizontal: 25, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
  chartsScroll: { marginLeft: -5, paddingRight: 25 },
  chartBox: { width: screenWidth - 50, padding: 20, borderRadius: 24, marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  chartTitle: { fontSize: 15, fontWeight: '700', marginBottom: 20 },
  chart: { marginTop: 10, marginLeft: -15 },
  emptyChart: { height: 180, justifyContent: 'center', alignItems: 'center' },
  noData: { color: '#888', fontSize: 13 },
  emptyBox: { padding: 30, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5 }
});

export default DashboardScreen;
