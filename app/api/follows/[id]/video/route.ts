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

    const { data: existingSub, error: subscriptionError } = await supabase
      .from('video_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', params.id)
      .maybeSingle()
    if (subscriptionError) throw subscriptionError

    if (existingSub) {
      // Unsubscribe
      const { error } = await supabase
        .from('video_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', params.id)

      if (error) throw error

      return NextResponse.json({ subscribed: false })
    } else {
      // Subscribe
      const { error } = await supabase
        .from('video_subscriptions')
        .insert({
          user_id: user.id,
          video_id: params.id
        })

      if (error) throw error

      return NextResponse.json({ subscribed: true })
    }
  } catch (error) {
    console.error('Error toggling subscription:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('video_subscriptions') || details.includes('invalid input syntax for type uuid')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable video subscriptions.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to toggle subscription', details }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let subscribed = false
    if (user) {
      const { data, error } = await supabase
        .from('video_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', params.id)
        .maybeSingle()
      if (error) throw error
      subscribed = !!data
    }

    return NextResponse.json({ subscribed })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    const details = error instanceof Error ? error.message : 'Unexpected database error'
    if (details.includes('video_subscriptions') || details.includes('invalid input syntax for type uuid')) {
      return NextResponse.json({ error: 'Run supabase/community-interactions.sql in Supabase to enable video subscriptions.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch subscription', details }, { status: 500 })
  }
}