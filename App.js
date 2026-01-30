import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { LayoutDashboard, Receipt, Target, Calendar, User, CircleHelp } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import SavingGoalsScreen from './src/screens/SavingGoalsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SecurityScreen from './src/screens/SecurityScreen';

// Import Context
import { AppProvider, useAppContext } from './src/context/AppContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const { isOnboarded, loading, isLocked } = useAppContext();
  const { theme, isDark } = useTheme();

  if (loading) return null;

  // 1. Check Onboarding
  if (!isOnboarded) {
    return <OnboardingScreen />;
  }

  // 2. Check Security Lock
  if (isLocked) {
    return (
      <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <SecurityScreen />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            height: 70,
            paddingBottom: 15,
            paddingTop: 10,
          },
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.accent,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{
            tabBarIcon: ({ color, size }) => {
              const Icon = LayoutDashboard || CircleHelp;
              return <Icon size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen 
          name="Transaksi" 
          component={TransactionScreen} 
          options={{
            tabBarIcon: ({ color, size }) => {
              const Icon = Receipt || CircleHelp;
              return <Icon size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen 
          name="Kalender" 
          component={CalendarScreen} 
          options={{
            tabBarIcon: ({ color, size }) => {
              const Icon = Calendar || CircleHelp;
              return <Icon size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen 
          name="Tabungan" 
          component={SavingGoalsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => {
              const Icon = Target || CircleHelp;
              return <Icon size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, size }) => {
              const Icon = User || CircleHelp;
              return <Icon size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

