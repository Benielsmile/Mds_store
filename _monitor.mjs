import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://kxcvbevdkimqpmidvile.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y3ZiZXZka2ltcXBtaWR2aWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3MjA4NSwiZXhwIjoyMDk0MzQ4MDg1fQ.JmJmPFxLXShkHkrg7lfu_f5JEsVoXuI9MyUGlaEyi-0'
);
let prevCount = -1;
let completed = new Set();
console.log('[' + new Date().toISOString() + '] 🟢 Monitor started - watching for webhook events...');
setInterval(async () => {
  try {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(20);
    if (!data) return;
    data.forEach(o => {
      if (o.status === 'completed' && !completed.has(o.id)) {
        completed.add(o.id);
        console.log('[' + new Date().toISOString() + '] ✅ WEBHOOK CAPTURED - Order ' + o.id.slice(0,8) + ' | PayPal: ' + o.paypal_order_id + ' | Amount: $' + o.amount);
      } else if (o.status === 'failed' && !completed.has(o.id)) {
        completed.add(o.id);
        console.log('[' + new Date().toISOString() + '] ❌ WEBHOOK FAILED - Order ' + o.id.slice(0,8) + ' | PayPal: ' + o.paypal_order_id);
      }
    });
    if (data.length !== prevCount) {
      prevCount = data.length;
      console.log('[' + new Date().toISOString() + '] 📊 Total orders: ' + data.length);
    }
  } catch(e) {}
}, 3000);
