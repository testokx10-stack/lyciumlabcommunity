import Link from 'next/link';
import { BadgeCheck, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FollowButton } from '@/components/site/follow-button';
import { Member, formatCount } from '@/lib/data';
import { cn } from '@/lib/utils';

const roleLabel: Record<Member['role'], string> = {
  member: 'Membre',
  expert: 'Expert vérifié',
  moderator: 'Modérateur',
  admin: 'Administrateur',
};

export function MemberCard({ member, className }: { member: Member; className?: string }) {
  return (
    <Card className={cn('p-5 card-hover flex flex-col items-center text-center', className)}>
      <Link href={`/profile/${member.id}`} className="relative">
        <Avatar className="h-20 w-20 ring-2 ring-border">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        {(member.role === 'expert' || member.role === 'moderator') && (
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-accent text-white ring-2 ring-card">
            <BadgeCheck size={15} />
          </span>
        )}
      </Link>
      <Link href={`/profile/${member.id}`} className="mt-3 font-semibold hover:text-primary transition-colors">
        {member.name}
      </Link>
      <p className="text-xs text-accent font-medium mt-0.5">{roleLabel[member.role]}</p>
      <p className="text-sm text-muted-foreground mt-1.5 leading-snug line-clamp-2">{member.title}</p>
      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
        <MapPin size={12} /> {member.location}
      </p>
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground tabular-nums">
        <span><b className="text-foreground">{formatCount(member.followers)}</b> abonnés</span>
        <span><b className="text-foreground">{member.contributions}</b> publications</span>
      </div>
      <FollowButton profileId={member.id} />
    </Card>
  );
}

export function MemberAvatarRow({ member, size = 36 }: { member: Member; size?: number }) {
  return (
    <Link href={`/profile/${member.id}`} className="flex items-center gap-2.5 group">
      <Avatar style={{ height: size, width: size }} className="ring-1 ring-border">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors flex items-center gap-1">
          {member.name}
          {member.role === 'expert' && <BadgeCheck size={13} className="text-accent" />}
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.title}</p>
      </div>
    </Link>
  );
}
