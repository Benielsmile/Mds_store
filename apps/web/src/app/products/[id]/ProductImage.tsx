'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-surface-2)',
      }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      style={{ objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  );
}
