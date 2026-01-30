import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import TransactionCard from '../components/TransactionCard';
import GoalProgress from '../components/GoalProgress';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Bell } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  const { getBalance, transactions, goals, user } = useAppContext();
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const formatIDR = (val) => {
    return 'Rp ' + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // 1. Data untuk Pie Chart (Aliran Dana per Kategori)
  const pieData = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      const cat = tx.category || 'Lainnya';
      categories[cat] = (categories[cat] || 0) + tx.amount;
    });

    return Object.keys(categories).map((key, index) => ({
      name: key,
      amount: categories[key],
      color: theme.charts[index % theme.charts.length],
      legendFontColor: theme.text,
      legendFontSize: 10,
    }));
  }, [transactions, theme]);

  // 2. Data untuk Line Chart (Tren Saldo)
  const lineData = useMemo(() => {
    if (transactions.length === 0) return { labels: ["-"], datasets: [{ data: [0] }] };
    
    // Sort transactions by data (simple simulation for trend)
    const sorted = [...transactions].reverse();
    let currentBalance = 0;
    const history = sorted.map(tx => {
      currentBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      return currentBalance / 1000; // in thousands
    });

    return {
      labels: sorted.slice(-5).map(t => t.date.split('/')[0]),
      datasets: [{ data: history.slice(-5) }]
    };
  }, [transactions]);

  // 3. Data untuk Bar Chart (Income vs Expense)
  const barData = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += tx.amount;
      else exp += tx.amount;
    });

    return {
      labels: ["Masuk", "Keluar"],
      datasets: [{ data: [inc / 1000, exp / 1000] }]
    };
  }, [transactions]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => theme.accent,
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.primary }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Profil */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>Halo, {user?.name || 'Rizki'}</Text>
            <Text style={[styles.subtitle, { color: theme.accent }]}>Waktunya atur strategi finansial!</Text>
          </View>
          <View style={styles.headerIcons}>
             <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.card }]}>
                <Bell size={20} color={theme.text} />
             </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
               <Image 
                source={user?.profileImage ? { uri: user.profileImage } : { uri: 'https://via.placeholder.com/100' }} 
                style={[styles.avatar, { borderColor: theme.border }]} 
               />
             </TouchableOpacity>
          </View>
        </View>

        {/* Total Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.text }]}>
          <View style={styles.balanceHeader}>
            <Wallet color={theme.background} size={20} />
            <Text style={[styles.balanceLabel, { color: theme.background }]}>Total Kekayaan Bersih</Text>
          </View>
          <Text style={[styles.balanceValue, { color: theme.background }]}>{formatIDR(getBalance())}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.stat}>
               <TrendingUp size={14} color={theme.positive} />
               <Text style={[styles.statText, { color: theme.background }]}>Laporan aman hari ini</Text>
            </View>
            <TouchableOpacity style={styles.detailsBtn}>
               <Text style={{ color: theme.background, fontWeight: '700', fontSize: 12 }}>Rincian</Text>
               <ArrowRight size={14} color={theme.background} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Section - Horizontal Scroll */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Analisis Keuangan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartsScroll}>
            {/* Pie Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>Distribusi Pengeluaran</Text>
              {pieData.length > 0 ? (
                <PieChart
                  data={pieData}
                  width={screenWidth - 80}
                  height={160}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              ) : (
                <Text style={styles.noData}>Belum ada data pengeluaran</Text>
              )}
            </View>

            {/* Line Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>Tren Pertumbuhan (k)</Text>
              <LineChart
                data={lineData}
                width={screenWidth - 80}
                height={160}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            {/* Bar Chart */}
            <View style={[styles.chartBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>In vs Out (ribuan)</Text>
              <BarChart
                data={barData}
                width={screenWidth - 80}
                height={160}
                chartConfig={chartConfig}
                style={styles.chart}
                flatColor={true}
                fromZero={true}
              />
            </View>
          </ScrollView>
        </View>

        {/* Target Tabungan (Interaktif) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Target Tabungan</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tabungan')}>
              <Text style={{ color: theme.accent, fontSize: 12 }}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {goals.length > 0 ? (
            goals.slice(0, 1).map(goal => (
              <GoalProgress key={goal.id} goal={goal} />
            ))
          ) : (
            <TouchableOpacity style={[styles.emptyBox, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Tabungan')}>
               <Text style={{ color: theme.accent }}>Mulai buat impianmu hari ini +</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Aktivitas Terakhir */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktivitas Terakhir</Text>
          {transactions.slice(0, 5).map(tx => (
            <TransactionCard key={tx.id} item={tx} />
          ))}
          {transactions.length === 0 && (
            <Text style={[styles.noData, { textAlign: 'left' }]}>Catatanmu masih kosong.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
  greeting: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 4 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 10, borderRadius: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  balanceCard: { marginHorizontal: 25, borderRadius: 24, padding: 25, marginBottom: 25 },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.8 },
  balanceLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceValue: { fontSize: 32, fontWeight: '900', marginVertical: 15 },
  balanceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 11, fontWeight: '500' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  section: { paddingHorizontal: 25, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  chartsScroll: { marginLeft: -5 },
  chartBox: { width: screenWidth - 50, padding: 20, borderRadius: 24, marginRight: 15 },
  chartTitle: { fontSize: 14, fontWeight: '700', marginBottom: 15 },
  chart: { marginTop: 10, marginLeft: -20 },
  noData: { color: '#888', textAlign: 'center', marginTop: 30, fontSize: 13 },
  emptyBox: { padding: 25, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderStyle: 'dotted', borderWidth: 1 }
});

export default DashboardScreen;
