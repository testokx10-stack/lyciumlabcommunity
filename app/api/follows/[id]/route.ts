import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (params.id === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', params.id)
      .single()

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', params.id)

      if (error) throw error

      return NextResponse.json({ following: false })
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: params.id
        })

      if (error) throw error

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: params.id,
          type: 'follow',
          reference_id: user.id,
          actor_id: user.id
        })

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is following this profile
    let following = false
    if (user) {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', params.id)
        .single()
      following = !!data
    }

    // Get follower/following counts
    const counts = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', params.id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', params.id)
    ])
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