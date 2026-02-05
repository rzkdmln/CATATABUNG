import { supabase } from './supabaseClient';

// Helper untuk mendapatkan user_id (Bisa dikembangkan lebih lanjut dengan Auth)
const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
};

export const initDB = async () => {
    // Di Supabase, inisialisasi tabel dilakukan via SQL Editor Dashboard
    // Fungsi ini dikosongkan namun tetap ada agar tidak error di AppContext
    console.log("Supabase Connection Initialized");
    return true;
};

// Transaction CRUD
export const db_addTransaction = async (tx) => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            user_id: userId,
            title: tx.title,
            amount: tx.amount,
            type: tx.type, // 'income' atau 'expense'
            category: tx.category,
            date: tx.date // Format ISO String
        }])
        .select();
    
    if (error) throw error;
    return data[0].id;
};

export const db_getTransactions = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
};

export const db_deleteTransaction = async (id) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
};

// Goals CRUD
export const db_addGoal = async (goal) => {
    const userId = await getUserId();
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
};

export const db_getGoals = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);
    
    if (error) throw error;
    
    // Map back to camelCase for UI compatibility if needed
    return data.map(g => ({
        ...g,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount,
        reminderTime: g.reminder_time
    }));
};

export const db_updateGoalProgress = async (id, amount) => {
    // Dapatkan data terlama dulu untuk menambah nilai
    const { data: current } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('id', id)
        .single();

    const { error } = await supabase
        .from('goals')
        .update({ current_amount: (current.current_amount || 0) + amount })
        .eq('id', id);
    
    if (error) throw error;
};

export const db_deleteGoal = async (id) => {
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
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
