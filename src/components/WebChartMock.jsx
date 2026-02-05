import React from 'react';
import { View, Text } from 'react-native';

const MockChart = (props) => (
  <View style={{ height: 220, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginVertical: 10 }}>
    <Text style={{ color: '#666', fontWeight: 'bold' }}>[ Chart: {props.data?.labels?.length || 0} Data Points ]</Text>
  </View>
);

export const BarChart = MockChart;
export const LineChart = MockChart;
export const PieChart = MockChart;
export const ContributionGraph = MockChart;
export const StackedBarChart = MockChart;
