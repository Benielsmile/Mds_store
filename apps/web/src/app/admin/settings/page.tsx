'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import React, { useEffect, useState } from 'react';
import { Settings, Save, Loader2, Globe, Mail, Share2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { StoreSettings } from '@/lib/types';

const DEFAULTS: StoreSettings = {
  storeName: 'MDS Store',
  storeDescription: 'Premium digital products for creators and professionals.',
  contactEmail: '',
  twitterHandle: '',
  githubUrl: '',
  currency: 'USD',
};

function Field({ label, field, type = 'text', icon: Icon, settings, setSettings }: { label: string; field: keyof StoreSettings; type?: string; icon?: React.ElementType; settings: StoreSettings; setSettings: (s: StoreSettings) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />}
        <input className="input-field" type={type} value={settings[field]} onChange={e => setSettings({ ...settings, [field]: e.target.value })} style={Icon ? { paddingLeft: '2.5rem' } : {}} />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'store').single();
      if (data?.value) setSettings(data.value as StoreSettings);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ key: 'store', value: settings }, { onConflict: 'key' });
    if (error) toast.error('Failed to save: ' + error.message);
    else toast.success('Settings saved!');
    setSaving(false);
  };

  return (
    <div className="admin-main">
      <AdminSidebar />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--color-surface-2)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' } }} />

      <div className="admin-content" style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={24} color="var(--color-accent-light)" /> Store Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Global configuration for your store.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 size={28} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>General</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Field label="Store Name" field="storeName" settings={settings} setSettings={setSettings} />
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Store Description</label>
                  <textarea className="input-field" rows={2} value={settings.storeDescription} onChange={e => setSettings({ ...settings, storeDescription: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Currency</label>
                  <select className="input-field" value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Contact & Social</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Field label="Contact Email" field="contactEmail" type="email" icon={Mail} settings={settings} setSettings={setSettings} />
                <Field label="Twitter Handle (without @)" field="twitterHandle" icon={Share2} settings={settings} setSettings={setSettings} />
                <Field label="GitHub URL" field="githubUrl" icon={Globe} settings={settings} setSettings={setSettings} />
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
