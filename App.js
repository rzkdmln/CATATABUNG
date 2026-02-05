import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import CategorySettingsScreen from './src/screens/CategorySettingsScreen';
import VersionHistoryScreen from './src/screens/VersionHistoryScreen';

// Import Context
import { AppProvider, useAppContext } from './src/context/AppContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="CategorySettings" component={CategorySettingsScreen} />
      <Stack.Screen name="VersionHistory" component={VersionHistoryScreen} />
    </Stack.Navigator>
  );
};

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
      <SecurityScreen />
    );
  }

  return (
    <NavigationContainer>
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
          component={ProfileStack} 
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

