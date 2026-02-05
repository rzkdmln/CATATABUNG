import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Tag } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { formatRupiah } from '../utils/format';

const TransactionCard = ({ item }) => {
  const { theme } = useTheme();
  const isIncome = item.type === 'income';
  const EMERALD = '#10b981';
  const ROSE = '#f43f5e';
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
        {isIncome ? (
          <ArrowUpRight size={18} color={EMERALD} />
        ) : (
          <ArrowDownLeft size={18} color={ROSE} />
        )}
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRow}>
            <View style={[styles.tag, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Tag size={10} color={theme.accent} />
                <Text style={[styles.category, { color: theme.accent }]}>{item.category || 'Umum'}</Text>
            </View>
            <Text style={[styles.date, { color: theme.accent }]}>
                {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
            </Text>
        </View>
      </View>
      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: isIncome ? EMERALD : ROSE }]}>
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
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  date: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.6
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '900',
  },
});

export default TransactionCard;
