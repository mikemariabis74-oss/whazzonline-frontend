const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Generic fetch wrapper ────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(errorData.error || `Request failed: ${res.status}`)
  }

  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  signup: (body: { email: string; password: string; full_name: string }) =>
    request<{ message: string; user: { id: string; email: string } }>(
      '/api/auth/signup',
      { method: 'POST', body: JSON.stringify(body) }
    ),

  login: (body: { email: string; password: string }) =>
    request<{
      access_token: string
      refresh_token: string
      user: { id: string; email: string; full_name?: string }
    }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: (token: string) =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }, token),

  refresh: (refresh_token: string) =>
    request<{ access_token: string; refresh_token: string }>(
      '/api/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refresh_token }) }
    ),

  me: (token: string) =>
    request<{ user: { id: string; email: string } }>('/api/auth/me', {}, token),
}

// ── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: (params?: { q?: string; category?: string; sort?: string; page?: string; limit?: string }) => {
    const qs = new URLSearchParams()
    if (params?.q)        qs.set('q', params.q)
    if (params?.category && params.category !== 'all') qs.set('category', params.category)
    if (params?.sort && params.sort !== 'newest')      qs.set('sort', params.sort)
    if (params?.page)   qs.set('page', params.page)
    if (params?.limit)  qs.set('limit', params.limit)
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return request<{ products: import('@/types').Product[]; total: number; page: number; limit: number }>(`/api/products${query}`)
  },

  get: (id: string) =>
    request<{ product: import('@/types').Product }>(`/api/products/${id}`),
}

// ── Cart ─────────────────────────────────────────────────────
export const cartApi = {
  get: (token: string) =>
    request<{ cart: import('@/types').CartItem[] }>('/api/cart', {}, token),

  add: (token: string, body: { product_id: string; quantity: number }) =>
    request<{ message: string; item: import('@/types').CartItem }>(
      '/api/cart',
      { method: 'POST', body: JSON.stringify(body) },
      token
    ),

  update: (token: string, id: string, quantity: number) =>
    request<{ message: string }>(
      `/api/cart/${id}`,
      { method: 'PATCH', body: JSON.stringify({ quantity }) },
      token
    ),

  remove: (token: string, id: string) =>
    request<{ message: string }>(`/api/cart/${id}`, { method: 'DELETE' }, token),

  clear: (token: string) =>
    request<{ message: string }>('/api/cart', { method: 'DELETE' }, token),
}

// ── Orders ───────────────────────────────────────────────────
export const ordersApi = {
  list: (token: string) =>
    request<{ orders: import('@/types').Order[] }>('/api/orders', {}, token),

  get: (token: string, id: string) =>
    request<{ order: import('@/types').Order }>(`/api/orders/${id}`, {}, token),

  create: (token: string, items: { product_id: string; quantity: number }[]) =>
    request<{ message: string; order: import('@/types').Order }>(
      '/api/orders',
      { method: 'POST', body: JSON.stringify({ items }) },
      token
    ),
}
