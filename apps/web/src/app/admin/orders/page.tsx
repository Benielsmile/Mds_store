import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Orders — Admin CRM' };

interface AdminOrder {
  id: string; status: string; amount: string; paypal_order_id: string | null; created_at: string;
  users: { email: string; name: string | null } | null;
  products: { title: string; price: string } | null;
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, users(email, name), products(title, price)')
    .order('created_at', { ascending: false });

  const completedOrders = (orders as AdminOrder[] | null)?.filter(o => o.status === 'completed');
  const total = completedOrders?.reduce((s, o) => s + parseFloat(o.amount), 0) || 0;

  return (
    <div className="admin-main" suppressHydrationWarning>
      <AdminSidebar />
      <div className="admin-content" suppressHydrationWarning>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-responsive-h1" style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Orders</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{orders?.length || 0} orders · <strong style={{ color: 'var(--color-success)' }}>${total.toFixed(2)}</strong> revenue</p>
          </div>
        </div>

        <div className="card responsive-table-wrap" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'PayPal ID', 'Date'].map(h => (
                  <th key={h} className="admin-th" style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders as AdminOrder[] | null)?.map(order => (
                <tr key={order.id} className="admin-tr" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="admin-td admin-td-mono" style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{order.id.slice(0, 12)}...</td>
                  <td className="admin-td" style={{ padding: '1rem', fontSize: '0.875rem' }}>{order.users?.email || '—'}</td>
                  <td className="admin-td" style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.products?.title || '—'}</td>
                  <td className="admin-td" style={{ padding: '1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>${parseFloat(order.amount).toFixed(2)}</td>
                  <td className="admin-td" style={{ padding: '1rem' }}>
                    <span className={`badge badge-${order.status === 'completed' ? 'success' : order.status === 'failed' ? 'danger' : 'pending'}`}>{order.status}</span>
                  </td>
                  <td className="admin-td admin-td-mono" style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{order.paypal_order_id?.slice(0, 12) || '—'}</td>
                  <td className="admin-td" style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
