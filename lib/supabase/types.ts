export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  role: 'member' | 'expert' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_id: string
  content: string
  image_url: string | null
  tag: string | null
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
  author?: Profile
  liked_by_user?: boolean
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  parent_id: string | null
  created_at: string
  updated_at: string
  author?: Profile
  replies?: Comment[]
}

export interface Question {
  id: string
  author_id: string
  title: string
  body: string
  tag: string
  votes_count: number
  answers_count: number
  views_count: number
  answered: boolean
  accepted_answer_id: string | null
  created_at: string
  updated_at: string
  author?: Profile
  voted_by_user?: 'up' | 'down' | null
}

export interface Answer {
  id: string
  question_id: string
  author_id: string
  body: string
  accepted: boolean
  votes_count: number
  created_at: string
  updated_at: string
  author?: Profile
  voted_by_user?: 'up' | 'down' | null
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Like {
  id: string
  user_id: string
  post_id: string | null
  comment_id: string | null
  answer_id: string | null
  question_id: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'follow' | 'answer' | 'mention' | 'answer_accepted'
  reference_id: string
  actor_id: string
  read: boolean
  created_at: string
  actor?: Profile
}