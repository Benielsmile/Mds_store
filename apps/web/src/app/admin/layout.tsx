import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const ADMIN_EMAILS = ['benielsmile89@gmail.com', 'mdsmusuela@gmail.com'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?from=/admin');

  if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    redirect('/');
  }

  return <>{children}</>;
}
