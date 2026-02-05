import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah dengan URL dan Anon Key dari dashboard Supabase Anda
// Sangat disarankan menggunakan variabel environment (.env) untuk keamanan
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase keys are missing. Please check your environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
