import { useState } from 'react'
import Hero from './components/Hero'
import OwnerDashboard from './components/OwnerDashboard'
import CustomerApp from './components/CustomerApp'

function App() {
  const [view, setView] = useState('home')

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      {view === 'home' && <Hero onGetStarted={(v) => setView(v)} />}
      {view === 'owner' && <OwnerDashboard />}
      {view === 'customer' && <CustomerApp />}
    </div>
  )
}

export default App
