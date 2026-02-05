import { supabase } from './supabaseClient';

// Helper untuk mendapatkan user_id (Bisa dikembangkan lebih lanjut dengan Auth)
const getUserId = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user?.id || null;
    } catch (err) {
        console.error("Error fetching user ID:", err);
        return null;
    }
};

export const initDB = async () => {
    // Di Supabase, inisialisasi tabel dilakukan via SQL Editor Dashboard
    console.log("Supabase Connection Initialized");
    return true;
};

// Transaction CRUD
export const db_addTransaction = async (tx) => {
    try {
        const userId = await getUserId();
        if (!userId) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id: userId,
                title: tx.title,
                amount: tx.amount,
                type: tx.type, // 'income' atau 'expense'
                category: tx.category,
                date: tx.date || new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0].id;
    } catch (err) {
        console.error("Database Error (addTransaction):", err);
        throw err;
    }
};

export const db_getTransactions = async () => {
    try {
        const userId = await getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Database Error (getTransactions):", err);
        return [];
    }
};

export const db_deleteTransaction = async (id) => {
    try {
        const userId = await getUserId();
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Security check
        
        if (error) throw error;
    } catch (err) {
        console.error("Database Error (deleteTransaction):", err);
        throw err;
    }
};

// Goals CRUD
export const db_addGoal = async (goal) => {
    try {
        const userId = await getUserId();
        if (!userId) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('goals')
            .insert([{
                user_id: userId,
                title: goal.title,
                target_amount: goal.targetAmount,
                current_amount: 0,
                deadline: goal.deadline,
                reminder_time: goal.reminderTime
            }])
            .select();
        
        if (error) throw error;
        return data[0].id;
    } catch (err) {
        console.error("Database Error (addGoal):", err);
        throw err;
    }
};

export const db_getGoals = async () => {
    try {
        const userId = await getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        
        return data.map(g => ({
            ...g,
            targetAmount: g.target_amount,
            currentAmount: g.current_amount,
            reminderTime: g.reminder_time
        }));
    } catch (err) {
        console.error("Database Error (getGoals):", err);
        return [];
    }
};

export const db_updateGoalProgress = async (id, amount) => {
    try {
        const userId = await getUserId();
        // Dapatkan data terlama dulu untuk menambah nilai
        const { data: current, error: fetchError } = await supabase
            .from('goals')
            .select('current_amount')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from('goals')
            .update({ current_amount: (current.current_amount || 0) + amount })
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) throw error;
    } catch (err) {
        console.error("Database Error (updateGoalProgress):", err);
        throw err;
    }
};

export const db_deleteGoal = async (id) => {
    try {
        const userId = await getUserId();
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) throw error;
    } catch (err) {
        console.error("Database Error (deleteGoal):", err);
        throw err;
    }
};

// Settings CRUD
export const db_setSetting = async (key, value) => {
    // Settings bisa disimpan di tabel settings jika dibuat, 
    // atau tetap di local storage jika bersifat device-specific.
    // Di sini kita biarkan placeholder atau simpan ke table 'user_settings'
    console.log("Setting updated:", key, value);
};

export const db_getSetting = async (key) => {
    return null; 
};
