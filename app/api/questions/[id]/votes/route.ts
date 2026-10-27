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
    if (!user) return NextResponse.json({ error: 'Log in to vote on questions.' }, { status: 401 })

    const body = await request.json()
    if (body.vote !== 'up' && body.vote !== 'down') {
      return NextResponse.json({ error: 'Vote must be "up" or "down".' }, { status: 400 })
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', id)
      .maybeSingle()
    if (questionError) throw questionError
    if (!question) return NextResponse.json({ error: 'Question not found.' }, { status: 404 })

    const { data: existingVote, error: existingVoteError } = await supabase
      .from('question_votes')
      .select('vote')
      .eq('user_id', user.id)
      .eq('question_id', id)
      .maybeSingle()
    if (existingVoteError) throw existingVoteError

    if (existingVote?.vote === body.vote) {
      const { error } = await supabase.from('question_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', id)
      if (error) throw error
      return NextResponse.json({ vote: null })
    }

    const { error } = await supabase.from('question_votes').upsert({
      user_id: user.id,
      question_id: id,
      vote: body.vote,
    }, { onConflict: 'user_id,question_id' })
    if (error) throw error

    return NextResponse.json({ vote: body.vote })
  } catch (error) {
    console.error('Error voting on question:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('question_votes')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable voting.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to vote on question.', details }, { status: 500 })
  }
}
