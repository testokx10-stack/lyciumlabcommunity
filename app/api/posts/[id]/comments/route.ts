import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
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
      `)
      .eq('post_id', params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, parent_id } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: params.id,
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

    // Increment comments count on post
    await supabase.rpc('increment_comments_count', { post_id: params.id })

    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}