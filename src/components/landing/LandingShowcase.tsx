'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart2,
  Bell,
  Bookmark,
  BookOpen,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Flame,
  Flag,
  GitBranch,
  Globe,
  Heart,
  Home,
  Image as ImageIcon,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Play,
  Repeat2,
  RotateCw,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  User,
  Users2,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { animate, createScope, stagger } from 'animejs';
import NextImage from 'next/image';
import Aurora from '@/components/Aurora';
import { BentoGrid } from '@/components/ui/bento-grid';
import { BorderBeam } from '@/components/ui/border-beam';
import { ParticleCard, GlobalSpotlight, useMobileDetection } from '@/components/ui/MagicBento';
import { Compare } from '@/components/ui/compare';
import { cn } from '@/lib/utils';

interface LandingShowcaseProps {
  initialUser: unknown;
}

const cardClass =
  'relative overflow-hidden rounded-[28px] border border-white/10 bg-[#080808] shadow-[0_28px_100px_-55px_rgba(0,0,0,0.9)]';

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div data-reveal className="mb-14 flex max-w-4xl flex-col gap-6 px-1 sm:mb-16 sm:px-0 lg:mb-20">
      <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
        <span className="flex size-7 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10 text-[9px]">
          {index}
        </span>
        {eyebrow}
      </div>
      <h2 className="font-sans text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="max-w-3xl pt-1 text-base leading-8 text-slate-400 sm:text-lg">{description}</p>
    </div>
  );
}

