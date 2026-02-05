import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Gunakan import.meta.env untuk Vite dengan fallback manual jika env tidak terbaca
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ptyxgondeayaqxswbtgk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eXhnb25kZWF5YXF4c3didGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzIzODMsImV4cCI6MjA4NTgwODM4M30.y5dQNyU7VgbMHHkgoB1U4YhTSsQ8bJc3SCSTJWZfO8c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
