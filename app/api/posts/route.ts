import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const authorId = searchParams.get('authorId')
    const offset = (page - 1) * limit

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role),
        liked_by_user:likes!user_id(user_id)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tag) query = query.eq('tag', tag)
    if (authorId) query = query.eq('author_id', authorId)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ 
      posts: data || [], 
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, image_url, tag } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content: content.trim(),
        image_url,
        tag
      })
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}