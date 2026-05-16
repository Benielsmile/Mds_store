'use client';

import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n/client';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function PayPalCheckout({ onSuccess }: { onSuccess: () => void }) {
  const supabase = createClient();
  const { items } = useCart();
  const [error, setError] = useState('');

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', color: 'gold', label: 'checkout' }}
        createOrder={async () => {
          setError('');
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) throw new Error('Please sign in first');
          const result = await api.orders.checkout(
            items.map(i => ({ productId: i.product.id })),
            session.access_token,
          );
          return result.paypalOrderId;
        }}
        onApprove={async (data) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) return;
          try {
            await api.orders.capture(data.orderID, session.access_token);
            onSuccess();
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Payment failed');
          }
        }}
        onError={(err) => {
          setError(typeof err === 'string' ? err : 'PayPal checkout error');
        }}
      />
      {error && (
        <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </PayPalScriptProvider>
  );
}

interface CartUser {
  email: string;
  name?: string | null;
  role?: string;
}

export default function CartContent({ user }: { user: CartUser | null }) {
  const { items, count, total, removeItem, updateQuantity, clearCart } = useCart();
  const t = useT();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(107, 76, 50, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Check size={36} color="var(--color-success)" />
          </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t('cart.paymentSuccessful')}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          {t('cart.paymentDesc')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" className="btn-primary">{t('cart.continueShopping')}</Link>
          <Link href="/orders" className="btn-secondary" style={{ textDecoration: 'none' }}>{t('cart.myOrders')}</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <ShoppingBag size={56} color="var(--color-text-muted)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('cart.emptyTitle')}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{t('cart.emptyDesc')}</p>
        <Link href="/products" className="btn-primary">{t('cart.browseProducts')}</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{t('cart.title')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{count > 0 ? t('cart.items', { count }) : ''}</p>
        </div>
        <button onClick={clearCart} className="btn-danger" style={{ fontSize: '0.85rem' }}>
          <Trash2 size={14} /> {t('cart.clearCart')}
        </button>
      </div>

      <div className="responsive-sidebar-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 'clamp(0.75rem, 2vw, 1rem)', padding: 'clamp(0.75rem, 2vw, 1.25rem)', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 'clamp(60px, 12vw, 100px)', height: 'clamp(60px, 12vw, 100px)', borderRadius: 12, flexShrink: 0, overflow: 'hidden', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={24} color="var(--color-text-muted)" />
                  </div>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <Link href={`/products/${product.id}`} style={{ fontWeight: 600, fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: 'var(--color-text-primary)', textDecoration: 'none', display: 'block', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.title}
                </Link>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Digital delivery</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(product.id, quantity - 1)} className="btn-secondary" style={{ padding: '0.375rem', minWidth: 32, justifyContent: 'center', fontSize: '0.8rem' }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)} className="btn-secondary" style={{ padding: '0.375rem', minWidth: 32, justifyContent: 'center', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', minWidth: 80, textAlign: 'right', whiteSpace: 'nowrap' }}>
                ${(parseFloat(product.price) * quantity).toFixed(2)}
              </div>
              <button onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="card admin-sticky-summary" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', overflow: 'visible', minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.1rem)', marginBottom: '1.5rem' }}>{t('cart.orderSummary')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)' }}>
              <span>{t('cart.subtotal', { count })}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)' }}>
              <span>{t('cart.tax')}</span>
              <span>$0.00</span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>
              <span>{t('cart.total')}</span>
              <span>${total.toFixed(2)} USD</span>
            </div>
          </div>

          {!user ? (
            <Link href="/login?from=/cart" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: 'clamp(0.625rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)' }}>
              {t('cart.signInToCheckout')}
            </Link>
          ) : checkoutMode ? (
            <PayPalCheckout onSuccess={() => { clearCart(); setSuccess(true); }} />
          ) : (
            <button onClick={() => setCheckoutMode(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 'clamp(0.625rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)' }}>
              {t('cart.proceedToCheckout')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
