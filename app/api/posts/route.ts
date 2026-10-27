import { createClient } from '@/lib/supabase/server'
import { COMMUNITY_MEDIA_BUCKET } from '@/lib/community-media'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
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
        author:profiles!posts_author_id_fkey(id, username, full_name, avatar_url, role)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tag) query = query.eq('tag', tag)
    if (authorId) query = query.eq('author_id', authorId)

    const { data, error, count } = await query

    if (error) throw error

    const postIds = (data || []).map((post) => post.id)
    const { data: likes, error: likesError } = user && postIds.length
      ? await supabase.from('likes').select('post_id').eq('user_id', user.id).in('post_id', postIds)
      : { data: [], error: null }
    if (likesError) throw likesError

    const likedPostIds = new Set((likes || []).map((like) => like.post_id))
    const posts = (data || []).map((post) => ({
      ...post,
      user_liked: likedPostIds.has(post.id),
    }))

    return NextResponse.json({ 
      posts,
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts', details: error instanceof Error ? error.message : JSON.stringify(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, image_url, media_path, media_type, media_url, tag } = body

    if (typeof content !== 'string' || (!content.trim() && !media_path && !media_url)) {
      return NextResponse.json({ error: 'Add text or an image/video to your post.' }, { status: 400 })
    }

    let resolvedMediaUrl: string | null = image_url || null
    let resolvedMediaType: 'image' | 'video' | null = image_url ? 'image' : null

    if (media_path || media_url) {
      if (media_type !== 'image' && media_type !== 'video') {
        return NextResponse.json({ error: 'Media must be an image or video.' }, { status: 400 })
      }

      if (media_path) {
        if (typeof media_path !== 'string' || !media_path.startsWith(`${user.id}/`)) {
          return NextResponse.json({ error: 'You can only attach files you uploaded.' }, { status: 403 })
        }

        const { data } = supabase.storage
          .from(COMMUNITY_MEDIA_BUCKET)
          .getPublicUrl(media_path)
        resolvedMediaUrl = data.publicUrl
        resolvedMediaType = media_type
      } else {
        if (typeof media_url !== 'string') {
          return NextResponse.json({ error: 'Media URL must be a valid HTTP(S) link.' }, { status: 400 })
        }
        let parsedMediaUrl: URL
        try {
          parsedMediaUrl = new URL(media_url)
        } catch {
          return NextResponse.json({ error: 'Media URL must be a valid HTTP(S) link.' }, { status: 400 })
        }
        if (parsedMediaUrl.protocol !== 'https:' && parsedMediaUrl.protocol !== 'http:') {
          return NextResponse.json({ error: 'Media URL must use HTTP or HTTPS.' }, { status: 400 })
        }
        resolvedMediaUrl = parsedMediaUrl.toString()
        resolvedMediaType = media_type
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content: content.trim(),
        image_url: resolvedMediaType === 'image' ? resolvedMediaUrl : null,
        media_url: resolvedMediaUrl,
        media_type: resolvedMediaType,
        tag
      })
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (/column .*media_(url|type).* does not exist/i.test(details)) {
      return NextResponse.json({
        error: 'Run supabase/community-media.sql in the Supabase SQL Editor to enable media posts.',
      }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create post', details }, { status: 500 })
  }
}