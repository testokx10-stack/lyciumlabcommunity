import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle()
    if (profileError) throw profileError
    if (!profile) {
      return NextResponse.json({ error: 'This member does not have an account you can follow.' }, { status: 404 })
    }

    const { data: existingFollow, error: followError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', id)
      .maybeSingle()
    if (followError) throw followError

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', id)

      if (error) throw error

      return NextResponse.json({ following: false })
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: id
        })

      if (error) throw error

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: id,
          type: 'follow',
          reference_id: user.id,
          actor_id: user.id
        })
      if (notificationError) console.error('Failed to notify followed user:', notificationError)

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle()
    if (profileError) throw profileError
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })

    let following = false
    if (user) {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', id)
        .maybeSingle()
      if (error) throw error
      following = !!data
    }

    // Get follower/following counts
    const counts = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', id)
    ])
    if (counts.some((result) => result.error)) throw counts.find((result) => result.error)?.error
    const followersCount = counts[0].count || 0
    const followingCount = counts[1].count || 0

    return NextResponse.json({ 
      following,
      followersCount: followersCount || 0,
      followingCount: followingCount || 0
    })
  } catch (error) {
    console.error('Error fetching follow status:', error)
    return NextResponse.json({ error: 'Failed to fetch follow status' }, { status: 500 })
  }
}