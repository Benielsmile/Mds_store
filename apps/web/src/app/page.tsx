import { createClient } from '@/lib/supabase/server';
import { api } from '@/lib/api';
import { getMessages } from '@/lib/i18n/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap, Download, Sparkles } from 'lucide-react';
import type { Product, HeroContent } from '@/lib/types';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getMessages();

  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  let products: Product[] = [];
  try {
    products = await api.products.list();
  } catch {}

  const activeProducts = products.filter(p => p.isActive);
  const featuredProducts = activeProducts.slice(0, 6);
  const home = t.home;

  let heroBadge = home.hero.badge;
  let heroTitle1 = home.hero.title1;
  let heroTitle2 = home.hero.title2;
  let heroSubtitle = home.hero.subtitle;
  let heroShopNow = home.hero.shopNow;
  try {
    const { data: heroData } = await supabase.from('site_settings').select('value').eq('key', 'hero').single();
    if (heroData?.value) {
      const hero = heroData.value as HeroContent;
      if (hero.badgeText) heroBadge = hero.badgeText;
      if (hero.headline) {
        const parts = hero.headline.split('\n');
        heroTitle1 = parts[0] || heroTitle1;
        heroTitle2 = parts.slice(1).join('\n') || heroTitle2;
      }
      if (hero.subheadline) heroSubtitle = hero.subheadline;
      if (hero.ctaText) heroShopNow = hero.ctaText;
    }
  } catch {}

  return (
    <>
      <div className="noise-overlay" />
      <Navbar user={userProfile} />

      <main>
        {/* ── Hero ── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', padding: '8rem 1.5rem 6rem',
        }}>
          <div style={{ position: 'absolute', top: '5%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,69,19,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-accent-subtle)', border: '1px solid rgba(139,69,19,0.2)', borderRadius: 999, padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-light)', letterSpacing: '0.02em' }}>
                <Sparkles size={13} /> {heroBadge}
              </span>
            </div>

            <h1 className="text-responsive-hero" style={{ marginBottom: '1.5rem' }}>
              <span className="gradient-text">{heroTitle1}</span>
              <br />{heroTitle2}
            </h1>

            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              {heroSubtitle}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)' }}>
                {heroShopNow} <ArrowRight size={16} />
              </Link>
              <Link href="/products" className="btn-secondary" style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>
                View Products
              </Link>
            </div>

            <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              {[
                { value: '500+', label: home.stats.sold },
                { value: '4.9★', label: home.stats.rating },
                { value: '100%', label: home.stats.delivery },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>{value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className="section-title">
                {home.features.title} <span className="gradient-text-accent">{home.features.title2}</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                {home.features.subtitle}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: Zap, title: home.features.instantDelivery.title, desc: home.features.instantDelivery.desc, color: '#b8860b' },
                { icon: Shield, title: home.features.securePayments.title, desc: home.features.securePayments.desc, color: '#8b4513' },
                { icon: Download, title: home.features.lifetimeAccess.title, desc: home.features.lifetimeAccess.desc, color: '#6b4c32' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card card-hover" style={{ padding: '2.5rem 2rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className="section-padding">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: '0.4rem' }}>{home.featured.title}</h2>
                <p className="section-subtitle">{home.featured.subtitle}</p>
              </div>
              <Link href="/products" className="btn-secondary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem' }}>
                {home.featured.viewAll} <ArrowRight size={14} />
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="responsive-grid">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Sparkles size={24} color="var(--color-accent-light)" />
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{home.featured.placeholder}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '4rem 3rem', border: '1px solid var(--color-gold-subtle)', background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.08), rgba(139, 69, 19, 0.03))' }}>
              <Star size={36} color="var(--color-gold)" fill="var(--color-gold)" style={{ margin: '0 auto 1rem' }} />
              <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
                {home.cta.title}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
                {home.cta.subtitle}
              </p>
              <Link href="/products" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>
                {home.cta.button} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}