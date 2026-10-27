import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role),
        replies:comments!parent_id(
          *,
          author:profiles!author_id(id, username, full_name, avatar_url, role)
        )
      `, { count: 'exact' })
      .eq('post_id', id)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({ 
      comments: data || [], 
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { content, parent_id } = body

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    if (content.length > 10000) {
      return NextResponse.json({ error: 'Comments must be 10,000 characters or fewer.' }, { status: 400 })
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .maybeSingle()
    if (postError) throw postError
    if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        author_id: user.id,
        content: content.trim(),
        parent_id: parent_id || null
      })
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    if (post.author_id !== user.id) {
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: post.author_id,
        type: 'comment',
        reference_id: id,
        actor_id: user.id,
      })
      if (notificationError) console.error('Failed to notify post author about comment:', notificationError)
    }

    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}