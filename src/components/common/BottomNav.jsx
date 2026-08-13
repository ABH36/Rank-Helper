import { useState } from 'react'
import { Home, LayoutGrid, Plus, User } from 'lucide-react'

export default function BottomNav({ onActionClick }) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-surface/90 backdrop-blur-2xl p-2 shadow-2xl shadow-[var(--glow)]">
      {/* Home Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-normal transition-all cursor-pointer ${
          activeTab === 'home'
            ? 'bg-primary/15 text-primary border border-primary/30'
            : 'text-text-muted hover:text-text'
        }`}
      >
        <Home size={18} />
        <span>Home</span>
      </button>

      {/* Grid Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('grid')}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-all cursor-pointer hover:text-text ${
          activeTab === 'grid' ? 'bg-surface-2 text-primary' : ''
        }`}
      >
        <LayoutGrid size={18} />
      </button>

      {/* Profile Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('profile')}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-all cursor-pointer hover:text-text ${
          activeTab === 'profile' ? 'bg-surface-2 text-primary' : ''
        }`}
      >
        <User size={18} />
      </button>

      {/* Floating Neon Action Plus Button */}
      <button
        type="button"
        onClick={onActionClick}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent-lime text-[#061006] shadow-[0_0_20px_var(--glow-lime)] transition-transform hover:scale-110 active:scale-95 cursor-pointer font-normal"
        aria-label="Add Action"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>
    </div>
  )
}
