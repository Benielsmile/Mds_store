'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@/lib/i18n/client';
import type { Product } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const t = useT();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button onClick={handleClick} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', width: '100%', justifyContent: 'center' }}>
      {added ? <Check size={20} /> : <ShoppingCart size={20} />}
      {added ? t('products.addedToCart') : t('products.addToCart')}
    </button>
  );
}
