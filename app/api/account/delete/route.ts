import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError && authError.name !== 'AuthSessionMissingError') {
      throw authError
    }
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Connectez-vous pour demander la suppression de votre compte.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const password = typeof body.password === 'string' ? body.password : ''
    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 500) : ''
    const confirmed = body.confirmed === true

    if (!confirmed) {
      return NextResponse.json({ error: 'Veuillez confirmer la demande pour continuer.' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'Le mot de passe actuel est requis pour valider la demande.' }, { status: 400 })
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: 'Le mot de passe actuel est incorrect.' }, { status: 401 })
    }

    const { error: insertError } = await supabase.from('account_deletion_requests').insert({
      user_id: user.id,
      email: user.email,
      reason: reason || null,
      status: 'pending',
      request_metadata: {
        source: 'account-settings',
        requested_at: new Date().toISOString(),
      },
    })

    if (insertError) {
      if (insertError.code === '42P01') {
        return NextResponse.json({
          error: 'La table de demande de suppression n’existe pas encore. Appliquez le script SQL de suppression de compte dans Supabase avant d’utiliser ce flux.',
        }, { status: 500 })
      }
      throw insertError
    }

    return NextResponse.json({
      ok: true,
      message: 'Votre demande de suppression a bien été enregistrée. Les contenus et données seront traités conformément à la politique de conservation définie par le projet.',
    })
  } catch (error) {
    console.error('Failed to request account deletion:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Impossible de traiter la demande de suppression.' }, { status: 500 })
  }
}
