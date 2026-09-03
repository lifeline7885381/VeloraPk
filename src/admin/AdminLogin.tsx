import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { ThreeDMonogram } from '../components/ThreeDMonogram';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: { email: string; name: string }) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('admin@velorapk.com');
  const [password, setPassword] = useState('VeloraAdmin2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication rejected by security vault.');
      }

      localStorage.setItem('velora_admin_token', data.token);
      localStorage.setItem('velora_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5D76E] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#D4AF37]/30">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Store Top Bar */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-serif-lux uppercase tracking-[0.2em] text-[#F5D76E]/70 hover:text-[#FFD700] transition-colors p-2 rounded-lg bg-[#0B0B0B]/80 border border-[#D4AF37]/20 hover:border-[#FFD700]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Store</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-[#0B0B0B] border border-[#D4AF37]/40 rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] relative">
          {/* Header Monogram & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
              <ThreeDMonogram size="nav" interactive={false} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#D4AF37]/30 text-[#FFD700] text-[10px] uppercase font-serif-lux tracking-[0.25em] mb-2">
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              Sovereign Administration Vault
            </div>

            <h1 className="font-serif-lux font-bold text-2xl sm:text-3xl text-white tracking-[0.1em]">
              VELORA <span className="text-[#FFD700]">PK</span>
            </h1>
            <p className="text-xs text-[#F5D76E]/60 mt-1 font-sans">
              Authorized Personnel & Inventory Management Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-serif-lux uppercase tracking-[0.15em] text-[#F5D76E]/90 mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@velorapk.com"
                  className="w-full bg-[#111] border border-[#D4AF37]/30 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] rounded-xl px-4 py-3 text-sm text-white placeholder-[#F5D76E]/30 outline-none transition-all"
                />
                <KeyRound className="w-4 h-4 text-[#D4AF37]/50 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif-lux uppercase tracking-[0.15em] text-[#F5D76E]/90 mb-1.5">
                Master Security Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111] border border-[#D4AF37]/30 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] rounded-xl px-4 py-3 text-sm text-white placeholder-[#F5D76E]/30 outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-[#D4AF37]/50 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="p-3 bg-[#131313] border border-[#D4AF37]/20 rounded-xl text-[11px] text-[#F5D76E]/70 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFD700] font-medium font-serif-lux tracking-wider">
                <Sparkles className="w-3 h-3" />
                Default Guild Credentials:
              </div>
              <div className="font-mono text-[10px] text-zinc-300 flex flex-col gap-0.5">
                <span>User: <strong className="text-[#FFD700]">admin@velorapk.com</strong></span>
                <span>Pass: <strong className="text-[#FFD700]">VeloraAdmin2026!</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#AA771C] text-black font-serif-lux font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#D4AF37]/15 text-center">
            <span className="text-[10px] font-serif-lux tracking-widest text-[#D4AF37]/50 uppercase">
              Encrypted Sovereign Database Connection • SQLite 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
