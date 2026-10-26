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
        author:profiles!author_id(id, username, full_name, avatar_url, role),
        votes:likes!answer_id(count)
      `)
      .eq('question_id', params.id)
      .order('accepted', { ascending: false })
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({ 
      answers: data || [], 
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching answers:', error)
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 })
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
    const { body: answerBody } = body

    if (!answerBody?.trim()) {
      return NextResponse.json({ error: 'Answer body is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: params.id,
        author_id: user.id,
        body: answerBody.trim()
      })
      .select(`
        *,
        author:profiles!author_id(id, username, full_name, avatar_url, role)
      `)
      .single()

    if (error) throw error

    // Increment answers count on question
    await supabase.rpc('increment_answers_count', { question_id: params.id })

    return NextResponse.json({ answer: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating answer:', error)
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 })
  }
}