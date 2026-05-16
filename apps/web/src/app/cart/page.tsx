import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartContent from './CartContent';

export const metadata = { title: 'Cart — MDS Store' };

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  return (
    <>
      <div className="noise-overlay" />
      <Navbar user={userProfile} />
      <main className="page-main" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="responsive-container">
          <CartContent user={userProfile} />
        </div>
      </main>
      <Footer />
    </>
  );
}
