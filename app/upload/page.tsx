'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Link2, Video } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/lib/data';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const videoUrl = String(formData.get('videoUrl') || '').trim();
    const category = String(formData.get('category') || '').trim();
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(videoUrl);
    } catch {
      setError('Enter a valid video link.');
      return;
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      setError('The video link must start with http:// or https://.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🎥 ${title}\n\n${description}\n\nVideo: ${parsedUrl.toString()}`,
          tag: category,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to share your video. Please try again.');
      }

      router.push('/community');
      router.refresh();
    } catch (submitError) {
      console.error('Failed to share video:', submitError);
      setError(submitError instanceof Error ? submitError.message : 'Unable to share your video. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container-px mx-auto max-w-3xl py-10">
      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Video size={24} />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Share a video</h1>
        <p className="mt-2 text-muted-foreground">
          Share a video link with the Lycium Lab community.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking your account...</p>
        ) : !user ? (
          <div>
            <p className="text-muted-foreground">Log in or create an account to share a video.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild><Link href="/login">Log in</Link></Button>
              <Button asChild variant="outline"><Link href="/register">Create account</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
              <Link2 size={16} className="mt-0.5 shrink-0" />
              Paste a link to a video hosted online. Direct video-file uploads aren’t configured yet.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Video title</Label>
                <Input id="title" name="title" maxLength={120} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" maxLength={2000} rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video link</Label>
                <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Topic</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue=""
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select a topic</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? 'Sharing...' : 'Share with community'} <ArrowRight size={16} />
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
