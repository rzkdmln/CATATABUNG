import React from 'react';
import { View, Text } from 'react-native';

export const Calendar = () => (
  <View style={{ padding: 20, backgroundColor: '#f9f9f9', borderRadius: 15, alignItems: 'center' }}>
    <Text style={{ fontWeight: 'bold' }}>[ Kalender Web ]</Text>
    <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>Fitur kalender interaktif sedang dalam sinkronisasi web.</Text>
  </View>
);

export const CalendarList = Calendar;
export const Agenda = Calendar;
export const LocaleConfig = {
  locales: {},
  defaultLocale: ''
};
