/**
 * src/app/dashboard/settings/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, ChevronRight, Sun, Moon, Settings as Cog, Database } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  name: string
  avatarUrl?: string
  subscription?: string
  storageUsedMB?: number
  storageTotalMB?: number
}

type ThemeOption = 'dark' | 'light' | 'system'

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [theme, setTheme] = useState<ThemeOption>('system')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard/settings')
        if (!res.ok) throw new Error('Failed to load')
        const { profile, preferences } = await res.json()
        setProfile(profile)
        setTheme((preferences?.theme as ThemeOption) || 'system')
      } catch (err) {
        toast.error('Unable to load settings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const setThemeSafe = async (t: ThemeOption) => {
    setTheme(t)
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: t }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Theme updated')
    } catch (err) {
      toast.error('Failed to save theme')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-slate-400">Manage account, preferences and notifications</p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 rounded-lg bg-slate-900/40 animate-pulse"></div>
            <div className="h-12 rounded-lg bg-slate-900/40 animate-pulse"></div>
            <div className="h-12 rounded-lg bg-slate-900/40 animate-pulse"></div>
          </div>
        ) : (
          <section className="space-y-6">
            <div className="rounded-lg bg-slate-900/40 p-4 flex items-center gap-4">
              <div className="rounded-full bg-slate-800 h-14 w-14 flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="h-14 w-14 object-cover" />
                ) : (
                  <User className="text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">{profile?.name}</h2>
                    <p className="text-xs text-slate-400">{profile?.subscription || 'Free'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/40 p-1">
              <h3 className="text-sm px-4 pt-3 text-slate-300">Preferences</h3>
              <div className="divide-y divide-slate-800">
                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <Cog className="text-cyan-400" />
                    <div>
                      <div className="text-sm">Appearance</div>
                      <div className="text-xs text-slate-400">Theme and color mode</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setThemeSafe('dark')}
                      className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-transparent'}`}
                    >
                      <Moon size={16} />
                    </button>
                    <button
                      onClick={() => setThemeSafe('light')}
                      className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-slate-800 text-cyan-400' : 'bg-transparent'}`}
                    >
                      <Sun size={16} />
                    </button>
                    <button
                      onClick={() => setThemeSafe('system')}
                      className={`px-2 py-1 rounded ${theme === 'system' ? 'bg-slate-800 text-cyan-400' : 'bg-transparent'}`}
                    >
                      <Database size={16} />
                    </button>
                  </div>
                </div>

                <Link href="/dashboard/settings/notifications" className="flex items-center justify-between px-4 py-3 hover:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">🔔</div>
                    <div>
                      <div className="text-sm">Notifications</div>
                      <div className="text-xs text-slate-400">Manage notification preferences</div>
                    </div>
                  </div>
                  <ChevronRight />
                </Link>

                <Link href="/dashboard/settings/password" className="flex items-center justify-between px-4 py-3 hover:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">🔒</div>
                    <div>
                      <div className="text-sm">Password & Security</div>
                      <div className="text-xs text-slate-400">Change password, 2FA, sessions</div>
                    </div>
                  </div>
                  <ChevronRight />
                </Link>

                <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="text-rose-400">🗑️</div>
                    <div>
                      <div className="text-sm">Delete Account</div>
                      <div className="text-xs text-slate-400">Remove your data permanently</div>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Storage</div>
                  <div className="text-xs text-slate-400">Notes & papers</div>
                </div>
                <div className="text-sm text-slate-200">{profile?.storageUsedMB ?? 0} / {profile?.storageTotalMB ?? 1000} MB</div>
              </div>
              <div className="w-full bg-slate-800 rounded h-2 mt-3 overflow-hidden">
                <div style={{ width: `${Math.min(100, ((profile?.storageUsedMB || 0) / (profile?.storageTotalMB || 1000)) * 100)}%` }} className="h-2 bg-emerald-500" />
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
