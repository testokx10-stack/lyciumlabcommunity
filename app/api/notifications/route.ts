import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const offset = (page - 1) * limit

    let query = supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!actor_id(id, username, full_name, avatar_url, role)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ 
      notifications: data || [], 
      total: count || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}