/**
 * src/app/dashboard/settings/notifications/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Bell, Mail, Smartphone, Clock } from 'lucide-react'

interface NotificationPrefs {
  muteAll?: boolean
  quizAlerts?: boolean
  studyReminders?: boolean
  productUpdates?: boolean
  communityActivity?: boolean
  channels?: {
    push?: boolean
    email?: boolean
    sms?: boolean
  }
  quietHours?: { start?: string; end?: string }
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard/settings/notifications')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setPrefs(data.preferences || {})
      } catch (err) {
        toast.error('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const save = async (patch: Partial<NotificationPrefs>) => {
    const updated = { ...prefs, ...patch }
    setPrefs(updated)
    try {
      const res = await fetch('/api/dashboard/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Saved')
    } catch (err) {
      toast.error('Save failed')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Notification Preferences</h1>
          <p className="text-sm text-slate-400">Control how the app notifies you</p>
        </header>

        {loading ? (
          <div className="space-y-3">
            <div className="h-12 rounded bg-slate-900/40 animate-pulse" />
            <div className="h-12 rounded bg-slate-900/40 animate-pulse" />
            <div className="h-12 rounded bg-slate-900/40 animate-pulse" />
          </div>
        ) : (
          <section className="space-y-4">
            <div className="rounded-lg bg-slate-900/40 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-cyan-400" />
                <div>
                  <div className="text-sm">Mute All Notifications</div>
                  <div className="text-xs text-slate-400">Temporarily mute all alerts</div>
                </div>
              </div>
              <input type="checkbox" checked={!!prefs.muteAll} onChange={(e) => save({ muteAll: e.target.checked })} />
            </div>

            <div className="rounded-lg bg-slate-900/40 p-3">
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">🎓</div>
                    <div>
                      <div className="text-sm">Quiz Alerts</div>
                      <div className="text-xs text-slate-400">Reminders for upcoming quizzes</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={!!prefs.quizAlerts} onChange={(e) => save({ quizAlerts: e.target.checked })} />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">⏰</div>
                    <div>
                      <div className="text-sm">Study Reminders</div>
                      <div className="text-xs text-slate-400">Daily study reminders</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={!!prefs.studyReminders} onChange={(e) => save({ studyReminders: e.target.checked })} />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">📢</div>
                    <div>
                      <div className="text-sm">Product Updates</div>
                      <div className="text-xs text-slate-400">New features and content</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={!!prefs.productUpdates} onChange={(e) => save({ productUpdates: e.target.checked })} />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">💬</div>
                    <div>
                      <div className="text-sm">Community Activity</div>
                      <div className="text-xs text-slate-400">Replies and mentions</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={!!prefs.communityActivity} onChange={(e) => save({ communityActivity: e.target.checked })} />
                </label>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="text-sm text-slate-300">Delivery Channels</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <label className="flex flex-col items-center gap-2 p-2 rounded bg-slate-800">
                    <Smartphone />
                    <div className="text-xs">Push</div>
                    <input type="checkbox" checked={!!prefs.channels?.push} onChange={(e) => save({ channels: { ...(prefs.channels || {}), push: e.target.checked } })} />
                  </label>

                  <label className="flex flex-col items-center gap-2 p-2 rounded bg-slate-800">
                    <Mail />
                    <div className="text-xs">Email</div>
                    <input type="checkbox" checked={!!prefs.channels?.email} onChange={(e) => save({ channels: { ...(prefs.channels || {}), email: e.target.checked } })} />
                  </label>

                  <label className="flex flex-col items-center gap-2 p-2 rounded bg-slate-800">
                    <div className="text-xs">SMS</div>
                    <input type="checkbox" checked={!!prefs.channels?.sms} onChange={(e) => save({ channels: { ...(prefs.channels || {}), sms: e.target.checked } })} />
                  </label>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-slate-300">Quiet Hours</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="time" value={prefs.quietHours?.start || ''} onChange={(e) => save({ quietHours: { ...(prefs.quietHours || {}), start: e.target.value } })} className="rounded bg-slate-800 p-2" />
                    <span className="text-slate-400">to</span>
                    <input type="time" value={prefs.quietHours?.end || ''} onChange={(e) => save({ quietHours: { ...(prefs.quietHours || {}), end: e.target.value } })} className="rounded bg-slate-800 p-2" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
