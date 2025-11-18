import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero({ onGetStarted }) {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden bg-[#0b0b0e] text-white">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/G0i6ZIv4Vd1oW14L/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0e]/40 to-[#0b0b0e] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="inline-block rounded-full border border-amber-500/30 bg-white/5 px-4 py-1 text-xs tracking-widest text-amber-300/80 backdrop-blur">
            PREMIUM FUEL CREDIT PLATFORM
          </p>
          <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-white/95">
            Elevate your station with a luxury, credit-powered fueling experience
          </h1>
          <p className="mt-6 text-lg text-zinc-300/90">
            Load credit for customers, authorize pumps with QR or ID, and see transactions reflect in real time. A polished experience for discerning brands.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => onGetStarted('owner')} className="group rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(245,158,11,0.35)] transition hover:brightness-110">
              Owner Dashboard
            </button>
            <button onClick={() => onGetStarted('customer')} className="rounded-xl border border-zinc-700/60 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/10">
              Customer App
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
