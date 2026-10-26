import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
    const { vote } = body // 'up' or 'down'

    if (!['up', 'down'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
    }

    // Check existing vote
    const { data: existingVote } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', params.id)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('likes')
        .update({ vote }) // Note: we'd need a vote column on likes table
        .eq('user_id', user.id)
        .eq('question_id', params.id)

      if (error) throw error
    } else {
      // Create new vote - we need to handle this differently since likes table doesn't have vote column
      // For simplicity, we'll use a separate approach - maybe add a vote column or use separate table
      // For now, let's just use the likes table with a vote direction
      return NextResponse.json({ error: 'Vote system needs likes table update' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting on question:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}