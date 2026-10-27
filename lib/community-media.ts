export const COMMUNITY_MEDIA_BUCKET = 'community-media'
export const MAX_COMMUNITY_MEDIA_SIZE = 50 * 1024 * 1024
export const COMMUNITY_MEDIA_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime'

const extensionsByMimeType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

export type CommunityMediaType = 'image' | 'video'

export function getCommunityMediaType(file: File): CommunityMediaType | null {
  if (!extensionsByMimeType[file.type]) return null
  return file.type.startsWith('image/') ? 'image' : 'video'
}
