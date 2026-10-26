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
    const answered = searchParams.get('answered')
    const offset = (page - 1) * limit

    let query = supabase
      .from('questions')
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role),
        answers_count:answers(count),
        votes:likes!question_id(count)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (tag) query = query.eq('tag', tag)
    if (answered !== null) query = query.eq('answered', answered === 'true')

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ 
      questions: data || [], 
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
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
    const { title, body: questionBody, tag } = body

    if (!title?.trim() || !questionBody?.trim() || !tag?.trim()) {
      return NextResponse.json({ error: 'Title, body, and tag are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('questions')
      .insert({
        author_id: user.id,
        title: title.trim(),
        body: questionBody.trim(),
        tag: tag.trim()
      })
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ question: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}