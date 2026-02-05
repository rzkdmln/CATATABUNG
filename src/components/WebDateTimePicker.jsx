import React from 'react';
import { View, TextInput } from 'react-native';

const WebDateTimePicker = ({ value, mode, onChange, display, is24Hour }) => {
  const handleChange = (event) => {
    const newVal = event.target.value;
    if (!newVal) return;
    
    let date;
    if (mode === 'time') {
      const [hours, minutes] = newVal.split(':');
      date = new Date(value);
      date.setHours(parseInt(hours), parseInt(minutes));
    } else {
      date = new Date(newVal);
    }
    
    onChange({ type: 'set' }, date);
  };

  const formatValue = () => {
    if (!value) return '';
    if (mode === 'time') {
      return value.getHours().toString().padStart(2, '0') + ':' + value.getMinutes().toString().padStart(2, '0');
    }
    return value.toISOString().split('T')[0];
  };

  return (
    <input
      type={mode === 'time' ? 'time' : 'date'}
      value={formatValue()}
      onChange={handleChange}
      style={{
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        width: '100%',
        marginTop: '10px'
      }}
    />
  );
};

export default WebDateTimePicker;
