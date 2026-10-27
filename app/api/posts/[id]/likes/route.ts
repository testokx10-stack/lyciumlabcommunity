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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .maybeSingle()
    if (postError) throw postError
    if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

    const { data: existingLike, error: likeLookupError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', id)
      .maybeSingle()
    if (likeLookupError) throw likeLookupError

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', id)

      if (error) throw error

      const { count, error: countError } = await supabase.from('likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', id)
      if (countError) throw countError

      return NextResponse.json({ liked: false, likes_count: count || 0 })
    }

    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        post_id: id
      })
    if (error) throw error

    if (post.author_id !== user.id) {
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: post.author_id,
        type: 'like',
        reference_id: id,
        actor_id: user.id,
      })
      if (notificationError) console.error('Failed to notify post author about like:', notificationError)
    }

    const { count, error: countError } = await supabase.from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', id)
    if (countError) throw countError

    return NextResponse.json({ liked: true, likes_count: count || 0 })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)

    if (error) throw error

    let userLiked = false
    if (user) {
      const { data, error: userLikeError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle()
      if (userLikeError) throw userLikeError
      userLiked = !!data
    }

    return NextResponse.json({ 
      count: count || 0, 
      userLiked 
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}