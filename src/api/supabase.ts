import { createClient } from '@supabase/supabase-js';

// Vite 환경과 Node.js 환경 모두에서 작동하도록 수정
const getEnv = (key: string, defaultValue: string) => {
  // Vite 환경 (브라우저)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  // Node.js 환경 (스크립트)
  return process.env[key] || defaultValue;
};

// 환경 변수를 사용할 수 없는 경우 직접 값을 사용합니다
const supabaseUrl = getEnv('VITE_SUPABASE_URL', '');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
