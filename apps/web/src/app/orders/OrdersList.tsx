'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { Package, Download, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadOrders = useCallback(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        api.orders.list(session.access_token).then(setOrders).catch(() => {}).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [supabase.auth]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getDeliveryUrl = async (orderId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const { signedUrl } = await api.delivery.getUrl(orderId, session.access_token);
      window.open(signedUrl, '_blank');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Unable to generate download link');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 size={28} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <Package size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No orders yet</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>When you purchase a product, it will appear here.</p>
        <Link href="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
          <ShoppingBag size={16} /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {orders.map((order) => (
        <div key={order.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              Order #{order.id.substring(0, 8)}
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              ${parseFloat(order.amount).toFixed(2)} &middot; {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'failed' ? 'badge-danger' : 'badge-pending'}`}>
              {order.status}
            </span>
            {order.status === 'completed' && (
              <button onClick={() => getDeliveryUrl(order.id)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Download size={14} /> Download
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
