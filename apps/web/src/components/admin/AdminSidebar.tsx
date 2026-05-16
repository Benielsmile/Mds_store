'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  Sparkles, Settings, LogOut, ShoppingBag, ChevronRight,
  Menu, X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/hero', label: 'Hero Section', icon: Sparkles },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? 64 : 240,
    minHeight: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
  };

  const mobileOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 39,
    display: mobileOpen ? 'block' : 'none',
  };

  const mobileSidebarStyle: React.CSSProperties = {
    width: 'min(280px, calc(100vw - 32px))',
    minHeight: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.25s ease',
  };

  const menuItems = (wide: boolean) => navItems.map(({ href, label, icon: Icon, exact }) => {
    const active = isActive(href, exact);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        title={wide ? undefined : label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: wide ? '0.75rem' : 0,
          justifyContent: wide ? 'flex-start' : 'center',
          padding: wide ? '0.65rem 0.875rem' : '0.65rem',
          margin: wide ? '0 0.25rem' : '0.25rem',
          borderRadius: 10,
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: active ? 600 : 400,
          color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          background: active ? 'var(--color-accent-subtle)' : 'transparent',
          border: active ? '1px solid rgba(139, 69, 19, 0.25)' : '1px solid transparent',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--color-text-primary)'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; } }}
      >
        <Icon size={17} color={active ? 'var(--color-accent-light)' : undefined} style={{ flexShrink: 0 }} />
        {wide && <span className="sidebar-label" style={{ flex: 1 }}>{label}</span>}
        {wide && active && <ChevronRight size={14} color="var(--color-accent-light)" />}
      </Link>
    );
  });

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="show-mobile"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed', top: 16, left: 12, zIndex: 30,
          width: 36, height: 36, borderRadius: 8,
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      <div style={mobileOverlayStyle} onClick={() => setMobileOpen(false)} />

      {/* Mobile sidebar */}
      <aside style={mobileSidebarStyle}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag size={17} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>MDS Store</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems(true)}
        </nav>
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.65rem 0.875rem', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        style={sidebarStyle}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className="hide-mobile"
      >
        <div style={{ padding: collapsed ? '1rem 0' : '1.5rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag size={17} color="white" />
            </div>
            {!collapsed && <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>MDS Store</span>}
          </Link>
        </div>
        <nav style={{ flex: 1, padding: collapsed ? '0.5rem 0' : '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems(!collapsed)}
        </nav>
        <div style={{ padding: collapsed ? '0.5rem' : '1rem 0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: collapsed ? 36 : '100%', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '0.5rem' : '0.65rem 0.875rem', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }} title="Sign Out">
            <LogOut size={17} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
