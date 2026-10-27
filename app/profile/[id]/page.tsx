import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, MapPin, MessageCircle, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMember, members, timeAgo } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';

type ProfileData = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  role: string | null;
};

type ProfilePost = {
  id: string;
  content: string;
  tag: string | null;
  created_at: string;
  image_url: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const demoMember = getMember(params.id);
  let profile: ProfileData;
  let profilePosts: ProfilePost[] = [];

  if (demoMember) {
    profile = {
      id: demoMember.id,
      username: demoMember.handle,
      full_name: demoMember.name,
      avatar_url: demoMember.avatar,
      bio: demoMember.bio,
      location: demoMember.location,
      role: demoMember.role,
    };
  } else if (uuidPattern.test(params.id)) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, role')
      .eq('id', params.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Unable to load this profile.');
    }
    if (!data) notFound();

    profile = data;
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, tag, created_at, image_url, media_url, media_type')
      .eq('author_id', params.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (postsError) {
      console.error('Error fetching profile posts:', postsError);
      throw new Error('Unable to load this member’s posts.');
    }
    profilePosts = posts || [];
  } else {
    notFound();
  }

  const name = profile.full_name || profile.username || 'Community member';
  const roleLabel = profile.role === 'expert' ? 'Expert' : profile.role === 'moderator' ? 'Moderator' : 'Member';

  return (
    <div className="container-px mx-auto max-w-4xl py-10">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24 ring-2 ring-border">
            <AvatarImage src={profile.avatar_url || undefined} alt={name} />
            <AvatarFallback><UserRound size={32} /></AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold tracking-tight">{name}</h1>
              {(profile.role === 'expert' || profile.role === 'moderator') && (
                <BadgeCheck size={18} className="text-accent" aria-label="Verified member" />
              )}
              <Badge variant="secondary">{roleLabel}</Badge>
            </div>
            {profile.username && <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>}
            {profile.location && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={15} /> {profile.location}
              </p>
            )}
            {profile.bio && <p className="mt-4 leading-relaxed">{profile.bio}</p>}
            <Button asChild className="mt-5 gap-2">
              <Link href="/community"><MessageCircle size={16} /> Visit the community</Link>
            </Button>
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-semibold">Community posts</h2>
        <div className="mt-4 space-y-4">
          {profilePosts.length ? profilePosts.map((post) => (
            <Card key={post.id} className="p-5">
              <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
              {(post.media_url || post.image_url) && (
                post.media_type === 'video' ? (
                  <video src={post.media_url || undefined} controls preload="metadata" className="mt-3 w-full max-h-[28rem] rounded-xl bg-black">
                    Your browser does not support embedded videos.
                  </video>
                ) : (
                  <img src={post.media_url || post.image_url || ''} alt="" className="mt-3 w-full max-h-80 rounded-xl object-cover" loading="lazy" />
                )
              )}
              {post.tag && <Badge variant="secondary" className="mt-3 font-normal">#{post.tag}</Badge>}
              <p className="mt-3 text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
            </Card>
          )) : (
            <Card className="p-5 text-sm text-muted-foreground">
              {demoMember
                ? `${demoMember.name} is a featured community member.`
                : 'No community posts yet.'}
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