function FlowPreview() {
  const nodes = [
    { icon: MessageSquareText, label: 'Real post', value: 'React + cache' },
    { icon: BrainCircuit, label: 'AI quiz', value: '4 choices' },
    { icon: Zap, label: 'Verified XP', value: '+45 XP' },
  ];

  return (
    <div className="absolute inset-x-5 top-5 grid gap-3 sm:inset-x-8 sm:top-8">
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <div
            key={node.label}
            className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4 transition-colors hover:border-blue-400/40 hover:bg-blue-400/[0.07]"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{node.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                {node.value}
              </p>
            </div>
            <span className="font-mono text-[10px] text-blue-400">0{index + 1}</span>
            {index < nodes.length - 1 && (
              <span className="absolute -bottom-4 left-9 h-4 w-px bg-gradient-to-b from-blue-400/60 to-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuizPreview() {
  return (
    <div className="absolute inset-x-5 top-5 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-violet-400/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-violet-300">
          AI-generated
        </span>
        <BrainCircuit size={18} className="text-violet-300" />
      </div>
      <p className="text-sm font-medium leading-6 text-slate-200">
        Which strategy avoids another request while the data is still valid?
      </p>
      <div className="mt-4 grid gap-2">
        {['TTL cache', 'New request', 'Remove memoization'].map((option, index) => (
          <div
            key={option}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-xs',
              index === 0
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : 'border-white/8 bg-white/[0.02] text-slate-500'
            )}
          >
            <span className="flex size-5 items-center justify-center rounded-full border border-current/30 font-mono text-[9px]">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsPreview() {
  return (
    <div className="absolute inset-x-5 top-5 grid grid-cols-2 gap-3">
      {[
        ['Contributions', '148'],
        ['Accepted', '62'],
        ['Badges', '18'],
        ['Streak', '12d'],
      ].map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-2xl font-semibold text-white">{value}</p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function HistoryPreview() {
  return (
    <div className="absolute inset-x-5 top-5 space-y-2.5">
      <div className="flex items-center justify-between rounded-xl border border-blue-400/20 bg-blue-500/10 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-blue-400" />
          <span className="font-semibold text-white">Duel won</span>
        </div>
        <span className="font-mono text-[9px] text-blue-300">+100 ELO</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="font-semibold text-white">TypeScript track 100%</span>
        </div>
        <span className="font-mono text-[9px] text-emerald-300">Level 19</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-violet-400/20 bg-violet-500/10 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          <span className="font-semibold text-white">12-day streak</span>
        </div>
        <span className="font-mono text-[9px] text-violet-300">+45 XP</span>
      </div>
    </div>
  );
}

function FeatureCard({
  className,
  icon: Icon,
  label,
  title,
  description,
  preview,
  beam,
}: {
  className?: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  preview: ReactNode;
  beam?: boolean;
}) {
  const isMobile = useMobileDetection();
  return (
    <ParticleCard
      data-reveal=""
      disableAnimations={isMobile}
      particleCount={14}
      glowColor="0, 131, 254"
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      className={cn(
        cardClass,
        'magic-bento-card magic-bento-card--border-glow group min-h-[22rem]',
        className
      )}
      style={
        {
          backgroundColor: '#080808',
          '--glow-color': '0, 131, 254',
        } as React.CSSProperties
      }
    >
      <div className="h-full w-full">
        <div className="absolute inset-0 opacity-90">{preview}</div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#080808] via-[#080808]/95 to-transparent px-6 pb-6 pt-24 sm:px-7">
          <div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-blue-400">
            <Icon size={13} /> {label}
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_45%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        {beam && (
          <BorderBeam
            duration={9}
            size={130}
            borderWidth={1.2}
            colorFrom="#0083fe"
            colorTo="#60a5fa"
          />
        )}
      </div>
    </ParticleCard>
  );
}

function PlatformMockup() {
  const [activeNav, setActiveNav] = useState('home');
  const [activeFeedTab, setActiveFeedTab] = useState<'foryou' | 'following'>('foryou');
  const [likesPost1, setLikesPost1] = useState(0);
  const [hasLikedPost1, setHasLikedPost1] = useState(false);
  const [likesPost2, setLikesPost2] = useState(1);
  const [hasLikedPost2, setHasLikedPost2] = useState(false);
  const [savedPost2, setSavedPost2] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [userPosts, setUserPosts] = useState<Array<{ id: number; text: string; time: string }>>([]);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'learn', label: 'Learn with DevDeck', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'async', label: 'ASYNC', icon: Zap },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const handlePost = () => {
    if (!composerText.trim()) return;
    setUserPosts((prev) => [{ id: Date.now(), text: composerText, time: 'now' }, ...prev]);
    setComposerText('');
  };

  const handleRunCode = () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setCodeOutput('hello world!');
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#000000] font-sans text-xs text-white shadow-2xl shadow-black/80 md:rounded-[24px]">
      <div className="grid grid-cols-1 md:min-h-[640px] md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_300px]">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="hidden border-r border-white/10 bg-[#000000] p-4 md:flex md:flex-col md:justify-between">
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex items-center justify-center size-7 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <NextImage
                  src="/logo.svg"
                  alt="DevDeck"
                  width={18}
                  height={18}
                  className="size-4 object-contain"
                />
              </div>
              <span className="text-base font-bold tracking-tight text-white">DevDeck</span>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={cn(
                      'flex items-center gap-3.5 w-full px-4 py-2.5 text-xs transition-colors text-left bg-transparent',
                      isActive
                        ? 'text-white font-bold'
                        : 'text-slate-400 hover:text-white font-medium'
                    )}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-white fill-white' : 'text-slate-400'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Large Blue Postar Button */}
            <button
              onClick={handlePost}
              className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Pencil size={16} />
              <span>Post</span>
            </button>
          </div>

          {/* User Profile Card (Bottom Left) */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2.5 px-2">
              <div className="size-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-xs text-white shrink-0">
                US
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs truncate">user</span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                    Lvl 1
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">@user</p>
              </div>
            </div>

            <div className="mx-2 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-medium">
              <Flame size={12} className="text-orange-400" />
              <span>1 day of mastery</span>
            </div>
          </div>
        </aside>

        {/* ================= CENTER FEED ================= */}
        <main className="flex min-w-0 flex-col bg-[#000000] lg:border-r lg:border-white/10">
          {/* Mobile app header */}
          <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 md:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <NextImage
                  src="/logo.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-4 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-white">DevDeck</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-blue-400">
                  Community feed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveNav('profile')}
              aria-label="Open profile"
              className={cn(
                'flex size-8 items-center justify-center rounded-full border text-[10px] font-bold transition-colors',
                activeNav === 'profile'
                  ? 'border-blue-400/50 bg-blue-400/15 text-blue-300'
                  : 'border-white/10 bg-slate-900 text-white hover:border-blue-400/40'
              )}
            >
              US
            </button>
          </div>

          {/* Feed Header Tabs */}
          <div className="relative flex items-center border-b border-white/10 h-13 bg-[#000000]/90 backdrop-blur-md sticky top-0 z-10">
            <div className="grid grid-cols-2 w-full h-full pr-12">
              <button
                onClick={() => setActiveFeedTab('foryou')}
                className={cn(
                  'h-full flex items-center justify-center font-bold text-xs relative transition-colors',
                  activeFeedTab === 'foryou' ? 'text-white' : 'text-[#71767b] hover:text-slate-300'
                )}
              >
                <span>For you</span>
                {activeFeedTab === 'foryou' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d9bf0]" />
                )}
              </button>
              <button
                onClick={() => setActiveFeedTab('following')}
                className={cn(
                  'h-full flex items-center justify-center font-bold text-xs relative transition-colors',
                  activeFeedTab === 'following'
                    ? 'text-white'
                    : 'text-[#71767b] hover:text-slate-300'
                )}
              >
                <span>Following</span>
                {activeFeedTab === 'following' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d9bf0]" />
                )}
              </button>
            </div>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
              <RotateCw size={14} />
            </button>
          </div>

          <div className="max-h-[520px] space-y-4 overflow-y-auto overscroll-contain p-3 sm:max-h-[620px] sm:p-5">
            {/* Post Composer Box */}
            <div className="border-b border-white/10 pb-4 space-y-3">
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  US
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder="What’s happening?"
                    className="w-full bg-transparent text-xs text-white placeholder:text-[#71767b] outline-none pt-1 font-medium"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1d9bf0] font-semibold">
                    <Globe size={13} />
                    <span>Anyone can reply</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3.5 text-[#1d9bf0]">
                  <ImageIcon size={16} className="cursor-pointer hover:opacity-80" />
                  <Smile size={16} className="cursor-pointer hover:opacity-80" />
                  <Calendar size={16} className="cursor-pointer hover:opacity-80" />
                  <MapPin size={16} className="cursor-pointer hover:opacity-80" />
                  <Flag size={16} className="cursor-pointer hover:opacity-80" />
                </div>
                <button
                  onClick={handlePost}
                  disabled={!composerText.trim()}
                  className={cn(
                    'px-4 py-1.5 rounded-full font-bold text-xs text-white transition-all',
                    composerText.trim()
                      ? 'bg-[#1d9bf0] hover:bg-[#1a8cd8]'
                      : 'bg-[#1d9bf0]/50 cursor-not-allowed'
                  )}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Dynamic User Posted Cards */}
            {userPosts.map((post) => (
              <div key={post.id} className="border-b border-white/10 pb-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      US
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">@user</span>
                        <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                          Lvl 1
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px] block">Posted {post.time}</span>
                    </div>
                  </div>
                  <MoreHorizontal size={14} className="text-slate-500" />
                </div>
                <p className="text-xs text-slate-200">{post.text}</p>
              </div>
            ))}

            {/* Post 1: Serious technical post */}
            <div className="border-b border-white/10 pb-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    US
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">@user</span>
                      <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                        Lvl 1
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px] block">Posted 2h ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                    Architecture
                  </span>
                  <MoreHorizontal size={14} className="text-slate-500" />
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-5">
                I just finished migrating our critical routes to optimistic rendering with
                distributed caching in Next.js. Response time dropped from 380ms to 42ms in
                production! &#128640;
              </p>

              {/* Action Bar */}
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 px-1">
                <button className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <MessageSquareText size={14} /> <span>0</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-400">
                  <Repeat2 size={14} /> <span>0</span>
                </button>
                <button
                  onClick={() => {
                    setHasLikedPost1(!hasLikedPost1);
                    setLikesPost1((prev) => (hasLikedPost1 ? prev - 1 : prev + 1));
                  }}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors',
                    hasLikedPost1 ? 'text-rose-500' : 'hover:text-rose-500'
                  )}
                >
                  <Heart size={14} className={hasLikedPost1 ? 'fill-rose-500' : ''} />{' '}
                  <span>{likesPost1}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <BarChart2 size={14} /> <span>0</span>
                </button>
                <button className="hover:text-[#1d9bf0]">
                  <Bookmark size={14} />
                </button>
              </div>
            </div>

            {/* Post 2: Python Code + AI Quiz */}
            <div className="border-b border-white/10 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                    US
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">@user</span>
                    <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                      Lvl 1
                    </span>
                    <span className="text-slate-500 text-[10px]">&middot; Posted 8d ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    Python
                  </span>
                  <MoreHorizontal size={14} className="text-slate-500" />
                </div>
              </div>

              {/* Code Box */}
              <div className="rounded-xl border border-white/10 bg-[#080808] overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-[#101010]">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400">
                    PYTHON
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunCode}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-[10px] font-semibold rounded-full transition-colors"
                    >
                      <Play size={11} className="fill-white" />
                      <span>{isRunningCode ? 'Running...' : 'Run'}</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-medium rounded-full border border-white/10 transition-colors">
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 font-mono text-[11px] text-emerald-400 bg-[#040404]">
                  <code>print(&quot;hello world!&quot;)</code>
                </div>
                {codeOutput && (
                  <div className="border-t border-white/10 p-3 bg-black font-mono text-[10px] text-blue-400">
                    <span className="text-slate-500">{`// Terminal Output:`}</span>
                    <p className="mt-1 text-white font-bold">{codeOutput}</p>
                  </div>
                )}
              </div>

              {/* Quiz de Aprendizado Widget */}
              <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Learning Quiz</h5>
                    <p className="text-[10px] text-slate-400">
                      You already completed this challenge!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuizResults(!showQuizResults)}
                  className="px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-semibold text-[10px] transition-colors self-start sm:self-auto"
                >
                  {showQuizResults ? 'Hide Results' : 'View Results'}
                </button>
              </div>

              {showQuizResults && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] text-emerald-300 font-mono">
                  &#10003; Challenge completed! +45 XP added to your profile.
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 px-1">
                <button className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <MessageSquareText size={14} /> <span>0</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-400">
                  <Repeat2 size={14} /> <span>0</span>
                </button>
                <button
                  onClick={() => {
                    setHasLikedPost2(!hasLikedPost2);
                    setLikesPost2((prev) => (hasLikedPost2 ? prev - 1 : prev + 1));
                  }}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors',
                    hasLikedPost2 ? 'text-rose-500' : 'hover:text-rose-500'
                  )}
                >
                  <Heart size={14} className={hasLikedPost2 ? 'fill-rose-500' : ''} />{' '}
                  <span>{likesPost2}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <BarChart2 size={14} /> <span>0</span>
                </button>
                <button
                  onClick={() => setSavedPost2(!savedPost2)}
                  className={cn(
                    'transition-colors',
                    savedPost2 ? 'text-[#1d9bf0]' : 'hover:text-[#1d9bf0]'
                  )}
                >
                  <Bookmark size={14} className={savedPost2 ? 'fill-[#1d9bf0]' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile app navigation */}
          <nav
            aria-label="App navigation"
            className="grid grid-cols-4 border-t border-white/10 bg-[#050505]/95 px-1 py-1.5 backdrop-blur-md md:hidden"
          >
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'explore', label: 'Explore', icon: Search },
              { id: 'learn', label: 'Learn', icon: BookOpen },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    'flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 font-medium transition-colors',
                    isActive ? 'bg-blue-400/10 text-blue-400' : 'text-slate-500 hover:text-white'
                  )}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="truncate text-[8px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="hidden lg:block border-l border-white/10 p-4 space-y-4 bg-[#000000]">
          {/* Search Box */}
          <div className="relative flex items-center rounded-full bg-[#161616] border border-white/10 px-3.5 py-2 text-xs">
            <Search size={14} className="text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none text-xs"
            />
          </div>

          {/* CARD 1: ENGAJAMENTO */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                ENGAGEMENT
              </span>
              <span className="size-2 rounded-full bg-blue-500" />
            </div>

            {/* Flame Streak Indicator */}
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <Flame size={44} className="text-[#1d9bf0] fill-[#1d9bf0]/20 animate-pulse" />
              <p className="mt-2 text-xs font-semibold text-blue-400 tracking-wide">
                &lt; 1 day streak &gt;
              </p>
            </div>

            {/* Streak Milestones Row */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 border-t border-white/5 pt-3">
              <div className="flex flex-col items-center gap-1">
                <Flame size={12} className="text-amber-500" />
                <span>5d</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Flame size={12} className="text-blue-400" />
                <span>10d</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Flame size={12} className="text-purple-400" />
                <span>50d</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Flame size={12} className="text-pink-400" />
                <span>100d</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Flame size={12} className="text-rose-500" />
                <span>200d</span>
              </div>
            </div>

            {/* XP and Level */}
            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">XP Earned</span>
                <span className="text-white">425 XP</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>LEVEL PROGRESS</span>
                  <span>LVL 1</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#1d9bf0] rounded-full w-[35%]" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: CONQUISTAS */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                ACHIEVEMENTS
              </span>
              <Bookmark size={14} className="text-blue-400" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center p-2 text-center"
                >
                  <Lock size={16} className="text-slate-600 mb-1" />
                  <span className="text-[8px] text-slate-600 font-mono">Locked</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: MINHAS TRILHAS */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                MY TRACKS
              </span>
              <Sparkles size={14} className="text-blue-400" />
            </div>

            <div className="space-y-3 pt-1">
              {/* JavaScript */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">JavaScript</span>
                  <span className="text-[10px] font-mono text-slate-400">Lvl 1</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[25%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>380 XP</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Python */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Python</span>
                  <span className="text-[10px] font-mono text-slate-400">Lvl 1</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[5%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>35 XP</span>
                  <span>2%</span>
                </div>
              </div>

              {/* TypeScript */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">TypeScript</span>
                  <span className="text-[10px] font-mono text-slate-400">Lvl 1</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[0%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>0 XP</span>
                  <span>0%</span>
                </div>
              </div>

              {/* Rust */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Rust</span>
                  <span className="text-[10px] font-mono text-slate-400">Lvl 1</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-[0%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>0 XP</span>
                  <span>0%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div
        className="flex h-5 items-start justify-center bg-black pt-2 md:hidden"
        aria-hidden="true"
      >
        <span className="h-1 w-24 rounded-full bg-white/65" />
      </div>
    </div>
  );
}

const trails = [
  { language: 'TypeScript', level: 19, progress: 92, modules: '28 / 30', color: '#0083fe' },
  { language: 'Python', level: 12, progress: 68, modules: '19 / 28', color: '#f5c542' },
  { language: 'Rust', level: 8, progress: 44, modules: '11 / 25', color: '#e87945' },
];

function TrailCard({ trail, index }: { trail: (typeof trails)[number]; index: number }) {
  return (
    <article data-reveal className={cn(cardClass, 'group p-6 sm:p-7')}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
            Track 0{index + 1}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{trail.language}</h3>
        </div>
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-xs text-white">
          L{trail.level}
        </span>
      </div>
      <div className="mt-12">
        <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
          <span>{trail.modules} modules</span>
          <span style={{ color: trail.color }}>{trail.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-[width] duration-700 group-hover:brightness-125"
            style={{
              width: `${trail.progress}%`,
              backgroundColor: trail.color,
              boxShadow: `0 0 20px ${trail.color}`,
            }}
          />
        </div>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-5 text-xs">
        <span className="text-slate-500">Next: advanced patterns</span>
        <ArrowRight size={15} style={{ color: trail.color }} />
      </div>
    </article>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div data-reveal className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
      <Icon size={18} className="text-blue-400" />
      <p className="mt-6 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default function LandingShowcase({ initialUser }: LandingShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const howGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scope = createScope({ root });
    scope.add(() => {
      const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-anime-section]'));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const targets = entry.target.querySelectorAll<HTMLElement>('[data-reveal]');
            scope.execute(() => {
              animate(targets, {
                opacity: { from: 0 },
                y: { from: 32 },
                scale: { from: 0.985 },
                duration: 850,
                delay: stagger(75),
                ease: 'outExpo',
              });
            });
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      sections.forEach((section) => observer.observe(section));
      return () => observer.disconnect();
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-black text-white">
      <section
        className="relative border-y border-white/8 bg-black px-6 py-5"
        aria-label="Platform activity"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500 sm:justify-between">
          {[
            ['LIVE', '284 devs'],
            ['POSTS TODAY', '+1,247'],
            ['XP DISTRIBUTED', '84,290'],
            ['ACTIVE DUELS', '38'],
          ].map(([label, value], index) => (
            <div key={label} className="flex items-center gap-3">
              {index === 0 && (
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              )}
              <span>{label}</span>
              <strong className="font-semibold text-slate-200">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how"
        data-anime-section
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:py-36 bento-section"
      >
        <GlobalSpotlight gridRef={howGridRef} glowColor="0, 131, 254" spotlightRadius={300} />
        <SectionHeading
          index="01"
          eyebrow="How it works"
          title={
            <>
              One contribution. <span className="text-blue-400">Three signals of skill.</span>
            </>
          }
          description="DevDeck turns technical discussions into verifiable evidence: you publish, prove your understanding, and grow in public."
        />
        <div ref={howGridRef} className="bento-section">
          <BentoGrid className="auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            <FeatureCard
              className="md:col-span-2 lg:col-span-4"
              icon={GitBranch}
              label="Complete flow"
              title="From a real problem to verified XP"
              description="Every post starts a clear journey — discussion, contextual quiz, and progress recorded on your profile."
              preview={<FlowPreview />}
              beam
            />
            <FeatureCard
              className="lg:col-span-2"
              icon={BrainCircuit}
              label="Adaptive quiz"
              title="AI that tests context"
              description="Questions come from the published code, never generic exercises."
              preview={<QuizPreview />}
            />
            <FeatureCard
              className="lg:col-span-3"
              icon={Users2}
              label="Community"
              title="Feedback that builds reputation"
              description="Helpful answers gain visibility and strengthen your public track record."
              preview={<MetricsPreview />}
            />
            <FeatureCard
              className="lg:col-span-3"
              icon={ShieldCheck}
              label="Verifiable proof"
              title="Let your track record speak first"
              description="Tracks, duels, and contributions create a living picture of your growth."
              preview={<HistoryPreview />}
            />
          </BentoGrid>
        </div>
      </section>

      <section
        id="platform"
        data-anime-section
        className="relative border-y border-white/8 bg-black px-4 py-24 sm:px-6 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="02"
            eyebrow="The platform"
            title={
              <>
                Everything happens in <span className="text-blue-400">one flow.</span>
              </>
            }
            description="Feed, tracks, quizzes, duels, and profile work together so every action strengthens your technical identity."
          />
          <div data-reveal className="relative mx-auto w-full max-w-[380px] md:max-w-none">
            <span
              aria-hidden="true"
              className="absolute -left-1 top-28 h-11 w-1 rounded-l-full bg-[#303640] shadow-[inset_1px_0_rgba(255,255,255,0.18)] md:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute -left-1 top-44 h-16 w-1 rounded-l-full bg-[#303640] shadow-[inset_1px_0_rgba(255,255,255,0.18)] md:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute -right-1 top-36 h-20 w-1 rounded-r-full bg-[#303640] shadow-[inset_-1px_0_rgba(255,255,255,0.18)] md:hidden"
            />

            <div className="relative overflow-hidden rounded-[44px] border-[5px] border-[#242932] bg-[#030303] p-1.5 pt-8 shadow-[0_30px_80px_-24px_rgba(0,131,254,0.38),0_22px_65px_-30px_rgba(0,0,0,0.95)] md:rounded-[28px] md:border md:border-white/10 md:bg-[#080808] md:p-3 md:shadow-[0_28px_100px_-55px_rgba(0,0,0,0.9)]">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-2 z-30 flex h-5 w-24 -translate-x-1/2 items-center justify-end rounded-full border border-white/5 bg-black px-2 shadow-[0_1px_0_rgba(255,255,255,0.08)] md:hidden"
              >
                <span className="size-1.5 rounded-full bg-[#0b1d33] ring-1 ring-blue-400/20" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[6px] z-20 rounded-[36px] bg-[linear-gradient(135deg,rgba(255,255,255,0.055),transparent_22%)] md:hidden"
              />

              <PlatformMockup />
              <BorderBeam
                duration={12}
                size={180}
                borderWidth={1.2}
                colorFrom="#0083fe"
                colorTo="#60a5fa"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="trails"
        data-anime-section
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:py-36"
      >
        <SectionHeading
          index="03"
          eyebrow="Tracks and progression"
          title={
            <>
              Growth you can <span className="text-blue-400">see.</span>
            </>
          }
          description="Each technology has its own path, level, and evidence. You always know where you are and what to master next."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {trails.map((trail, index) => (
            <TrailCard key={trail.language} trail={trail} index={index} />
          ))}
        </div>

        <div
          id="gamify"
          data-reveal
          className={cn(cardClass, 'mt-4 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:p-10')}
        >
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-orange-300">
                <Flame size={14} /> Progression system
              </div>
              <h3 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Consistency becomes a competitive edge.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                Streaks, achievements, and leagues reward depth — not just activity volume.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
              {['12-day streak', 'Diamond league', '18 badges'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={Flame} value="12" label="Day streak" />
            <MetricCard icon={Trophy} value="#24" label="Global ranking" />
            <MetricCard icon={BadgeCheck} value="18" label="Achievements" />
            <MetricCard icon={Zap} value="8.4k" label="Total XP" />
          </div>
          <BorderBeam duration={11} size={150} colorFrom="#0083fe" colorTo="#60a5fa" />
        </div>
      </section>

      <section
        id="duels"
        data-anime-section
        className="relative border-y border-white/8 bg-black px-4 py-24 sm:px-6 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="04"
            eyebrow="Code duels"
            title={
              <>
                Real pressure. <span className="text-blue-400">Better code.</span>
              </>
            }
            description="Jump into fast matches against developers at your level and prove your technical decisions while the clock is running."
          />
          <div data-reveal className={cn(cardClass, 'grid lg:grid-cols-[0.78fr_1.22fr]')}>
            <div className="flex flex-col justify-between border-b border-white/8 p-7 lg:border-b-0 lg:border-r lg:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-rose-400/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-rose-300">
                    Final round
                  </span>
                  <span className="font-mono text-sm text-white">02:14</span>
                </div>
                <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                  <div>
                    <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold">
                      US
                    </span>
                    <p className="mt-3 text-sm font-semibold">user.dev</p>
                    <p className="mt-1 text-[10px] text-blue-300">1.420 ELO</p>
                  </div>
                  <Swords size={22} className="text-slate-600" />
                  <div>
                    <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-violet-500 text-lg font-bold">
                      MK
                    </span>
                    <p className="mt-3 text-sm font-semibold">maya.kernel</p>
                    <p className="mt-1 text-[10px] text-violet-300">1.398 ELO</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-400/[0.06] p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-blue-300">
                  Challenge
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Reduce complexity without changing the output order.
                </p>
              </div>
            </div>

            <div className="min-w-0 bg-black p-4 sm:p-6 flex flex-col justify-between">
              <div className="w-full mb-3 flex items-center justify-end">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
                  COMPARE PROBLEM VS SOLUTION (HOVER)
                </span>
              </div>
              <div className="w-full flex justify-center overflow-hidden rounded-2xl bg-black">
                <Compare
                  firstImage="https://assets.aceternity.com/code-problem.png"
                  secondImage="https://assets.aceternity.com/code-solution.png"
                  firstImageClassName="object-cover object-left-top rounded-2xl"
                  secondImageClassname="object-cover object-left-top rounded-2xl"
                  className="h-[250px] w-full md:h-[380px] bg-black"
                  slideMode="hover"
                />
              </div>
              <div className="mt-3 w-full flex items-center justify-between rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-2.5 text-xs">
                <span className="flex items-center gap-2 text-emerald-300">
                  <Check size={14} /> 14 tests passed
                </span>
                <span className="font-mono text-[9px] text-slate-500">38ms</span>
              </div>
            </div>
            <BorderBeam duration={8} size={130} colorFrom="#0083fe" colorTo="#60a5fa" />
          </div>
        </div>
      </section>

      <section
        id="start"
        data-anime-section
        className="relative border-t border-white/8 px-4 py-24 sm:px-6 lg:py-32"
      >
        <div
          data-reveal
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-blue-300/15 bg-black px-5 py-16 text-center sm:px-10 sm:py-20 lg:py-28"
        >
          <div className="absolute inset-0 opacity-30">
            <Aurora
              colorStops={['#00152e', '#0083fe', '#7c3aed']}
              amplitude={0.9}
              blend={0.65}
              speed={0.55}
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,0,0,0.45),rgba(0,0,0,0.94)_70%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-blue-200">
              <Terminal size={13} /> Your next line earns XP
            </div>
            <h2 className="mt-7 font-sans text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Stop saying you can. <span className="text-blue-300">Show it.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-50/65">
              Turn real experience into public technical reputation.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={initialUser ? '/feed' : '/register'}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#04101f] transition-transform hover:-translate-y-0.5"
              >
                {initialUser ? 'Go to Feed' : 'Create my profile'}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Review how it works
              </a>
            </div>
          </div>
          <BorderBeam
            duration={10}
            size={180}
            borderWidth={1.4}
            colorFrom="#0083fe"
            colorTo="#60a5fa"
          />
        </div>
      </section>
    </div>
  );
}
