import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    if (!user) return NextResponse.json({ error: 'Connectez-vous pour modifier ce commentaire.' }, { status: 401 })

    const body = await request.json()
    if (typeof body.content !== 'string' || !body.content.trim() || body.content.length > 10000) {
      return NextResponse.json({ error: 'Le commentaire doit contenir entre 1 et 10 000 caractères.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content: body.content.trim() })
      .eq('id', commentId)
      .eq('post_id', id)
      .eq('author_id', user.id)
      .select('id, content, created_at, author:profiles!author_id(id, username, full_name, avatar_url, role)')
      .maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Commentaire introuvable ou vous ne pouvez pas le modifier.' }, { status: 404 })
    return NextResponse.json({ comment: data })
  } catch (error) {
    console.error('Failed to edit post comment:', error)
    return NextResponse.json({ error: 'Impossible de modifier le commentaire.', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    if (!user) return NextResponse.json({ error: 'Connectez-vous pour supprimer ce commentaire.' }, { status: 401 })

    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('post_id', id)
      .eq('author_id', user.id)
      .select('id')
      .maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Commentaire introuvable ou vous ne pouvez pas le supprimer.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete post comment:', error)
    return NextResponse.json({ error: 'Impossible de supprimer le commentaire.', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}
