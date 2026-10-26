'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, ImagePlus, Send, TrendingUp, HelpCircle, Users, Flame, BadgeCheck, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MemberCard } from '@/components/site/member-card';
import { posts, questions, members, getMember, formatCount, timeAgo } from '@/lib/data';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'feed', label: 'Community Feed', icon: Users },
  { key: 'qa', label: 'Questions & Answers', icon: HelpCircle },
  { key: 'trending', label: 'Trending', icon: Flame },
];

export default function CommunityPage() {
  const [tab, setTab] = useState('feed');

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="max-w-2xl mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">Community</h1>
        <p className="text-muted-foreground mt-2">
          Share tips, ask questions, and collaborate with farmers, researchers, and agricultural enthusiasts worldwide.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="min-w-0 space-y-6">
          {/* Composer */}
          {tab !== 'qa' && (
            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={members[2].avatar} alt="You" />
                  <AvatarFallback>YT</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Share a tip, discovery, or question with the community..."
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[48px]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground"><ImagePlus size={16} /> Photo</Button>
                    </div>
                    <Button size="sm" className="gap-1.5"><Send size={15} /> Post</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === 'feed' && <Feed />}
          {tab === 'qa' && <QA />}
          {tab === 'trending' && <Feed trendingOnly />}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-1.5 mb-4"><TrendingUp size={16} className="text-accent" /> Active discussions</h3>
            <div className="space-y-4">
              {questions.slice(0, 3).map((q) => (
                <Link key={q.id} href="/community" className="group block">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">{q.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 tabular-nums">{q.answers} answers · {formatCount(q.views)} views</p>
                </Link>
              ))}
            </div>
          </Card>

          <div>
            <h3 className="font-semibold mb-4">Members to follow</h3>
            <div className="grid grid-cols-2 gap-3">
              {members.filter((m) => m.role === 'expert').slice(0, 2).map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>

          <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="font-semibold">Community Guidelines</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Keep it evidence-based, respectful, and practical. Cite sources when you can, and distinguish research from personal experience.
            </p>
            <Button size="sm" variant="outline" className="mt-3 w-full">Read guidelines</Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Feed({ trendingOnly = false }: { trendingOnly?: boolean }) {
  const list = trendingOnly ? posts.filter((p) => p.likes > 150) : posts;
  return (
    <div className="space-y-5">
      {list.map((post) => {
        const author = getMember(post.authorId)!;
        return (
          <Card key={post.id} className="p-5 card-hover">
            <div className="flex items-start gap-3">
              <Link href={`/profile/${author.id}`}>
                <Avatar className="h-11 w-11">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/profile/${author.id}`} className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                    {author.name}
                    {(author.role === 'expert' || author.role === 'moderator') && <BadgeCheck size={14} className="text-accent" />}
                  </Link>
                  <span className="text-sm text-muted-foreground">@{author.handle}</span>
                  <span className="text-sm text-muted-foreground">· {timeAgo(post.postedAt)}</span>
                </div>
                <p className="text-xs text-accent font-medium">{author.title}</p>
                <p className="text-sm mt-2.5 leading-relaxed">{post.content}</p>
                {post.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-border/60">
                    <img src={post.image} alt="" className="w-full max-h-80 object-cover" loading="lazy" />
                  </div>
                )}
                {post.tag && (
                  <Badge variant="secondary" className="mt-3 font-normal">#{post.tag}</Badge>
                )}
                <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Heart size={16} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageCircle size={16} /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Share2 size={16} /> {post.shares}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto">
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function QA() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={members[2].avatar} alt="You" />
            <AvatarFallback>YT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input
              placeholder="Ask an agricultural or scientific question..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground border-b border-border pb-2 focus:border-primary transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <select className="text-xs text-muted-foreground bg-transparent border-0 outline-none">
                <option>Select a topic</option>
                {['soil-science', 'irrigation', 'pest-management'].map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button size="sm" className="gap-1.5"><Send size={14} /> Post question</Button>
            </div>
          </div>
        </div>
      </Card>

      {questions.map((q) => {
        const author = getMember(q.authorId)!;
        return (
          <Card key={q.id} className="p-5 card-hover">
            <div className="flex gap-4">
              <div className="flex flex-col items-center text-center shrink-0">
                <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">▲</button>
                <span className="text-sm font-semibold tabular-nums my-0.5">{q.votes}</span>
                <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={q.answered ? 'default' : 'secondary'} className={q.answered ? 'gap-1 bg-accent border-0' : 'font-normal'}>
                    {q.answered ? 'Answered' : 'Open'}
                  </Badge>
                  <Badge variant="outline" className="font-normal">#{q.tag}</Badge>
                </div>
                <h3 className="font-medium text-lg leading-snug mt-2 hover:text-primary transition-colors cursor-pointer">{q.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{q.body}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{author.name}</span>
                  <span>·</span>
                  <span className="tabular-nums">{q.answers} answers</span>
                  <span>·</span>
                  <span className="tabular-nums">{formatCount(q.views)} views</span>
                  <span>·</span>
                  <span>{timeAgo(q.askedAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}