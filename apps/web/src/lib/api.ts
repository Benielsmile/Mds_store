import type { Product, Order, UserProfile } from '@mds-store/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init?.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...init, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  products: {
    list: () => request<Product[]>('/products'),
    get: (id: string) => request<Product>(`/products/${id}`),
    create: (data: Partial<Product>, token: string) =>
      request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }, token),
    update: (id: string, data: Partial<Product>, token: string) =>
      request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
    delete: (id: string, token: string) =>
      request<Product>(`/products/${id}`, { method: 'DELETE' }, token),
  },
  auth: {
    me: (token: string) => request<UserProfile>('/auth/me', {}, token),
  },
  orders: {
    checkout: (items: { productId: string }[], token: string) =>
      request<{ paypalOrderId: string; total: string }>('/orders/checkout', { method: 'POST', body: JSON.stringify({ items }) }, token),
    capture: (paypalOrderId: string, token: string) =>
      request<{ success: boolean }>('/orders/capture', { method: 'POST', body: JSON.stringify({ paypalOrderId }) }, token),
    list: (token: string) => request<Order[]>('/orders', {}, token),
  },
  delivery: {
    getUrl: (orderId: string, token: string) => request<{ signedUrl: string }>(`/delivery/${orderId}`, {}, token),
  },
};
