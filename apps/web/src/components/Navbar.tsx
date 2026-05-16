'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingBag, LogOut, LayoutDashboard, ShoppingCart, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useTheme } from '@/lib/theme-context';

const ADMIN_EMAILS = ['benielsmile89@gmail.com', 'mdsmusuela@gmail.com'];

function isAdmin(user: { email?: string; role?: string } | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return false;
}

interface NavbarProps {
  user?: { email: string; name?: string | null; role?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'var(--navbar-scrolled-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Mobile menu button */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              MDS<span style={{ color: 'var(--color-accent-light)' }}>Store</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/products" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >Products</Link>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--color-accent)', color: 'white', fontSize: '0.6rem', fontWeight: 700, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={toggle} className="btn-ghost" style={{ padding: '0.5rem', fontSize: '0.8rem', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user ? (
              <>
                <Link href="/orders" className="btn-ghost" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
                  My Orders
                </Link>
                {isAdmin(user) && (
                  <Link href="/admin" className="btn-ghost" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                )}
                <button onClick={handleSignOut} className="btn-ghost" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
                  <LogOut size={14} /> Sign Out
                </button>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${user.email.charCodeAt(0) * 5}, 50%, 30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.75rem', color: '#fff', flexShrink: 0, border: '2px solid var(--color-border)' }}>
                  {(user.name || user.email)?.[0]?.toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Sign In</Link>
                <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile cart icon */}
          <Link href="/cart" className="show-mobile" style={{ position: 'relative', display: 'flex', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            <ShoppingCart size={18} />
            {count > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--color-accent)', color: 'white', fontSize: '0.55rem', fontWeight: 700, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg)' }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 60, display: mobileOpen ? 'block' : 'none' }} onClick={() => setMobileOpen(false)} />

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 'min(280px, calc(100vw - 32px))',
        background: 'var(--color-surface)', zIndex: 61, borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
              MDS<span style={{ color: 'var(--color-accent-light)' }}>Store</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/products', label: 'Products' },
            { href: '/cart', label: `Cart${count > 0 ? ` (${count})` : ''}` },
            ...(isAdmin(user) ? [{ href: '/admin', label: 'Dashboard' }] : []),
            ...(user ? [{ href: '/orders', label: 'My Orders' }] : []),
            ...(!user ? [
              { href: `/login?from=${encodeURIComponent(pathname)}`, label: 'Sign In' },
              { href: `/login?from=${encodeURIComponent(pathname)}`, label: 'Get Started' },
            ] : []),
          ].map(({ href, label }) => {
            const isGetStarted = label === 'Get Started';
            return isGetStarted ? (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 0.875rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}
              >{label}</Link>
            ) : (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0.875rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >{label}</Link>
            );
          })}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.875rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${user.email.charCodeAt(0) * 5}, 50%, 30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', color: '#fff', flexShrink: 0 }}>
                {(user.name || user.email)?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
            </div>
          ) : null}
          <button onClick={() => { toggle(); setMobileOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 0.875rem', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={() => { if (user) handleSignOut(); setMobileOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 0.875rem', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}>
            {user ? <LogOut size={16} /> : <User size={16} />}
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </div>
    </>
  );
}