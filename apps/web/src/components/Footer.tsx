'use client';

import Link from 'next/link';
import { ShoppingBag, Mail, Heart, ArrowUpRight } from 'lucide-react';
import { useT } from '@/lib/i18n/client';

export default function Footer() {
  const t = useT();

  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem 0' }}>
        {/* Top grid: brand + 4 link columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr',
          gap: '3rem',
          marginBottom: '4rem',
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8b4513, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingBag size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                MDS<span style={{ color: 'var(--color-accent-light)' }}>Store</span>
              </span>
            </Link>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {t('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['facebook', 'twitter', 'instagram', 'github'].map((social) => (
                <a key={social} href="#" style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)', transition: 'all 0.2s', textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent-light)'; e.currentTarget.style.background = 'var(--color-accent-subtle)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'var(--color-surface-2)'; }}
                  aria-label={social}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>{t('footer.shop')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: t('footer.allProducts'), href: '/products' },
                { label: t('footer.newArrivals'), href: '/products' },
                { label: t('footer.bestSellers'), href: '/products' },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>{t('footer.support')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: t('footer.faq'), href: '#' },
                { label: t('footer.contact'), href: '#' },
                { label: t('footer.refunds'), href: '#' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>{t('footer.connect')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a href="mailto:support@mdsstore.com" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                <Mail size={13} /> support@mdsstore.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>Newsletter</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Be the first to know about new products and exclusive offers.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="your@email.com" className="input-field" style={{ flex: 1, fontSize: '0.8rem', padding: '0.625rem 0.75rem' }} />
              <button className="btn-primary" style={{ padding: '0.625rem 1rem', fontSize: '0.8rem', flexShrink: 0 }}>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
            &copy; {new Date().getFullYear()} MDSStore. {t('footer.copyright')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >Privacy</Link>
            <Link href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >Terms</Link>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {t('footer.madeWith')} <Heart size={10} color="var(--color-accent-light)" fill="var(--color-accent-light)" /> {t('footer.by')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}