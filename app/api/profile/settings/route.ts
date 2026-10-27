import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    if (!user) return NextResponse.json({ error: 'Connectez-vous pour modifier votre profil.' }, { status: 401 })

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location')
      .eq('id', user.id)
      .maybeSingle()
    if (error) throw error

    return NextResponse.json({
      profile: data || {
        id: user.id,
        username: null,
        full_name: typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : '',
        avatar_url: typeof user.user_metadata.avatar_url === 'string' ? user.user_metadata.avatar_url : '',
        bio: '',
        location: typeof user.user_metadata.location === 'string' ? user.user_metadata.location : '',
      },
    })
  } catch (error) {
    console.error('Failed to load profile settings:', error)
    return NextResponse.json({ error: 'Impossible de charger votre profil.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    if (!user) return NextResponse.json({ error: 'Connectez-vous pour modifier votre profil.' }, { status: 401 })

    const body = await request.json()
    const { full_name, bio, location, avatar_url } = body
    if (
      typeof full_name !== 'string' ||
      typeof bio !== 'string' ||
      typeof location !== 'string' ||
      typeof avatar_url !== 'string' ||
      full_name.trim().length < 1 ||
      full_name.length > 100 ||
      bio.length > 500 ||
      location.length > 120 ||
      avatar_url.length > 2048
    ) {
      return NextResponse.json({ error: 'Vérifiez les champs : nom requis (100 caractères max), bio (500 max) et lieu (120 max).' }, { status: 400 })
    }

    if (avatar_url) {
      let parsedUrl: URL
      try {
        parsedUrl = new URL(avatar_url)
      } catch {
        return NextResponse.json({ error: 'L’URL de la photo de profil est invalide.' }, { status: 400 })
      }
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        return NextResponse.json({ error: 'L’URL de la photo doit utiliser HTTP ou HTTPS.' }, { status: 400 })
      }
    }

    const updates = {
      full_name: full_name.trim(),
      bio: bio.trim() || null,
      location: location.trim() || null,
      avatar_url: avatar_url || null,
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, username, full_name, avatar_url, bio, location')
      .maybeSingle()
    if (profileError) throw profileError
    if (!profile) {
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, ...updates })
        .select('id, username, full_name, avatar_url, bio, location')
        .single()
      if (insertError) throw insertError
      await syncUserMetadata(supabase, updates)
      return NextResponse.json({ profile: insertedProfile })
    }

    await syncUserMetadata(supabase, updates)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Failed to update profile settings:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Impossible d’enregistrer votre profil.' }, { status: 500 })
  }
}

async function syncUserMetadata(
  supabase: Awaited<ReturnType<typeof createClient>>,
  updates: { full_name: string; bio: string | null; location: string | null; avatar_url: string | null }
) {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: updates.full_name,
      avatar_url: updates.avatar_url,
      location: updates.location,
    },
  })
  if (error) throw error
}
