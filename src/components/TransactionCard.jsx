import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Tag, Calendar as CalendarIcon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { formatRupiah } from '../utils/format';

const TransactionCard = ({ item }) => {
  const { theme } = useTheme();
  const isIncome = item.type === 'income';
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
        {isIncome ? (
          <ArrowUpRight size={20} color={theme.positive} strokeWidth={2.5} />
        ) : (
          <ArrowDownLeft size={20} color={theme.negative} strokeWidth={2.5} />
        )}
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRow}>
            <View style={styles.metaItem}>
                <Tag size={12} color={theme.textSecondary} />
                <Text style={[styles.category, { color: theme.textSecondary }]}>{item.category || 'Umum'}</Text>
            </View>
            <View style={[styles.dot, { backgroundColor: theme.border }]} />
            <View style={styles.metaItem}>
                <CalendarIcon size={12} color={theme.textSecondary} />
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                    {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                </Text>
            </View>
        </View>
      </View>
      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: isIncome ? theme.positive : theme.negative }]}>
            {isIncome ? '+' : '-'} {formatRupiah(item.amount).replace('Rp ', '')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
  },
  amountCol: {
    alignItems: 'flex-end',
    marginLeft: 10
  },
  amount: {
    fontSize: 16,
    fontWeight: '900',
  },
});

export default TransactionCard;
