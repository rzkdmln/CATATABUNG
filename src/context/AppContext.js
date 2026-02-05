import React, { createContext, useState, useEffect, useContext } from 'react';
import * as db from '../database/db';
import { supabase } from '../database/supabaseClient';
import { getData, saveData } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState({ name: '', profileImage: null });
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleInitialAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!existingSession) {
          // Sign in anonymously as fallback if anon sign-in is enabled in Supabase
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.warn("Anonymous Sign-in skipped (might be disabled):", error.message);
            // Don't block loading if it fails, just wait for potential manual login
            setLoading(false);
          } else {
            setSession(data.session);
          }
        } else {
          setSession(existingSession);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setLoading(false);
      }
    };

    handleInitialAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Update user state from auth session
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          profileImage: session.user.user_metadata?.avatar_url || null,
          email: session.user.email
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadInitialData();
    }
  }, [session]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [remoteTransactions, remoteGoals] = await Promise.all([
        db.db_getTransactions(),
        db.db_getGoals()
      ]);
      
      const savedUser = await getData('user_profile');
      const savedOnboarding = await getData('onboarding_status');
      
      if (remoteTransactions) setTransactions(remoteTransactions);
      if (remoteGoals) setGoals(remoteGoals);
      
      // If we have a session user, prioritize it over local storage
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          profileImage: session.user.user_metadata?.avatar_url || null,
          email: session.user.email
        });
      } else if (savedUser) {
        setUser(savedUser);
      }

      if (savedOnboarding) setIsOnboarded(savedOnboarding);
      
    } catch (e) {
      console.error("Load initial data error:", e);
    } finally {
      // Small timeout to prevent UI flickering
      setTimeout(() => setLoading(false), 500);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // For Web/PWA
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google Login Error:", err.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser({ name: '', profileImage: null });
    setIsOnboarded(false);
    await saveData('onboarding_status', false);
  };

  const completeOnboarding = async (name) => {
    // Implementasi Auth Supabase (Bisa menggunakan Anonymous atau Email)
    // Untuk demo ini, kita asumsikan user disimpan di state global
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
    try {
      const id = await db.db_addTransaction(tx);
      const newTx = { ...tx, id };
      setTransactions([newTx, ...transactions]);
    } catch (err) {
      console.error("Add transaction failed", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await db.db_deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const addGoal = async (goal) => {
    try {
      const id = await db.db_addGoal(goal);
      const newGoal = { ...goal, id, currentAmount: 0 };
      setGoals([...goals, newGoal]);
    } catch (err) {
      console.error("Add goal failed", err);
    }
  };

  const updateGoalProgress = async (goalId, amount) => {
    try {
      await db.db_updateGoalProgress(goalId, amount);
      setGoals(goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
    } catch (err) {
      console.error("Update progress failed", err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await db.db_deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      console.error("Delete goal failed", err);
    }
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
      session,
      addTransaction,
      deleteTransaction,
      addGoal,
      deleteGoal,
      updateGoalProgress,
      getBalance,
      completeOnboarding,
      updateUser,
      setSecurity,
      unlockApp,
      signInWithGoogle,
      logout,
      refreshData: loadInitialData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
