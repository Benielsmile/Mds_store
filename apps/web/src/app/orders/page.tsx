import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrdersList from './OrdersList';
import { redirect } from 'next/navigation';

export const metadata = { title: 'My Orders — MDS Store' };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  return (
    <>
      <div className="noise-overlay" />
      <Navbar user={profile} />
      <main className="page-main" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="responsive-container">
          <h1 className="text-responsive-h1" style={{ fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>My Orders</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>View your purchased products and downloads.</p>
          <OrdersList />
        </div>
      </main>
      <Footer />
    </>
  );
}
