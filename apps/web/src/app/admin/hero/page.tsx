'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Sparkles, Save, Loader2, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { HeroContent } from '@/lib/types';

const DEFAULT_HERO: HeroContent = {
  headline: 'The Best Digital Products for Creators',
  subheadline: 'Discover premium templates, tools, and assets — built to accelerate your work. Instant digital delivery, one-time purchase.',
  ctaText: 'Shop Now',
  badgeText: '⚡ Premium Digital Products',
};

function Field({ label, field, multiline, hero, setHero }: { label: string; field: keyof HeroContent; multiline?: boolean; hero: HeroContent; setHero: (h: HeroContent) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>{label}</label>
      {multiline ? (
        <textarea className="input-field" rows={3} value={hero[field]} onChange={e => setHero({ ...hero, [field]: e.target.value })} style={{ resize: 'vertical' }} />
      ) : (
        <input className="input-field" value={hero[field]} onChange={e => setHero({ ...hero, [field]: e.target.value })} />
      )}
    </div>
  );
}

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero').single();
      if (data?.value) setHero(data.value as HeroContent);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'hero', value: hero }, { onConflict: 'key' });
    if (error) toast.error('Failed to save: ' + error.message);
    else toast.success('Hero section updated!');
    setSaving(false);
  };

  return (
    <div className="admin-main">
      <AdminSidebar />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--color-surface-2)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' } }} />

      <div className="admin-content" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={24} color="var(--color-accent-light)" /> Hero Section Editor
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Edit what customers see on the homepage hero banner.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
            className="admin-hero-grid">
            {/* Form */}
            <div className="card" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
              <h2 style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>Content Fields</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                <Field label="Badge Text" field="badgeText" hero={hero} setHero={setHero} />
                <Field label="Main Headline" field="headline" multiline hero={hero} setHero={setHero} />
                <Field label="Sub-headline" field="subheadline" multiline hero={hero} setHero={setHero} />
                <Field label="CTA Button Text" field="ctaText" hero={hero} setHero={setHero} />
              </div>
              <div style={{ marginTop: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
                <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="card" style={{ padding: 'clamp(0.75rem, 3vw, 2rem)', background: 'var(--color-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
                <Eye size={16} color="var(--color-text-secondary)" />
                <h2 style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--color-text-secondary)' }}>Live Preview</h2>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(0,0,0,0))', borderRadius: 16, padding: '2rem', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent-subtle)', border: '1px solid rgba(139, 69, 19, 0.25)', borderRadius: 999, padding: '0.25rem 0.875rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-light)', marginBottom: '1rem' }}>
                  {hero.badgeText}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #2d1b0d, #8b4513, #b8860b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {hero.headline}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{hero.subheadline}</p>
                <button className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.6rem 1.5rem' }}>{hero.ctaText}</button>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Note: The homepage reads this from a <code style={{ background: 'var(--color-surface-2)', padding: '0.1rem 0.3rem', borderRadius: 4 }}>site_settings</code> Supabase table.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
