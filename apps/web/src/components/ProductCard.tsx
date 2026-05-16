'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, Star, Zap, Check, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setBuying(true);
    addItem(product);
    router.push('/cart');
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Link href={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', paddingBottom: '65%', background: 'var(--color-surface-2)', overflow: 'hidden' }}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.title} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              className="product-card-image"
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={22} color="var(--color-accent-light)" />
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
            <span className="badge badge-accent">Digital</span>
          </div>
        </div>
      </Link>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
              <Star size={12} fill="var(--color-gold)" color="var(--color-gold)" />
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>4.9</span>
            </div>
          </div>
        </Link>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleBuyNow} disabled={buying} className="btn-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem' }}>
              {buying ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={13} />}
              {buying ? '...' : 'Buy'}
            </button>
            <button onClick={handleAddToCart} className="btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
              {added ? <Check size={13} /> : <ShoppingCart size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}