import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Check if already subscribed
    const { data: existingSub } = await supabase
      .from('video_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', params.id)
      .single()

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
    return NextResponse.json({ error: 'Failed to toggle subscription' }, { status: 500 })
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
      const { data } = await supabase
        .from('video_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', params.id)
        .single()
      subscribed = !!data
    }

    return NextResponse.json({ subscribed })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}