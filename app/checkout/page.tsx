'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'
import { ordersApi } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Loader2, CheckCircle2, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Step = 'details' | 'payment' | 'success'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { user, access_token } = useAuthStore()
  const total = getTotal()

  const [step, setStep] = useState<Step>('details')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-bold text-2xl mb-4">Your cart is empty</h2>
        <Link href="/" className="btn-primary inline-block">Browse Products</Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 1500))

      const orderItems = items.map((i) => ({ product_id: i.id, quantity: i.quantity }))

      if (access_token) {
        // Authenticated: create order on server
        const data = await ordersApi.create(access_token, orderItems)
        setOrderId(data.order.id)
      } else {
        // Guest: simulate order confirmation
        setOrderId(`GUEST-${Date.now()}`)
      }

      clearCart()
      setStep('success')
    } catch (err: any) {
      toast.error(err.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="w-20 h-20 text-brand-600 mx-auto mb-6" />
        <h1 className="font-display font-bold text-3xl text-stone-900 mb-2">Order placed!</h1>
        <p className="text-stone-500 mb-2">Thank you for your purchase.</p>
        {orderId && (
          <p className="text-sm text-stone-400 mb-8">Order ID: <span className="font-mono text-stone-600">{orderId}</span></p>
        )}
        <Link href="/" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>

      <h1 className="font-display font-bold text-2xl text-stone-900 mb-8">Checkout</h1>

      {/* Step tabs */}
      <div className="flex gap-4 mb-8">
        {(['details', 'payment'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              ${step === s || (s === 'details' && step === 'payment')
                ? 'bg-brand-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium capitalize ${step === s ? 'text-stone-900' : 'text-stone-400'}`}>{s}</span>
            {i === 0 && <span className="text-stone-300 ml-2">→</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {step === 'details' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-semibold text-lg">Delivery Details</h2>
              {[
                { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'Ada Okafor' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                { name: 'address', label: 'Street address', type: 'text', placeholder: '12 Adeola Odeku St' },
                { name: 'city', label: 'City', type: 'text', placeholder: 'Lagos' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{f.label}</label>
                  <input name={f.name} type={f.type} value={(form as any)[f.name]}
                    onChange={handleInput} className="input-field" placeholder={f.placeholder} required />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">State</label>
                <select name="state" value={form.state} onChange={handleInput} className="input-field" required>
                  <option value="">Select state</option>
                  {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Kaduna'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!form.fullName || !form.email || !form.address || !form.city || !form.state) {
                    toast.error('Please fill in all fields'); return
                  }
                  setStep('payment')
                }}
                className="btn-primary w-full py-3"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <h2 className="font-display font-semibold text-lg">Payment Details</h2>
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full ml-auto">Simulated</span>
              </div>
              <p className="text-xs text-stone-400">This is a simulated payment — no real card is charged.</p>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Card number</label>
                <input name="cardNumber" type="text" value={form.cardNumber} onChange={handleInput}
                  className="input-field font-mono" placeholder="4242 4242 4242 4242" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Expiry</label>
                  <input name="expiry" type="text" value={form.expiry} onChange={handleInput}
                    className="input-field font-mono" placeholder="MM / YY" maxLength={7} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">CVV</label>
                  <input name="cvv" type="text" value={form.cvv} onChange={handleInput}
                    className="input-field font-mono" placeholder="123" maxLength={3} />
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : `Pay ${formatPrice(total)}`}
              </button>
              <button onClick={() => setStep('details')} className="btn-secondary w-full text-sm">
                Back to Details
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h3 className="font-display font-semibold text-base mb-4">Order Summary</h3>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-stone-800 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <hr className="border-stone-100 mb-3" />
            <div className="flex justify-between font-bold text-stone-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
