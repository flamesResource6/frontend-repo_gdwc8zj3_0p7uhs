import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const grades = [
  { key: 'G91', price: 2.18 },
  { key: 'G95', price: 2.33 },
  { key: 'Diesel', price: 1.66 },
]

export default function CustomerApp() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [stage, setStage] = useState('login')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [user, setUser] = useState(null)
  const [grade, setGrade] = useState('G91')
  const [maxLiters, setMaxLiters] = useState(0)
  const [liters, setLiters] = useState('')
  const [pumpId, setPumpId] = useState('')
  const [session, setSession] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const login = async (e) => {
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, pin }) })
    if (!res.ok) return alert('Invalid credentials')
    const data = await res.json()
    setUser(data)
    setStage('select')
  }

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const res = await fetch(`${baseUrl}/api/customer/${user.customer_id}/calc-liters`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grade }) })
      const data = await res.json()
      setMaxLiters(data.max_liters)
    })()
  }, [user, grade])

  const startSession = async () => {
    const res = await fetch(`${baseUrl}/api/customer/${user.customer_id}/start-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pump_id: pumpId }) })
    if (!res.ok) return alert('Unable to start session')
    const data = await res.json()
    setSession(data)
    setStage('dispense')
  }

  const doConfirm = async () => {
    const res = await fetch(`${baseUrl}/api/dispense/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: session.token, liters: Number(liters), grade }) })
    const data = await res.json()
    if (!res.ok) return alert(data.detail || 'Failed')
    setConfirm(data)
    setStage('done')
  }

  const price = grades.find(g => g.key === grade).price

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-md p-6">
        <AnimatePresence mode="wait">
          {stage === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
              <h3 className="text-xl font-medium">Sign In</h3>
              <p className="text-zinc-400 text-sm">Secure login with your phone and PIN</p>
              <form className="mt-4 space-y-3" onSubmit={login}>
                <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
                <input type="password" className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)} />
                <button className="w-full rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-semibold py-2">Continue</button>
              </form>
            </motion.div>
          )}

          {stage === 'select' && user && (
            <motion.div key="select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-400">Welcome</div>
                    <div className="text-lg font-semibold">{user.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Balance</div>
                    <div className="text-amber-300 text-2xl font-semibold">{user.balance.toFixed(2)} SAR</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
                <div className="font-semibold">Select Fuel</div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {grades.map(g => (
                    <button key={g.key} onClick={() => setGrade(g.key)} className={`rounded-lg p-3 border ${g.key===grade ? 'border-amber-400/70 bg-amber-400/10' : 'border-zinc-700 bg-white/5 hover:bg-white/10'}`}>
                      <div className="font-semibold">{g.key}</div>
                      <div className="text-xs text-zinc-400">{g.price} / L</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-zinc-400">Max liters: <span className="text-amber-300 font-semibold">{maxLiters}</span></div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
                <div className="font-semibold">Pump & Liters</div>
                <div className="mt-3 space-y-3">
                  <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder="Pump ID" value={pumpId} onChange={e=>setPumpId(e.target.value)} />
                  <input className="w-full rounded-lg bg-black/20 border border-zinc-700 px-3 py-2" placeholder={`Liters (<= ${maxLiters})`} value={liters} onChange={e=>setLiters(e.target.value)} />
                  <button onClick={startSession} className="w-full rounded-lg bg-amber-500/90 hover:bg-amber-500 text-black font-semibold py-2">Start Session</button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'dispense' && session && (
            <motion.div key="dispense" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
              <div className="text-sm text-zinc-400">Session Token</div>
              <div className="font-mono text-amber-200">{session.token}</div>
              <div className="mt-4 text-sm">Confirm to begin fueling.</div>
              <div className="mt-2 text-zinc-400 text-sm">Grade {grade} • Liters {liters} • Est. {Number(liters || 0) * price} SAR</div>
              <button onClick={doConfirm} className="mt-4 w-full rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-semibold py-2">Confirm Dispense</button>
            </motion.div>
          )}

          {stage === 'done' && confirm && (
            <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-amber-500/20 bg-white/5 backdrop-blur p-6">
              <div className="text-sm text-zinc-400">Receipt</div>
              <div className="text-2xl font-semibold">{confirm.receipt_no}</div>
              <div className="mt-4 text-sm text-zinc-300 space-y-1">
                <div>Grade: {confirm.grade}</div>
                <div>Liters: {confirm.liters}</div>
                <div>Total: {confirm.total} SAR</div>
                <div>New Balance: <span className="text-amber-300 font-semibold">{confirm.new_balance} SAR</span></div>
              </div>
              <a href="/" className="mt-6 inline-block rounded-lg border border-zinc-700 px-4 py-2">Back Home</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
