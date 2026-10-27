import { createClient } from '@/lib/supabase/server'
import { COMMUNITY_MEDIA_BUCKET } from '@/lib/community-media'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError
    if (!user) return NextResponse.json({ error: 'Connectez-vous pour supprimer cette publication.' }, { status: 401 })

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, author_id, media_url, image_url')
      .eq('id', id)
      .maybeSingle()
    if (postError) throw postError
    if (!post) return NextResponse.json({ error: 'Publication introuvable.' }, { status: 404 })
    if (post.author_id !== user.id) return NextResponse.json({ error: 'Vous ne pouvez supprimer que vos propres publications.' }, { status: 403 })

    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)
    if (deleteError) throw deleteError

    const mediaPath = getOwnedCommunityMediaPath(post.media_url || post.image_url, user.id)
    if (mediaPath) {
      const { error: storageError } = await supabase.storage.from(COMMUNITY_MEDIA_BUCKET).remove([mediaPath])
      if (storageError) console.error('Failed to remove deleted post media:', storageError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json({ error: 'Impossible de supprimer la publication.', details: error instanceof Error ? error.message : 'Unexpected database error' }, { status: 500 })
  }
}

function getOwnedCommunityMediaPath(mediaUrl: string | null, userId: string): string | null {
  if (!mediaUrl) return null
  try {
    const url = new URL(mediaUrl)
    const marker = `/storage/v1/object/public/${COMMUNITY_MEDIA_BUCKET}/`
    const markerIndex = url.pathname.indexOf(marker)
    if (markerIndex < 0) return null
    const path = decodeURIComponent(url.pathname.slice(markerIndex + marker.length))
    return path.startsWith(`${userId}/`) ? path : null
  } catch {
    return null
  }
}
