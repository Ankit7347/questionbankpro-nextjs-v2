/**
 * src/app/api/dashboard/settings/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'

interface Preferences {
  theme?: string
  [key: string]: any
}

async function resolveUser(req?: Request) {
  await dbConnect()
  const session = await auth()
  const headerUuid = req?.headers.get('x-user-id') || undefined
  const userUuid = session?.user?.id || headerUuid
  if (!userUuid) return null
  const user = await User.findOne({ uuid: userUuid, isDeleted: false }).lean()
  return user || null
}

export async function GET(req: Request) {
  try {
    const user = await resolveUser(req)
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const profile = {
      name: user.name,
      avatarUrl: undefined,
      subscription: 'Free',
      storageUsedMB: 0,
      storageTotalMB: 1000,
    }

    const preferences: Preferences = (user as any).preferences || { theme: user.uiMode || 'system' }

    return NextResponse.json({ profile, preferences }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await resolveUser(req)
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const updates: any = {}
    if (body.theme) {
      updates['preferences.theme'] = body.theme
      // Also store as uiMode for backward compatibility
      updates['uiMode'] = body.theme === 'dark' ? 'dark' : body.theme === 'light' ? 'light' : user.uiMode
    }

    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    await User.findByIdAndUpdate(user._id, { $set: updates })

    // TODO: Log to security_audit table
    console.log(`User ${user.uuid} updated preferences:`, updates)

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
