import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
      .from('answers')
      .select(`
        *,
        author:profiles!answers_author_id_fkey(id, username, full_name, avatar_url, role)
      `, { count: 'exact' })
      .eq('question_id', params.id)
      .order('accepted', { ascending: false })
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const answerIds = (data || []).map((answer) => answer.id)
    const { data: votes, error: votesError } = answerIds.length
      ? await supabase.from('answer_votes').select('answer_id, user_id, vote').in('answer_id', answerIds)
      : { data: [], error: null }
    if (votesError) throw votesError

    const { data: { user } } = await supabase.auth.getUser()
    const answers = (data || []).map((answer) => {
      const answerVotes = (votes || []).filter((vote) => vote.answer_id === answer.id)
      return {
        ...answer,
        votes_count: answerVotes.reduce((total, vote) => total + (vote.vote === 'up' ? 1 : -1), 0),
        user_vote: answerVotes.find((vote) => vote.user_id === user?.id)?.vote || null,
      }
    })

    return NextResponse.json({
      answers,
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching answers:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('answer_votes')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable answer voting.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch answers', details }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { body: answerBody } = body

    if (typeof answerBody !== 'string' || !answerBody.trim()) {
      return NextResponse.json({ error: 'Answer body is required' }, { status: 400 })
    }
    if (answerBody.length > 10000) {
      return NextResponse.json({ error: 'Answers must be 10,000 characters or fewer.' }, { status: 400 })
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('author_id')
      .eq('id', params.id)
      .maybeSingle()
    if (questionError) throw questionError
    if (!question) return NextResponse.json({ error: 'Question not found.' }, { status: 404 })

    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: params.id,
        author_id: user.id,
        body: answerBody.trim()
      })
      .select(`
        *,
        author:profiles!answers_author_id_fkey(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    if (question.author_id !== user.id) {
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: question.author_id,
        type: 'answer',
        reference_id: params.id,
        actor_id: user.id,
      })
      if (notificationError) console.error('Failed to notify question author about answer:', notificationError)
    }

    return NextResponse.json({ answer: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating answer:', error)
    return NextResponse.json({ error: 'Failed to create answer', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}