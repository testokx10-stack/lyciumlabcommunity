'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Camera, LockKeyhole, Save, UserRound } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const AVATAR_BUCKET = 'profile-avatars';

type ProfileForm = {
  full_name: string;
  bio: string;
  location: string;
  avatar_url: string;
};

const emptyProfile: ProfileForm = { full_name: '', bio: '', location: '', avatar_url: '' };

export default function SettingsPage() {
  return <AccountSettings />;
}

function AccountSettings() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (authLoading || !user) {
      setProfileLoading(false);
      return;
    }

    let active = true;
    setProfileLoading(true);
    fetch('/api/profile/settings')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger votre profil.');
        if (active) setProfile({
          full_name: result.profile.full_name || '',
          bio: result.profile.bio || '',
          location: result.profile.location || '',
          avatar_url: result.profile.avatar_url || '',
        });
      })
      .catch((error: unknown) => {
        console.error('Failed to load account profile:', error);
        if (active) setProfileError(error instanceof Error ? error.message : 'Impossible de charger votre profil.');
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => { active = false; };
  }, [authLoading, user]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return;
    }
    const preview = URL.createObjectURL(avatarFile);
    setAvatarPreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [avatarFile]);

  const selectAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    setProfileError('');
    setProfileSuccess('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setProfileError('Choisissez une image JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setProfileError('La photo doit faire 5 Mo ou moins.');
      return;
    }
    if (!file.size) {
      setProfileError('Le fichier choisi est vide.');
      return;
    }
    setAvatarFile(file);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || profileSaving) return;
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');
    let uploadedAvatarPath: string | null = null;

    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const extension = avatarFile.type === 'image/jpeg' ? 'jpg' : avatarFile.type === 'image/png' ? 'png' : 'webp';
        uploadedAvatarPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(uploadedAvatarPath, avatarFile, { contentType: avatarFile.type, upsert: false });
        if (uploadError) throw uploadError;
        avatarUrl = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(uploadedAvatarPath).data.publicUrl;
      }

      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, avatar_url: avatarUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible d’enregistrer votre profil.');

      const previousAvatarUrl = profile.avatar_url;
      setProfile({
        full_name: result.profile.full_name || '',
        bio: result.profile.bio || '',
        location: result.profile.location || '',
        avatar_url: result.profile.avatar_url || '',
      });
      setAvatarFile(null);
      await refreshUser();
      setProfileSuccess('Votre profil a été mis à jour.');

      const previousPath = getOwnedAvatarPath(previousAvatarUrl, user.id);
      if (previousPath && previousPath !== uploadedAvatarPath) {
        const { error: removeError } = await createClient().storage.from(AVATAR_BUCKET).remove([previousPath]);
        if (removeError) console.error('Failed to remove old profile photo:', removeError);
      }
    } catch (error) {
      console.error('Failed to save account profile:', error);
      if (uploadedAvatarPath) {
        const { error: cleanupError } = await createClient().storage.from(AVATAR_BUCKET).remove([uploadedAvatarPath]);
        if (cleanupError) console.error('Failed to clean up unsaved profile photo:', cleanupError);
      }
      setProfileError(error instanceof Error ? error.message : 'Impossible d’enregistrer votre profil.');
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email || passwordSaving) return;
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    setPasswordSaving(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Le mot de passe actuel est incorrect.');

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Votre mot de passe a été changé.');
    } catch (error) {
      console.error('Failed to change password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Impossible de changer le mot de passe.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return <div className="container-px mx-auto max-w-3xl py-10"><p className="text-sm text-muted-foreground">Chargement des paramètres...</p></div>;
  }
  if (!user) {
    return (
      <div className="container-px mx-auto max-w-3xl py-10">
        <Card className="p-6 text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Connectez-vous</Link> pour modifier les paramètres de votre compte.</Card>
      </div>
    );
  }

  const displayedAvatar = avatarPreview || profile.avatar_url || undefined;
  const fallbackName = profile.full_name || user.email || 'U';

  return (
    <div className="container-px mx-auto max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Paramètres du compte</h1>
        <p className="mt-2 text-muted-foreground">Modifiez les informations de votre profil et sécurisez votre compte.</p>
      </div>

      <Card className="mb-6 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="text-primary" size={22} />
          <div><h2 className="font-display text-xl font-semibold">Profil</h2><p className="text-sm text-muted-foreground">Les champs marqués sont visibles sur votre profil public.</p></div>
        </div>
        <form onSubmit={saveProfile} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={displayedAvatar} alt={fallbackName} />
              <AvatarFallback>{fallbackName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar">Photo de profil</Label>
              <Input id="avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectAvatar} className="max-w-sm" />
              <p className="text-xs text-muted-foreground">JPEG, PNG ou WebP, 5 Mo maximum.</p>
              {profile.avatar_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setProfile((current) => ({ ...current, avatar_url: '' }));
                    setAvatarFile(null);
                  }}
                >
                  Retirer la photo
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-email">Adresse e-mail</Label>
            <Input id="account-email" type="email" value={user.email || ''} readOnly disabled />
            <p className="text-xs text-muted-foreground">Pour votre sécurité, le changement d’adresse e-mail n’est pas encore disponible ici.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom affiché</Label>
            <Input id="full_name" value={profile.full_name} onChange={(event) => setProfile((current) => ({ ...current, full_name: event.target.value }))} maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ville ou région</Label>
            <Input id="location" value={profile.location} onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))} maxLength={120} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">À propos de vous</Label>
            <Textarea id="bio" value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} maxLength={500} rows={4} />
            <p className="text-right text-xs text-muted-foreground">{profile.bio.length}/500</p>
          </div>
          {profileError && <p role="alert" className="text-sm text-destructive">{profileError}</p>}
          {profileSuccess && <p role="status" className="text-sm text-primary">{profileSuccess}</p>}
          <Button type="submit" disabled={profileSaving} className="gap-2">
            {profileSaving ? <Camera size={16} /> : <Save size={16} />}
            {profileSaving ? 'Enregistrement...' : 'Enregistrer le profil'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <LockKeyhole className="text-primary" size={22} />
          <div><h2 className="font-display text-xl font-semibold">Mot de passe</h2><p className="text-sm text-muted-foreground">Confirmez votre mot de passe actuel avant de le remplacer.</p></div>
        </div>
        <form onSubmit={changePassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input id="new-password" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
            <Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>
          {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
          {passwordSuccess && <p role="status" className="text-sm text-primary">{passwordSuccess}</p>}
          <Button type="submit" disabled={passwordSaving} className="gap-2">
            <LockKeyhole size={16} /> {passwordSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function getOwnedAvatarPath(avatarUrl: string, userId: string): string | null {
  if (!avatarUrl) return null;
  try {
    const url = new URL(avatarUrl);
    const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    const path = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    return path.startsWith(`${userId}/`) ? path : null;
  } catch {
    return null;
  }
}
