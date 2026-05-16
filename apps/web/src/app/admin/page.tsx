import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Package, Users, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';

export const metadata = { title: 'Admin Dashboard — MDS Store' };

interface DashboardOrder {
  id: string; amount: string; status: string; created_at: string;
  users: { email: string; name: string | null } | null;
  products: { title: string } | null;
}

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [{ count: productCount }, { count: userCount }, { count: orderCount }, { data: recentOrders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, users(email, name), products(title)').order('created_at', { ascending: false }).limit(5),
  ]);

  const { data: completedOrders } = await supabase.from('orders').select('amount').eq('status', 'completed');
  const revenue = (completedOrders as { amount: string }[] | null)?.reduce((sum, o) => sum + parseFloat(o.amount || '0'), 0) || 0;

  return { productCount, userCount, orderCount, revenue, recentOrders: (recentOrders as DashboardOrder[]) || [] };
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { productCount, userCount, orderCount, revenue, recentOrders } = await getStats(supabase);

  const stats = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: 'var(--color-success)', change: '+12%' },
    { label: 'Total Orders', value: orderCount ?? 0, icon: ShoppingCart, color: '#8b4513', change: '+8%' },
    { label: 'Products', value: productCount ?? 0, icon: Package, color: '#b8860b', change: 'Active' },
    { label: 'Users', value: userCount ?? 0, icon: Users, color: '#a0522d', change: 'Registered' },
  ];

  return (
    <div className="admin-main">
      <AdminSidebar />

      <div className="admin-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-responsive-h1" style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Welcome back! Here&apos;s what&apos;s happening in your store.</p>
        </div>

        <div className="admin-stats-grid" style={{ marginBottom: '2rem' }}>
          {stats.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="card" style={{ padding: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ width: 'clamp(32px, 6vw, 44px)', height: 'clamp(32px, 6vw, 44px)', borderRadius: 12, background: `${color}20`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', background: 'rgba(107, 76, 50, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 6, fontWeight: 600 }}>{change}</span>
              </div>
              <div style={{ fontSize: 'clamp(1rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1, marginBottom: '0.15rem' }}>{value}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Recent Orders</h2>
            <a href="/admin/orders" style={{ color: 'var(--color-accent-light)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View all <ArrowUpRight size={14} />
            </a>
          </div>

          {recentOrders.length > 0 ? (
            <div className="responsive-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: DashboardOrder) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{order.users?.email || '\u2014'}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{order.products?.title || '\u2014'}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>${parseFloat(order.amount).toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${order.status === 'completed' ? 'success' : order.status === 'failed' ? 'danger' : 'pending'}`}>{order.status}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
