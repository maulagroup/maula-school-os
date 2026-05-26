'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.from('roles').select('count');
        
        if (error) {
          setStatus('error');
          setMessage(`Error: ${error.message}`);
        } else {
          setStatus('success');
          setMessage('Koneksi Supabase berhasil!');
        }
      } catch (err) {
        setStatus('error');
        setMessage(`Error: ${(err as Error).message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
        
        {status === 'loading' && (
          <div className="text-gray-600">Testing connection...</div>
        )}
        
        {status === 'success' && (
          <div className="text-green-600 font-medium">{message}</div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600 font-medium">{message}</div>
        )}
      </div>
    </div>
  );
}
