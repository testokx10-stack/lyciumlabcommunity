import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '20', 10) || 20))
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    let query = supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!actor_id(id, username, full_name, avatar_url, role)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const [{ data, error, count }, { count: unreadCount, error: unreadError }] = await Promise.all([
      query,
      supabase.from('notifications').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('read', false),
    ])

    if (error) throw error
    if (unreadError) throw unreadError

    return NextResponse.json({ 
      notifications: data || [], 
      total: count || 0,
      unreadCount: unreadCount || 0,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}