import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const prices = { G91: 2.18, G95: 2.33, Diesel: 1.66 }

export default function OwnerDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', pin: '' })
  const [selected, setSelected] = useState(null)
  const [topup, setTopup] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCustomers = async () => {
    const res = await fetch(`${baseUrl}/api/owner/customers`)
    const data = await res.json()
    setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/owner/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to create')
      setForm({ name: '', phone: '', email: '', pin: '' })
      fetchCustomers()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTopup = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/owner/customers/${selected._id}/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(topup) }),
      })
      if (!res.ok) throw new Error('Topup failed')
      setTopup('')
      fetchCustomers()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-7xl p-6">
        <h2 className="text-3xl font-semibold tracking-tight">Owner Dashboard</h2>
        <p className="text-zinc-400 mt-2">Manage customers, balances, and get instant insight.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Customers</h3>
              <div className="text-sm text-amber-300/80">Prices — G91 {prices.G91} • G95 {prices.G95} • Diesel {prices.Diesel}</div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(c => (
                <button key={c._id} onClick={() => setSelected(c)} className={`text-left rounded-xl p-4 border transition ${selected?._id===c._id ? 'border-amber-400/60 bg-amber-400/10' : 'border-zinc-700 bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-zinc-400">{c.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-300 font-semibold">{(c.balance??0).toFixed(2)} SAR</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
            <h3 className="text-xl font-medium">Add Customer</h3>
            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
              <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Full name" value={form.name} onChange={e=>setForm(v=>({...v, name:e.target.value}))} />
              <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Phone" value={form.phone} onChange={e=>setForm(v=>({...v, phone:e.target.value}))} />
              <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Email (optional)" value={form.email} onChange={e=>setForm(v=>({...v, email:e.target.value}))} />
              <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="PIN (4-8)" value={form.pin} onChange={e=>setForm(v=>({...v, pin:e.target.value}))} />
              <button disabled={loading} className="w-full rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-semibold py-2">{loading? 'Please wait...' : 'Create'}</button>
            </form>

            <div className="h-px my-6 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <h3 className="text-xl font-medium">Load Credit</h3>
            <div className="mt-3 space-y-3">
              <div className="text-sm text-zinc-400">{selected ? `Selected: ${selected.name}` : 'Select a customer from the list'}</div>
              <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Amount" value={topup} onChange={e=>setTopup(e.target.value)} />
              <button onClick={handleTopup} disabled={!selected || loading} className="w-full rounded-lg bg-amber-500/90 hover:bg-amber-500 text-black font-semibold py-2">Add Credit</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
