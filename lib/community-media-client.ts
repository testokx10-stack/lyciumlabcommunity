import type { User } from '@supabase/supabase-js'
import { Upload } from 'tus-js-client'
import { createClient } from '@/lib/supabase/client'
import { COMMUNITY_MEDIA_BUCKET, getCommunityMediaType, MAX_COMMUNITY_MEDIA_SIZE } from '@/lib/community-media'

const extensionsByMimeType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

export async function uploadCommunityMedia(
  file: File,
  user: User,
  onProgress?: (percentage: number) => void
) {
  const mediaType = getCommunityMediaType(file)
  if (!mediaType) {
    throw new Error('Choose a JPEG, PNG, GIF, or WebP image, or an MP4, WebM, or MOV video.')
  }
  if (file.size > MAX_COMMUNITY_MEDIA_SIZE) {
    throw new Error('Files must be 50 MB or smaller.')
  }

  const path = `${user.id}/${crypto.randomUUID()}.${extensionsByMimeType[file.type]}`
  const supabase = createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session) throw new Error('Log in again before uploading media.')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured for file uploads.')
  }
  const projectId = new URL(supabaseUrl).hostname.split('.')[0]

  await new Promise<void>((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        apikey: supabaseAnonKey,
        'x-upsert': 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: COMMUNITY_MEDIA_BUCKET,
        objectName: path,
        contentType: file.type,
        cacheControl: '3600',
      },
      onProgress(bytesSent, bytesTotal) {
        onProgress?.(Math.round((bytesSent / bytesTotal) * 100))
      },
      onError(error) {
        console.error('Failed to upload community media:', error)
        const message = error.message.toLowerCase().includes('bucket')
          ? 'Community media storage is not set up yet. Run the provided Supabase SQL setup first.'
          : error.message
        reject(new Error(message))
      },
      onSuccess() {
        resolve()
      },
    })

    upload.start()
  })

  return { path, mediaType }
}

export async function removeCommunityMedia(path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(COMMUNITY_MEDIA_BUCKET).remove([path])
  if (error) {
    console.error('Failed to clean up uploaded community media:', error)
  }
}
