'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/types';

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setBuying(true);
    addItem(product);
    router.push('/cart');
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button
        onClick={handleBuyNow}
        disabled={buying}
        className="btn-primary"
        style={{ flex: 1, justifyContent: 'center', padding: '0.875rem 1.5rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
      >
        {buying ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={18} />}
        Buy Now
      </button>
      <button
        onClick={handleAddToCart}
        className="btn-secondary"
        style={{ flex: 1, justifyContent: 'center', padding: '0.875rem 1.5rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}
      >
        <ShoppingCart size={18} />
        {added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}
