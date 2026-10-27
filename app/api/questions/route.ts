import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '10', 10) || 10))
    const tag = searchParams.get('tag')
    const answered = searchParams.get('answered')
    const offset = (page - 1) * limit

    let query = supabase
      .from('questions')
      .select(`
        *,
        author:profiles!questions_author_id_fkey(id, username, full_name, avatar_url, role)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tag) query = query.eq('tag', tag)
    if (answered !== null) query = query.eq('answered', answered === 'true')

    const { data, error, count } = await query

    if (error) throw error

    const questionIds = (data || []).map((question) => question.id)
    const { data: votes, error: votesError } = questionIds.length
      ? await supabase.from('question_votes').select('question_id, user_id, vote').in('question_id', questionIds)
      : { data: [], error: null }

    if (votesError) throw votesError

    const questions = (data || []).map((question) => {
      const questionVotes = (votes || []).filter((vote) => vote.question_id === question.id)
      return {
        ...question,
        answers_count: question.answers_count || 0,
        votes_count: questionVotes.reduce((total, vote) => total + (vote.vote === 'up' ? 1 : -1), 0),
        user_vote: questionVotes.find((vote) => vote.user_id === user?.id)?.vote || null,
      }
    })

    return NextResponse.json({
      questions,
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('question_votes')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable questions and voting.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch questions', details }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, body: questionBody, tag } = body

    if (typeof title !== 'string' || typeof questionBody !== 'string' || typeof tag !== 'string' || !title.trim() || !questionBody.trim() || !tag.trim()) {
      return NextResponse.json({ error: 'Title, body, and tag are required' }, { status: 400 })
    }
    if (title.length > 200 || questionBody.length > 10000 || tag.length > 80) {
      return NextResponse.json({ error: 'Title, details, or topic exceed the allowed length.' }, { status: 400 })
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
        author:profiles!questions_author_id_fkey(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ question: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}