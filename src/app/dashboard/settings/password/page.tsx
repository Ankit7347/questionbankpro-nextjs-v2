/**
 * src/app/dashboard/settings/password/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Eye, EyeOff, Key, ShieldCheck, LogOut } from 'lucide-react'
import { toast } from 'sonner'

function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score += 1
  if (/[A-Z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return score // 0..4
}

export default function PasswordPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = useMemo(() => passwordStrength(next), [next])

  const requirements = [
    { label: '8+ characters', ok: next.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(next) },
    { label: 'Number', ok: /[0-9]/.test(next) },
    { label: 'Symbol', ok: /[^A-Za-z0-9]/.test(next) },
  ]

  const changePassword = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!current || !next || !confirm) return toast.error('Fill all fields')
    if (next !== confirm) return toast.error('Passwords do not match')
    if (strength < 3) return toast.error('Password too weak')

    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', currentPassword: current, newPassword: next }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Password updated')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      toast.error('Password change failed')
    } finally {
      setLoading(false)
    }
  }

  const logoutOthers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/settings/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logoutOtherSessions' }) })
      if (!res.ok) throw new Error('Failed')
      toast.success('Logged out from other devices')
    } catch (err) {
      toast.error('Failed to logout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Password & Security</h1>
          <p className="text-sm text-slate-400">Manage login credentials and session security</p>
        </header>

        <form onSubmit={changePassword} className="rounded-lg bg-slate-900/40 p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-300">Current Password</label>
            <div className="mt-2 relative">
              <input type={showCurrent ? 'text' : 'password'} className="w-full rounded bg-slate-800 p-3 text-sm" value={current} onChange={(e) => setCurrent(e.target.value)} />
              <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-2 top-2 text-slate-400">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300">New Password</label>
            <div className="mt-2 relative">
              <input type={showNext ? 'text' : 'password'} className="w-full rounded bg-slate-800 p-3 text-sm" value={next} onChange={(e) => setNext(e.target.value)} />
              <button type="button" onClick={() => setShowNext((s) => !s)} className="absolute right-2 top-2 text-slate-400">
                {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300">Confirm Password</label>
            <div className="mt-2">
              <input type={showNext ? 'text' : 'password'} className="w-full rounded bg-slate-800 p-3 text-sm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Strength</div>
            <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
              <div style={{ width: `${(strength / 4) * 100}%` }} className={`h-2 ${strength >= 3 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            </div>
            <div className="flex gap-2 text-xs mt-2">
              {requirements.map((r) => (
                <div key={r.label} className={`flex items-center gap-2 ${r.ok ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <ShieldCheck size={14} />
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="h-12 px-4 rounded bg-cyan-400 text-slate-950">Change Password</button>
            <button type="button" onClick={logoutOthers} disabled={loading} className="h-12 px-4 rounded border border-rose-500 text-rose-500 flex items-center gap-2">
              <LogOut size={16} />
              Logout others
            </button>
          </div>
        </form>

        <section className="mt-6 rounded-lg bg-slate-900/40 p-4">
          <h3 className="text-sm text-slate-300 mb-2">Two-Factor Authentication</h3>
          <p className="text-xs text-slate-400">Enable App-based or SMS based 2FA to secure your account.</p>
          <div className="mt-3 flex gap-2">
            <button className="h-12 px-3 rounded bg-slate-800">Enable App 2FA</button>
            <button className="h-12 px-3 rounded bg-slate-800">Enable SMS 2FA</button>
          </div>
        </section>
      </div>
    </main>
  )
}
