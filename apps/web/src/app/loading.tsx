'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <motion.div
        style={{
          position: 'absolute', top: '20%', left: '50%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,69,19,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
          transform: 'translateX(-50%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', bottom: '30%', right: '20%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Animated logo */}
        <motion.div
          style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #8b4513, #a0522d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 60px rgba(139,69,19,0.3)',
          }}
          animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 40px rgba(139,69,19,0.2)', '0 0 80px rgba(139,69,19,0.4)', '0 0 40px rgba(139,69,19,0.2)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShoppingBag size={32} color="white" />
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2rem' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          MDS<span style={{ color: 'var(--color-accent-light)' }}>Store</span>
        </motion.div>

        {/* Loading skeleton bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          {[240, 180, 200].map((width, i) => (
            <motion.div
              key={i}
              style={{
                width, height: 10, borderRadius: 5,
                background: 'linear-gradient(90deg, var(--color-surface-2) 0%, rgba(139,69,19,0.2) 50%, var(--color-surface-2) 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
