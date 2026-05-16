import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductActions from './ProductActions';
import ProductImage from './ProductImage';
import Link from 'next/link';
import { ArrowLeft, Star, Download, Shield, Clock } from 'lucide-react';
import type { Product } from '@/lib/types';

export const metadata = { title: 'Product — MDS Store' };

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let product: Product;
  try {
    product = await api.products.get(id);
  } catch {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  return (
    <>
      <div className="noise-overlay" />
      <Navbar user={userProfile} />
      <main className="page-main" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="responsive-container">
          {/* Back link */}
          <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '2.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-light)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <ArrowLeft size={15} /> Back to Products
          </Link>

          <div className="responsive-two-col">
            {/* Image */}
            <div className="card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)', position: 'relative', aspectRatio: '4/3', background: 'var(--color-surface-2)' }}>
              <ProductImage src={product.imageUrl} alt={product.title} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <span className="badge badge-accent">Digital Product</span>
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-responsive-h1" style={{ fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                {product.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={15} fill="var(--color-gold)" color="var(--color-gold)" />
                ))}
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: '0.2rem' }}>5.0 (12 reviews)</span>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                {product.description}
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>USD</span>
              </div>

              <ProductActions product={product} />

              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                {[
                  { icon: Download, text: 'Instant digital delivery after purchase' },
                  { icon: Shield, text: 'Secure checkout via PayPal' },
                  { icon: Clock, text: 'Lifetime access & re-downloads' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color="var(--color-accent-light)" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}