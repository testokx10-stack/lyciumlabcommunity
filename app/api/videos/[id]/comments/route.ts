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
    const { data, error, count } = await supabase
      .from('video_comments')
      .select('*, author:profiles!video_comments_author_id_fkey(id, username, full_name, avatar_url, role)', { count: 'exact' })
      .eq('video_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return NextResponse.json({ comments: data || [], total: count || 0 })
  } catch (error) {
    console.error('Error fetching video comments:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('video_comments')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable video comments.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to load video comments.', details }, { status: 500 })
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
    if (!user) return NextResponse.json({ error: 'Log in to comment on videos.' }, { status: 401 })

    const body = await request.json()
    if (typeof body.content !== 'string' || !body.content.trim()) {
      return NextResponse.json({ error: 'Write a comment before posting.' }, { status: 400 })
    }
    if (body.content.length > 10000) {
      return NextResponse.json({ error: 'Comments must be 10,000 characters or fewer.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('video_comments')
      .insert({ video_id: id, author_id: user.id, content: body.content.trim() })
      .select('*, author:profiles!video_comments_author_id_fkey(id, username, full_name, avatar_url, role)')
      .single()

    if (error) throw error
    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating video comment:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('video_comments')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable video comments.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to post comment.', details }, { status: 500 })
  }
}
