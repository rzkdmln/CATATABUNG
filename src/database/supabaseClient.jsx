import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah dengan URL dan Anon Key dari dashboard Supabase Anda
// Sangat disarankan menggunakan variabel environment (.env) untuk keamanan
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
