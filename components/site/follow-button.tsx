'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function FollowButton({ profileId }: { profileId: string }) {
  const { user, loading } = useAuth();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isRealProfile = uuidPattern.test(profileId);

  useEffect(() => {
    if (!isRealProfile || loading || !user || user.id === profileId) return;
    let active = true;
    fetch(`/api/follows/${profileId}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load follow status.');
        if (active) setFollowing(result.following);
      })
      .catch((requestError: unknown) => {
        console.error('Failed to load follow status:', requestError);
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load follow status.');
      });
    return () => { active = false; };
  }, [isRealProfile, loading, profileId, user]);

  const toggleFollow = async () => {
    if (!user || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/follows/${profileId}`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update follow status.');
      setFollowing(result.following);
    } catch (requestError) {
      console.error('Failed to update follow status:', requestError);
      setError(requestError instanceof Error ? requestError.message : 'Unable to update follow status.');
    } finally {
      setBusy(false);
    }
  };

  if (!isRealProfile) {
    return <Button size="sm" variant="outline" className="mt-4 w-full" disabled>Profil de démonstration</Button>;
  }
  if (loading) {
    return <Button size="sm" variant="outline" className="mt-4 w-full" disabled>Chargement...</Button>;
  }
  if (!user) {
    return <Button asChild size="sm" variant="outline" className="mt-4 w-full"><Link href="/login">Connectez-vous pour suivre</Link></Button>;
  }
  if (user.id === profileId) return null;

  return (
    <div className="mt-4 w-full">
      <Button size="sm" variant={following ? 'secondary' : 'outline'} className="w-full" disabled={busy} onClick={toggleFollow}>
        <Users size={14} className="mr-1.5" /> {busy ? 'Mise à jour...' : following ? 'Ne plus suivre' : 'Suivre'}
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
