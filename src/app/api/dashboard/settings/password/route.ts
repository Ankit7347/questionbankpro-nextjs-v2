/**
 * src/app/api/dashboard/settings/password/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import bcrypt from 'bcryptjs'

async function resolveUser(req?: Request) {
  await dbConnect()
  const session = await auth()
  const headerUuid = req?.headers.get('x-user-id') || undefined
  const userUuid = session?.user?.id || headerUuid
  if (!userUuid) return null
  const user = await User.findOne({ uuid: userUuid, isDeleted: false })
  return user || null
}

export async function POST(req: Request) {
  try {
    const user = await resolveUser(req)
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const action = body.action as string

    if (action === 'changePassword') {
      const { currentPassword, newPassword } = body as { currentPassword: string; newPassword: string }
      if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

      const valid = await bcrypt.compare(currentPassword, (user as any).passwordHash)
      if (!valid) return NextResponse.json({ error: 'Invalid current password' }, { status: 403 })

      // Validate new password
      if (newPassword.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 })
      // Additional checks (symbol, number)
      if (!/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
        return NextResponse.json({ error: 'Password must include a number and symbol' }, { status: 400 })
      }

      const passwordHash = await bcrypt.hash(newPassword, 12)
      await User.findByIdAndUpdate(user._id, { $set: { passwordHash } })

      // TODO: Invalidate other sessions (depends on auth implementation)
      console.log(`User ${user.uuid} changed password`)

      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (action === 'logoutOtherSessions') {
      // TODO: Implement session invalidation mechanism. Placeholder behavior: log and return success.
      console.log(`User ${user.uuid} requested logout other sessions`)
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
