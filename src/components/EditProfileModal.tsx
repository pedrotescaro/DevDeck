'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Camera, Loader2 } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileUser: {
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    institution?: string | null;
    github_username?: string | null;
    discord_username?: string | null;
    banner_url?: string | null;
    pronouns?: string | null;
    birthday?: string | null;
  };
  onSaved: (updatedFields: Record<string, any>) => void;
}

export function EditProfileModal({ open, onClose, profileUser, onSaved }: EditProfileModalProps) {
  const [bio, setBio] = useState(profileUser.bio || '');
  const [institution, setInstitution] = useState(profileUser.institution || '');
  const [githubUsername, setGithubUsername] = useState(profileUser.github_username || '');
  const [discordUsername, setDiscordUsername] = useState(profileUser.discord_username || '');
  const [bannerUrl, setBannerUrl] = useState(profileUser.banner_url || '');
  const [pronouns, setPronouns] = useState(profileUser.pronouns || '');
  const [birthday, setBirthday] = useState(
    profileUser.birthday ? profileUser.birthday.split('T')[0] : ''
  );

  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Sync fields when modal opens
  useEffect(() => {
    if (open) {
      setBio(profileUser.bio || '');
      setInstitution(profileUser.institution || '');
      setGithubUsername(profileUser.github_username || '');
      setDiscordUsername(profileUser.discord_username || '');
      setBannerUrl(profileUser.banner_url || '');
      setPronouns(profileUser.pronouns || '');
      setBirthday(profileUser.birthday ? profileUser.birthday.split('T')[0] : '');
    }
  }, [open, profileUser]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setBannerUrl(data.url);
      }
    } catch (err) {
      console.error('Banner upload failed:', err);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          institution,
          github_username: githubUsername,
          discord_username: discordUsername,
          banner_url: bannerUrl,
          pronouns,
          birthday,
        }),
      });

      if (res.ok) {
        onSaved({
          bio,
          institution,
          github_username: githubUsername,
          discord_username: discordUsername,
          banner_url: bannerUrl,
          pronouns,
          birthday: birthday || null,
        });
        onClose();
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-[600px] max-h-[90vh] bg-dd-bg rounded-2xl overflow-hidden mt-8 mx-4 flex flex-col shadow-2xl border border-dd-border/60"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-dd-border/60 shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-dd-surface/80 text-dd-text transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-base font-extrabold text-dd-text">Editar perfil</h2>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-1.5 bg-dd-text text-dd-bg rounded-full text-sm font-extrabold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow">
              {/* Banner Section */}
              <div className="relative h-40 sm:h-48 bg-dd-surface/30">
                {bannerUrl ? (
                  <Image src={bannerUrl} alt="Banner" fill sizes="100%" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent" />
                )}

                {/* Banner overlay with camera buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="p-2.5 bg-black/60 hover:bg-black/75 rounded-full text-white transition-colors cursor-pointer"
                    title="Alterar banner"
                  >
                    {uploadingBanner ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>
                  {bannerUrl && (
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="p-2.5 bg-black/60 hover:bg-black/75 rounded-full text-white transition-colors cursor-pointer"
                      title="Remover banner"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>

              {/* Avatar (overlapping banner) */}
              <div className="px-4 -mt-12 relative z-10 mb-4">
                {profileUser.avatar_url ? (
                  <Image
                    src={profileUser.avatar_url}
                    alt={profileUser.username}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full border-4 border-dd-bg object-cover bg-dd-surface"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-dd-bg bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl font-black">
                    {profileUser.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="px-4 pb-6 space-y-5">
                {/* Bio */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={160}
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text resize-none focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Fale sobre você..."
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-dd-muted font-mono">
                    {bio.length}/160
                  </span>
                </div>

                {/* Institution */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none z-10">
                    Instituição / Empresa
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Ex: USP, Vercel, Freelancer"
                  />
                </div>

                {/* GitHub Username */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none z-10">
                    GitHub
                  </label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) =>
                      setGithubUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                    }
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                    placeholder="seu-usuario-github"
                  />
                </div>

                {/* Discord Username */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none z-10">
                    Discord
                  </label>
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                    placeholder="seu-usuario-discord"
                  />
                </div>

                {/* Pronouns */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none z-10">
                    Pronomes
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                    placeholder="ele/dele, ela/dela, elu/delu"
                  />
                </div>

                {/* Birthday */}
                <div className="relative group">
                  <label className="absolute top-2.5 left-3 text-[11px] font-semibold text-dd-muted pointer-events-none z-10">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full pt-8 pb-2.5 px-3 border border-dd-border rounded-md bg-transparent text-sm text-dd-text focus:border-orange-500 focus:outline-none transition-colors focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
