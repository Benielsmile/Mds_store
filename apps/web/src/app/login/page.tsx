'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Loader2, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const redirectTo = new URL('/auth/callback', location.origin);
    const from = new URLSearchParams(location.search).get('from') || '/';
    redirectTo.searchParams.set('next', from);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo.toString() } });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('');
    const redirectTo = new URL('/auth/callback', location.origin);
    const from = new URLSearchParams(location.search).get('from') || '/';
    redirectTo.searchParams.set('next', from);
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: redirectTo.toString() } });
    if (error) setError(error.message);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--color-bg)' }}>
      <div className="noise-overlay" />

      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,69,19,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              MDS<span style={{ color: 'var(--color-accent-light)' }}>Store</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Sign in to access your purchases</p>
        </div>

        <div className="card" style={{ padding: '2rem', overflow: 'hidden' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Mail size={24} color="var(--color-accent-light)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Check your email!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>We sent a magic link to <strong>{email}</strong></p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button onClick={() => handleOAuth('google')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button onClick={() => handleOAuth('github')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
                  <ExternalLink size={16} /> Continue with GitHub
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>or continue with email</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              </div>

              <form onSubmit={handleMagicLink}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="you@example.com" className="input-field" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }} disabled={loading}>
                  {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-light)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <ArrowLeft size={13} /> Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}