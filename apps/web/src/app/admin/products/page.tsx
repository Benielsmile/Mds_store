'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2, Search } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';

type ProductForm = {
  title: string; description: string; price: string;
  imageUrl: string; fileUrl: string; isActive: boolean;
};

function ProductModal({ product, onClose, onSave, token, supabase }: { product?: Product | null; onClose: () => void; onSave: () => void; token: string; supabase: SupabaseClient }) {
  const [form, setForm] = useState<ProductForm>(() => {
    if (product) return {
      title: product.title, description: product.description, price: product.price,
      imageUrl: product.imageUrl, fileUrl: product.fileUrl, isActive: product.isActive
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('product_draft');
      if (saved) return JSON.parse(saved);
    }
    return { title: '', description: '', price: '', imageUrl: '', fileUrl: '', isActive: true };
  });

  useEffect(() => {
    if (!product && typeof window !== 'undefined') {
      localStorage.setItem('product_draft', JSON.stringify(form));
    }
  }, [form, product]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'image' | 'file' | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, bucket: string, type: 'image' | 'file') => {
    setUploading(type);
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    setUploading(null);
    if (error) { toast.error('Upload failed: ' + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    return type === 'image' ? publicUrl : path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (product?.id) {
        await api.products.update(product.id, form, token);
        toast.success('Product updated!');
      } else {
        await api.products.create(form, token);
        localStorage.removeItem('product_draft');
        toast.success('Product created!');
      }
      onSave();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong');
    }
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '0.25rem' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Title *</label>
            <input className="input-field" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product title" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Description *</label>
            <textarea className="input-field" required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." style={{ resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Price (USD) *</label>
            <input className="input-field" required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="9.99" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Cover Image</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input className="input-field" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://... or upload below" style={{ flex: 1 }} />
              <button type="button" className="btn-secondary" onClick={() => imageRef.current?.click()} style={{ padding: '0.75rem', flexShrink: 0 }} disabled={uploading === 'image'}>
                {uploading === 'image' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
              </button>
            </div>
            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              const url = await uploadFile(file, 'product-images', 'image');
              if (url) setForm(f => ({ ...f, imageUrl: url }));
            }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Digital File Path * <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(stored in private bucket)</span></label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input className="input-field" required value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} placeholder="path/to/file.zip or upload" style={{ flex: 1 }} />
              <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()} style={{ padding: '0.75rem', flexShrink: 0 }} disabled={uploading === 'file'}>
                {uploading === 'file' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
              </button>
            </div>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              const path = await uploadFile(file, 'digital-products', 'file');
              if (path) setForm(f => ({ ...f, fileUrl: path }));
            }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Active (visible to customers)</span>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [supabase] = useState(() => createClient());
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });

  const loadProducts = () => {
    api.products.list().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || '');
    });
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await api.products.delete(id, token);
      toast.success('Product deactivated');
      loadProducts();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Something went wrong'); }
  };

  const filtered = products.filter(p => p.isActive && p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-main" suppressHydrationWarning>
      <AdminSidebar />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--color-surface-2)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' } }} />
      {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false })} onSave={loadProducts} token={token} supabase={supabase} />}

      <div className="admin-content" suppressHydrationWarning>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Products</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{products.length} total products</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({ open: true, product: null })}>
            <Plus size={17} /> Add Product
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 380 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-field" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 size={28} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="card responsive-table-wrap" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)' }}>
                  {['Product', 'Price', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {product.imageUrl ? <img src={product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{product.title}</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>${parseFloat(product.price).toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>{product.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setModal({ open: true, product })} style={{ padding: '0.4rem', background: 'var(--color-accent-subtle)', border: '1px solid rgba(139, 69, 19, 0.2)', borderRadius: 7, cursor: 'pointer', color: 'var(--color-accent-light)', display: 'flex' }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} style={{ padding: '0.4rem', background: 'rgba(168,68,50,0.1)', border: '1px solid rgba(168,68,50,0.2)', borderRadius: 7, cursor: 'pointer', color: 'var(--color-danger)', display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
