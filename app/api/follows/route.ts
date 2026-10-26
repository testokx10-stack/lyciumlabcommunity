import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { following_id } = body

    if (!following_id) {
      return NextResponse.json({ error: 'following_id is required' }, { status: 400 })
    }

    if (following_id === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', following_id)
      .single()

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', following_id)

      if (error) throw error

      return NextResponse.json({ following: false })
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id
        })

      if (error) throw error

      // Create notification for followed user
      await supabase
        .from('notifications')
        .insert({
          user_id: following_id,
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

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'followers' or 'following'

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    let query = supabase
      .from('follows')
      .select(`
        *,
        follower:profiles!follower_id(id, username, full_name, avatar_url, role),
        following:profiles!following_id(id, username, full_name, avatar_url, role)
      `)

    if (type === 'followers') {
      query = query.eq('following_id', userId)
    } else {
      query = query.eq('follower_id', userId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ follows: data || [] })
  } catch (error) {
    console.error('Error fetching follows:', error)
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 })
  }
}