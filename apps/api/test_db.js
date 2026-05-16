import postgres from 'postgres';

async function test() {
  try {
    const sql = postgres('postgresql://postgres:Mds%20e-commerce01@db.kxcvbevdkimqpmidvile.supabase.co:5432/postgres?sslmode=require');
    const result = await sql`SELECT 1 as num`;
    console.log("Success:", result);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
test();
