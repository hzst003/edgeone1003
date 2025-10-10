'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function AuthButton() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signUp({
      email: emailInput,
      password: passwordInput,
    });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
<div className="flex flex-col gap-4 bg-gray-100 p-6 rounded-xl shadow-lg w-96">
  <h2 className="text-xl font-bold text-gray-800 text-center">Supabase Hello</h2>

  <input
    type="email"
    placeholder="Email"
    value={emailInput}
    onChange={e => setEmailInput(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50 text-gray-800"
  />

  <input
    type="password"
    placeholder="Password"
    value={passwordInput}
    onChange={e => setPasswordInput(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50 text-gray-800"
  />

  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

  <div className="flex gap-2">
    <button
      onClick={signIn}
      disabled={loading}
      className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 shadow-sm transition-colors"
    >
      Sign In
    </button>
    <button
      onClick={signUp}
      disabled={loading}
      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 shadow-sm transition-colors"
    >
      Sign Up
    </button>
  </div>
</div>

  );
}
