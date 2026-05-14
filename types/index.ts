export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: Pick<Product, 'id' | 'name' | 'price' | 'image_url' | 'category' | 'stock'>
}

// Local cart item stored in Zustand / localStorage
export interface LocalCartItem {
  id: string        // product id
  name: string
  price: number
  image_url: string
  quantity: number
}

export interface User {
  id: string
  email: string
  full_name?: string
}

export interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
}

export interface Order {
  id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  order_items: {
    id: string
    quantity: number
    unit_price: number
    products: Pick<Product, 'id' | 'name' | 'image_url'>
  }[]
}

export type Category = 'all' | 'electronics' | 'fashion' | 'home' | 'beauty' | 'food' | 'sports'
