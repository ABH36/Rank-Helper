import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Lightbulb,
  Mic,
  MessageSquare,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react'
import Button from '../common/Button'
import { PillSelect } from '../common/Input'
import BottomNav from '../common/BottomNav'

export default function MobileTemplateShowcase() {
  const [activeScreen, setActiveScreen] = useState(2) // Default to Screen 2 (Dashboard)

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Screen Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          type="button"
          onClick={() => setActiveScreen(1)}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeScreen === 1
              ? 'bg-gradient-to-r from-primary to-accent-lime text-[#061006] shadow-md shadow-[var(--glow-lime)]'
              : 'border border-border bg-surface/60 text-text-muted hover:text-text'
          }`}
        >
          <span>Screen 1: Basic Details Form</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen(2)}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeScreen === 2
              ? 'bg-gradient-to-r from-primary to-accent-lime text-[#061006] shadow-md shadow-[var(--glow-lime)]'
              : 'border border-border bg-surface/60 text-text-muted hover:text-text'
          }`}
        >
          <span>Screen 2: AI Voice Chat & Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen(3)}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeScreen === 3
              ? 'bg-gradient-to-r from-primary to-accent-lime text-[#061006] shadow-md shadow-[var(--glow-lime)]'
              : 'border border-border bg-surface/60 text-text-muted hover:text-text'
          }`}
        >
          <span>Screen 3: Copilot Profile & Capabilities</span>
        </button>
      </div>

      {/* Main Grid showing all 3 screens side by side or zoomed in on selected screen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* SCREEN 1: BASIC DETAILS FORM */}
        <div
          className={`w-full max-w-[360px] mx-auto rounded-[40px] border-4 border-primary/20 bg-surface-card/95 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 ${
            activeScreen === 1 ? 'ring-2 ring-accent-lime shadow-[var(--glow-lime)] scale-105 z-10' : 'opacity-90 hover:opacity-100'
          }`}
          onClick={() => setActiveScreen(1)}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted mb-6 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>5G</span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex items-center mb-5">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-accent-lime p-0.5 shadow-md">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-primary font-bold text-sm">
                MR
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-left mb-6">
            <h3 className="font-heading text-xl font-extrabold text-text">Your basic details</h3>
            <div className="h-0.5 w-16 bg-accent-lime rounded-full my-2" />
            <p className="text-xs text-text-muted">These details are required for the certificate</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5 mb-8">
            <PillSelect
              label="Marital status"
              value="Single"
              onChange={() => {}}
              options={['Select your marital status', 'Single', 'Married']}
            />
            <PillSelect
              label="Education"
              value=""
              onChange={() => {}}
              options={['Select your education level', 'Bachelor Degree', 'Master Degree', 'PhD']}
            />
            <PillSelect
              label="Occupation"
              value=""
              onChange={() => {}}
              options={['Select your occupation', 'SEO Specialist', 'Content Strategist', 'Developer']}
            />
            <PillSelect
              label="Source of funds"
              value=""
              onChange={() => {}}
              options={['Select source of funds', 'Self Funded', 'Company Sponsored']}
            />
            <PillSelect
              label="Email ID"
              value=""
              onChange={() => {}}
              options={['Select or enter email ID', 'user@example.com']}
            />
          </div>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="secondary" size="sm" className="!py-3">
              Skip
            </Button>
            <Button variant="primary" size="sm" className="!py-3">
              Submit
            </Button>
          </div>
        </div>

        {/* SCREEN 2: MAIN AI DASHBOARD */}
        <div
          className={`w-full max-w-[360px] mx-auto rounded-[40px] border-4 border-primary/20 bg-surface-card/95 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 ${
            activeScreen === 2 ? 'ring-2 ring-accent-lime shadow-[var(--glow-lime)] scale-105 z-10' : 'opacity-90 hover:opacity-100'
          }`}
          onClick={() => setActiveScreen(2)}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted mb-6 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>5G</span>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent-lime p-0.5 shadow-md">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-accent-lime font-bold text-xs">
                  MR
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-text-muted">Hello, Michael</p>
                <h4 className="font-heading text-sm font-extrabold text-text">What's on your mind?</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted"
              >
                <Search size={16} />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted"
              >
                <Bell size={16} />
              </button>
            </div>
          </div>

          {/* Voice Chat with AI Card */}
          <div className="rounded-3xl border border-border bg-surface-2/60 p-4 text-left mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-text flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Sparkles size={13} />
                </span>
                Voice Chat with AI
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mb-3">
              AI voice assistants provide instant, personalized support, enhancing daily tasks effortlessly.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
              <input
                type="text"
                placeholder="Ask Chatbot..."
                readOnly
                className="w-full bg-transparent text-xs text-text outline-none"
              />
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary"
              >
                <Mic size={14} />
              </button>
            </div>
          </div>

          {/* Quick Access & Recent Prompt Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-left">
            <div className="rounded-3xl border border-border bg-surface-2/60 p-4 flex flex-col justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary mb-2">
                <Zap size={14} />
              </span>
              <div>
                <h5 className="text-xs font-bold text-text">Quick Access</h5>
                <p className="text-[10px] text-text-muted mt-1">Get Instant AI assistance anytime.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface-2/60 p-4 flex flex-col justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-lime/20 text-accent-lime mb-2">
                <MessageSquare size={14} />
              </span>
              <div>
                <h5 className="text-xs font-bold text-text">Recent Prompt</h5>
                <p className="text-[10px] text-text-muted mt-1">Get Instant AI assistance anytime.</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="text-left mb-5">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-extrabold text-text">Recent Activities</h5>
              <span className="text-[10px] font-semibold text-primary cursor-pointer">See all</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 p-3 text-xs text-text">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Sparkles size={14} />
                </span>
                <span className="flex-1 text-[11px] font-medium leading-tight">
                  Can you help me write a professional email to ask for a job reference?
                </span>
                <ChevronRight size={16} className="text-text-muted" />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 p-3 text-xs text-text">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-lime/20 text-accent-lime">
                  <TrendingUp size={14} />
                </span>
                <span className="flex-1 text-[11px] font-medium leading-tight">
                  What's the best way to learn Python if I'm a complete beginner?
                </span>
                <ChevronRight size={16} className="text-text-muted" />
              </div>
            </div>
          </div>

          {/* Floating Bottom Nav */}
          <BottomNav onActionClick={() => alert('New AI Chat Prompt launched!')} />
        </div>

        {/* SCREEN 3: PROFILE & CAPABILITIES */}
        <div
          className={`w-full max-w-[360px] mx-auto rounded-[40px] border-4 border-primary/20 bg-surface-card/95 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 ${
            activeScreen === 3 ? 'ring-2 ring-accent-lime shadow-[var(--glow-lime)] scale-105 z-10' : 'opacity-90 hover:opacity-100'
          }`}
          onClick={() => setActiveScreen(3)}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted mb-4 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>5G</span>
            </div>
          </div>

          {/* Top Bar with Premium Badge */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold text-amber-400">
              <Crown size={12} />
              Premium
            </span>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent-lime p-1 shadow-lg mb-3">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-accent-lime font-extrabold text-xl">
                RT
              </div>
            </div>
            <h4 className="font-heading text-base font-extrabold text-text">Ricky Transitioner</h4>
            <p className="text-xs text-text-muted mb-3">Career Change Expert</p>

            <Button variant="secondary" size="sm" className="!py-2 !px-4 text-[11px]">
              <Share2 size={13} />
              Share Mentor
            </Button>
          </div>

          {/* About Me Card */}
          <div className="rounded-3xl border border-border bg-surface-2/60 p-4 text-left mb-5">
            <h5 className="text-xs font-extrabold text-text mb-2">About Me</h5>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Are you tired of feeling stuck in a job that doesn't fulfill you? Look no further! I am a career change expert, dedicated to helping individuals like you discover their true passion... <span className="text-primary font-semibold cursor-pointer">see more</span>
            </p>
          </div>

          {/* Capabilities */}
          <div className="text-left mb-6">
            <h5 className="text-xs font-extrabold text-text mb-3">Capabilities</h5>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-border bg-surface-2/60 p-3 flex flex-col items-center text-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary mb-1.5">
                  <Compass size={14} />
                </span>
                <span className="text-[10px] font-bold text-text leading-tight">Strategy & Guidance</span>
              </div>

              <div className="rounded-2xl border border-border bg-surface-2/60 p-3 flex flex-col items-center text-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-lime/20 text-accent-lime mb-1.5">
                  <TrendingUp size={14} />
                </span>
                <span className="text-[10px] font-bold text-text leading-tight">Career Growth</span>
              </div>

              <div className="rounded-2xl border border-border bg-surface-2/60 p-3 flex flex-col items-center text-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-text-secondary mb-1.5">
                  <UserCheck size={14} />
                </span>
                <span className="text-[10px] font-bold text-text leading-tight">Transition Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <Button variant="primary" size="lg" className="w-full !py-3.5">
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
