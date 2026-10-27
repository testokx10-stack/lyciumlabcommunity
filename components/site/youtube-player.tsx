'use client';

import { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/lib/data';

export function YouTubePlayer({ video }: { video: Video }) {
  const [enabled, setEnabled] = useState(false);

  if (enabled) {
    return (
      <iframe
        src={video.embed}
        title={video.title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary p-6 text-center"
      role="group"
      aria-label="Lecteur YouTube externe"
    >
      <Youtube size={44} className="text-primary" />
      <p className="max-w-md text-sm text-muted-foreground">
        La lecture charge un lecteur fourni par YouTube. Google peut alors recevoir des données techniques, comme votre adresse IP.
      </p>
      <Button type="button" className="gap-2" onClick={() => setEnabled(true)}>
        <Play size={16} fill="currentColor" /> Charger la vidéo YouTube
      </Button>
    </div>
  );
}
