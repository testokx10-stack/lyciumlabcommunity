import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    if (!user) return NextResponse.json({ error: 'Log in to vote on answers.' }, { status: 401 })

    const body = await request.json()
    if (body.vote !== 'up' && body.vote !== 'down') {
      return NextResponse.json({ error: 'Vote must be "up" or "down".' }, { status: 400 })
    }

    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .select('id')
      .eq('id', params.id)
      .maybeSingle()
    if (answerError) throw answerError
    if (!answer) return NextResponse.json({ error: 'Answer not found.' }, { status: 404 })

    const { data: existingVote, error: existingVoteError } = await supabase
      .from('answer_votes')
      .select('vote')
      .eq('user_id', user.id)
      .eq('answer_id', params.id)
      .maybeSingle()
    if (existingVoteError) throw existingVoteError

    if (existingVote?.vote === body.vote) {
      const { error } = await supabase.from('answer_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('answer_id', params.id)
      if (error) throw error
      return NextResponse.json({ vote: null })
    }

    const { error } = await supabase.from('answer_votes').upsert({
      user_id: user.id,
      answer_id: params.id,
      vote: body.vote,
    }, { onConflict: 'user_id,answer_id' })
    if (error) throw error

    return NextResponse.json({ vote: body.vote })
  } catch (error) {
    console.error('Error voting on answer:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('answer_votes')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable voting.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to vote on answer.', details }, { status: 500 })
  }
}
