'use client';

import { motion } from 'framer-motion';

function SkeletonBar({ width, height = 10, delay = 0 }: { width: number | string; height?: number; delay?: number }) {
  return (
    <motion.div
      style={{
        width, height, borderRadius: 6,
        background: 'linear-gradient(90deg, var(--color-surface-2) 0%, rgba(124,58,237,0.15) 50%, var(--color-surface-2) 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay }}
    />
  );
}

export default function ProductsLoading() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <SkeletonBar width={180} height={32} />
        <div style={{ marginTop: '0.5rem' }}>
          <SkeletonBar width={120} height={14} delay={0.1} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: '56.25%', background: 'var(--color-surface-2)', position: 'relative' }}>
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.08) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <SkeletonBar width="70%" height={16} />
              <SkeletonBar width="100%" height={12} delay={0.1} />
              <SkeletonBar width="80%" height={12} delay={0.15} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <SkeletonBar width={60} height={20} delay={0.2} />
                <SkeletonBar width={90} height={36} delay={0.25} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
