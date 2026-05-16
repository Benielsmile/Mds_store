import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Mail, Calendar, Shield } from 'lucide-react';

export const metadata = { title: 'Users — Admin CRM' };

interface AdminUser {
  id: string; email: string; name: string | null; role: string; created_at: string;
  orders: { count: number }[];
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from('users')
    .select('*, orders(count)')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-main" suppressHydrationWarning>
      <AdminSidebar />
      <div className="admin-content" suppressHydrationWarning>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-responsive-h1" style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Users</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{users?.length || 0} registered users from Supabase Auth</p>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['User', 'Email', 'Role', 'Orders', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users as AdminUser[] | null)?.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `hsl(${user.email.charCodeAt(0) * 5}, 60%, 35%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, color: '#fff',
                      }}>
                        {(user.name || user.email)?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name || 'No name'}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={13} /> {user.email}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-accent' : 'badge-pending'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      {user.role === 'admin' && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    {user.orders?.[0]?.count ?? 0}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} /> {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
