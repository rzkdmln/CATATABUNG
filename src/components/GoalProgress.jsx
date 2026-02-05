import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const GoalProgress = ({ goal }) => {
  const { theme } = useTheme();
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>
        <Text style={[styles.amount, { color: theme.textSecondary }]}>
           Rp {goal.currentAmount.toLocaleString()} / Rp {goal.targetAmount.toLocaleString()}
        </Text>
      </View>
      <View style={[styles.progressBarBackground, { backgroundColor: theme.border }]}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: theme.text }]} />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.percentageText, { color: theme.accent }]}>{percentage.toFixed(0)}% Tercapai</Text>
        {percentage >= 100 && <Text style={styles.completedTag}>GOAL!</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 12,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
  },
  completedTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4CAF50',
  }
});

export default GoalProgress;
