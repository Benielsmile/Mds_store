import { createClient } from '@/lib/supabase/server';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';

export const metadata = {
  title: 'All Products — MDS Store',
  description: 'Browse our full catalogue of premium digital products.',
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  let products: Product[] = [];
  try {
    const allProducts = await api.products.list();
    products = allProducts.filter((p: Product) => p.isActive);
  } catch {}

  return (
    <>
      <Navbar user={userProfile} />
      <main className="page-main" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="responsive-container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h1 className="text-responsive-h1" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              All Products
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              {products.length} premium digital {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="responsive-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Sparkles size={24} color="var(--color-accent-light)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products yet</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Check back soon — new products are being added!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}