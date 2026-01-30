import React, { createContext, useState, useEffect, useContext } from 'react';
import * as db from '../database/db';
import { getData, saveData } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState({ name: '', profileImage: null });
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await db.initDB();
      const sqliteTransactions = await db.db_getTransactions();
      const sqliteGoals = await db.db_getGoals();
      
      const savedUser = await getData('user_profile');
      const savedOnboarding = await getData('onboarding_status');
      const pinEnabled = await db.db_getSetting('pin_enabled');
      
      if (sqliteTransactions) setTransactions(sqliteTransactions);
      if (sqliteGoals) setGoals(sqliteGoals);
      if (savedUser) setUser(savedUser);
      if (savedOnboarding) setIsOnboarded(savedOnboarding);
      if (pinEnabled === 'true') setIsLocked(true);
      
    } catch (e) {
      console.error("Load data error", e);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (name) => {
    const userData = { name, profileImage: null };
    setUser(userData);
    setIsOnboarded(true);
    await saveData('user_profile', userData);
    await saveData('onboarding_status', true);
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await saveData('user_profile', newUser);
  };

  const addTransaction = async (tx) => {
    const id = await db.db_addTransaction(tx);
    const newTx = { ...tx, id };
    setTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = async (id) => {
    await db.db_deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = async (goal) => {
    const id = await db.db_addGoal(goal);
    const newGoal = { ...goal, id, currentAmount: 0 };
    setGoals([...goals, newGoal]);
  };

  const updateGoalProgress = async (goalId, amount) => {
    await db.db_updateGoalProgress(goalId, amount);
    setGoals(goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
  };

  const deleteGoal = async (id) => {
    await db.db_deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  const setSecurity = async (enabled) => {
    await db.db_setSetting('pin_enabled', enabled ? 'true' : 'false');
  };

  const unlockApp = () => setIsLocked(false);

  return (
    <AppContext.Provider value={{
      transactions,
      goals,
      user,
      isOnboarded,
      isLocked,
      loading,
      addTransaction,
      deleteTransaction,
      addGoal,
      deleteGoal,
      updateGoalProgress,
      getBalance,
      completeOnboarding,
      updateUser,
      setSecurity,
      unlockApp
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
