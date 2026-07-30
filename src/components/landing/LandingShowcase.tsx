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
    <div data-reveal className="mb-12 flex max-w-3xl flex-col gap-5 lg:mb-16">
      <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400">
        <span className="flex size-7 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10 text-[9px]">
          {index}
        </span>
        {eyebrow}
      </div>
      <h2 className="font-sans text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{description}</p>
    </div>
  );
}

function FlowPreview() {
  const nodes = [
    { icon: MessageSquareText, label: 'Post real', value: 'React + cache' },
    { icon: BrainCircuit, label: 'Quiz IA', value: '4 alternativas' },
    { icon: Zap, label: 'XP validado', value: '+45 XP' },
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
          Gerado por IA
        </span>
        <BrainCircuit size={18} className="text-violet-300" />
      </div>
      <p className="text-sm font-medium leading-6 text-slate-200">
        Qual estrat&eacute;gia evita uma nova busca quando o dado ainda &eacute; v&aacute;lido?
      </p>
      <div className="mt-4 grid gap-2">
        {['Cache com TTL', 'Novo request', 'Remover memo'].map((option, index) => (
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
        ['Contribui\u00e7\u00f5es', '148'],
        ['Aceitas', '62'],
        ['Badges', '18'],
        ['Sequ\u00eancia', '12d'],
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
          <span className="font-semibold text-white">Duelo Vencido</span>
        </div>
        <span className="font-mono text-[9px] text-blue-300">+100 ELO</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="font-semibold text-white">Trilha TypeScript 100%</span>
        </div>
        <span className="font-mono text-[9px] text-emerald-300">N&iacute;vel 19</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-violet-400/20 bg-violet-500/10 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          <span className="font-semibold text-white">12 Dias de Ofensiva</span>
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
    { id: 'home', label: 'Página Inicial', icon: Home },
    { id: 'explore', label: 'Explorar', icon: Search },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'learn', label: 'Aprender com DevDeck', icon: BookOpen },
    { id: 'chat', label: 'Bate-papo', icon: MessageCircle },
    { id: 'async', label: 'ASYNC', icon: Zap },
    { id: 'bookmarks', label: 'Itens salvos', icon: Bookmark },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'more', label: 'Mais', icon: MoreHorizontal },
  ];

  const handlePost = () => {
    if (!composerText.trim()) return;
    setUserPosts((prev) => [{ id: Date.now(), text: composerText, time: 'agora' }, ...prev]);
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
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#000000] text-white shadow-2xl shadow-black/80 font-sans text-xs">
      <div className="grid min-h-[640px] grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_300px]">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="border-r border-white/10 p-4 flex flex-col justify-between bg-[#000000]">
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
              <span>Postar</span>
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
                  <span className="font-bold text-white text-xs truncate">usuario</span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                    Lvl 1
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">@usuario</p>
              </div>
            </div>

            <div className="mx-2 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-medium">
              <Flame size={12} className="text-orange-400" />
              <span>1 dia de domínio</span>
            </div>
          </div>
        </aside>

        {/* ================= CENTER FEED ================= */}
        <main className="border-r border-white/10 bg-[#000000] flex flex-col min-w-0">
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
                <span>Para você</span>
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
                <span>Seguindo</span>
                {activeFeedTab === 'following' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d9bf0]" />
                )}
              </button>
            </div>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
              <RotateCw size={14} />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[620px]">
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
                    placeholder="O que está acontecendo?"
                    className="w-full bg-transparent text-xs text-white placeholder:text-[#71767b] outline-none pt-1 font-medium"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1d9bf0] font-semibold">
                    <Globe size={13} />
                    <span>Qualquer pessoa pode responder</span>
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
                  Postar
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
                        <span className="font-bold text-white text-xs">@usuario</span>
                        <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                          Lvl 1
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px] block">Postado {post.time}</span>
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
                      <span className="font-bold text-white text-xs">@usuario</span>
                      <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                        Lvl 1
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px] block">Postado 2h atrás</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                    Arquitetura
                  </span>
                  <MoreHorizontal size={14} className="text-slate-500" />
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-5">
                Acabei de finalizar a migra&ccedil;&atilde;o das nossas rotas cr&iacute;ticas para
                renderiza&ccedil;&atilde;o otimista com cache distribu&iacute;do no Next.js. O tempo
                de resposta caiu de 380ms para 42ms em produ&ccedil;&atilde;o! &#128640;
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
                    <span className="font-bold text-white text-xs">@usuario</span>
                    <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 font-mono text-[9px] rounded">
                      Lvl 1
                    </span>
                    <span className="text-slate-500 text-[10px]">&middot; Postado 8d atrás</span>
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
                      <span>{isRunningCode ? 'Rodando...' : 'Executar'}</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-medium rounded-full border border-white/10 transition-colors">
                      <Copy size={11} />
                      <span>Copiar</span>
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
                    <h5 className="font-bold text-white text-xs">Quiz de Aprendizado</h5>
                    <p className="text-[10px] text-slate-400">Você já respondeu a este desafio!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuizResults(!showQuizResults)}
                  className="px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-semibold text-[10px] transition-colors self-start sm:self-auto"
                >
                  {showQuizResults ? 'Ocultar Resultados' : 'Ver Resultados'}
                </button>
              </div>

              {showQuizResults && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] text-emerald-300 font-mono">
                  ✓ Desafio concluído com sucesso! +45 XP adicionados ao perfil.
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
              placeholder="Buscar"
              className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none text-xs"
            />
          </div>

          {/* CARD 1: ENGAJAMENTO */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                ENGAJAMENTO
              </span>
              <span className="size-2 rounded-full bg-blue-500" />
            </div>

            {/* Flame Streak Indicator */}
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <Flame size={44} className="text-[#1d9bf0] fill-[#1d9bf0]/20 animate-pulse" />
              <p className="mt-2 text-xs font-semibold text-blue-400 tracking-wide">
                &lt; 1 dia de ofensiva &gt;
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
                <span className="text-slate-400">XP Acumulado</span>
                <span className="text-white">425 XP</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>PROGRESSO DO NIVEL</span>
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
                CONQUISTAS
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
                  <span className="text-[8px] text-slate-600 font-mono">Bloqueado</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: MINHAS TRILHAS */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                MINHAS TRILHAS
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
            Trilha 0{index + 1}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{trail.language}</h3>
        </div>
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-xs text-white">
          L{trail.level}
        </span>
      </div>
      <div className="mt-12">
        <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
          <span>{trail.modules} m&oacute;dulos</span>
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
        <span className="text-slate-500">Pr&oacute;ximo: padr&otilde;es avan&ccedil;ados</span>
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
        aria-label="Atividade da plataforma"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500 sm:justify-between">
          {[
            ['AO VIVO', '284 devs'],
            ['POSTS HOJE', '+1.247'],
            ['XP DISTRIBU\u00cdDO', '84.290'],
            ['DUELOS ATIVOS', '38'],
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
        className="relative mx-auto max-w-7xl px-6 py-28 lg:py-36 bento-section"
      >
        <GlobalSpotlight gridRef={howGridRef} glowColor="0, 131, 254" spotlightRadius={300} />
        <SectionHeading
          index="01"
          eyebrow="Como funciona"
          title={
            <>
              Uma contribui&ccedil;&atilde;o.{' '}
              <span className="text-blue-400">Tr&ecirc;s sinais de habilidade.</span>
            </>
          }
          description="O DevDeck transforma discuss&otilde;es t&eacute;cnicas em evid&ecirc;ncia verific&aacute;vel: voc&ecirc; publica, prova que entendeu e evolui em p&uacute;blico."
        />
        <div ref={howGridRef} className="bento-section">
          <BentoGrid className="auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            <FeatureCard
              className="md:col-span-2 lg:col-span-4"
              icon={GitBranch}
              label="Fluxo completo"
              title="Do problema real ao XP comprovado"
              description="Cada post aciona uma jornada clara &mdash; discuss&atilde;o, quiz contextual e progress&atilde;o registrada no perfil."
              preview={<FlowPreview />}
              beam
            />
            <FeatureCard
              className="lg:col-span-2"
              icon={BrainCircuit}
              label="Quiz adaptativo"
              title="IA que testa contexto"
              description="Perguntas nascem do c&oacute;digo publicado, sem exerc&iacute;cios gen&eacute;ricos."
              preview={<QuizPreview />}
            />
            <FeatureCard
              className="lg:col-span-3"
              icon={Users2}
              label="Comunidade"
              title="Feedback que vira reputa&ccedil;&atilde;o"
              description="Respostas &uacute;teis ganham visibilidade e fortalecem seu hist&oacute;rico p&uacute;blico."
              preview={<MetricsPreview />}
            />
            <FeatureCard
              className="lg:col-span-3"
              icon={ShieldCheck}
              label="Prova verific&aacute;vel"
              title="Seu hist&oacute;rico fala primeiro"
              description="Trilhas, duelos e contribui&ccedil;&otilde;es comp&otilde;em um retrato vivo da sua evolu&ccedil;&atilde;o."
              preview={<HistoryPreview />}
            />
          </BentoGrid>
        </div>
      </section>

      <section
        id="platform"
        data-anime-section
        className="relative border-y border-white/8 bg-black px-6 py-28 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="02"
            eyebrow="A plataforma"
            title={
              <>
                Tudo acontece em um <span className="text-blue-400">&uacute;nico fluxo.</span>
              </>
            }
            description="Feed, trilhas, quizzes, duelos e perfil conectados para que cada a&ccedil;&atilde;o fortale&ccedil;a sua identidade t&eacute;cnica."
          />
          <div data-reveal className={cn(cardClass, 'p-2 sm:p-3')}>
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
      </section>

      <section
        id="trails"
        data-anime-section
        className="relative mx-auto max-w-7xl px-6 py-28 lg:py-36"
      >
        <SectionHeading
          index="03"
          eyebrow="Trilhas e progress&atilde;o"
          title={
            <>
              Evolu&ccedil;&atilde;o que voc&ecirc; consegue{' '}
              <span className="text-blue-400">enxergar.</span>
            </>
          }
          description="Cada tecnologia tem seu pr&oacute;prio caminho, n&iacute;vel e evid&ecirc;ncias. Voc&ecirc; sabe onde est&aacute; e o que falta dominar."
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
                <Flame size={14} /> Sistema de progress&atilde;o
              </div>
              <h3 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Consist&ecirc;ncia vira vantagem competitiva.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                Ofensivas, conquistas e ligas recompensam profundidade &mdash; n&atilde;o apenas
                volume de atividade.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
              {['Streak 12 dias', 'Liga diamante', '18 badges'].map((item) => (
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
            <MetricCard icon={Flame} value="12" label="Dias seguidos" />
            <MetricCard icon={Trophy} value="#24" label="Ranking global" />
            <MetricCard icon={BadgeCheck} value="18" label="Conquistas" />
            <MetricCard icon={Zap} value="8.4k" label="XP total" />
          </div>
          <BorderBeam duration={11} size={150} colorFrom="#0083fe" colorTo="#60a5fa" />
        </div>
      </section>

      <section
        id="duels"
        data-anime-section
        className="relative border-y border-white/8 bg-black px-6 py-28 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="04"
            eyebrow="Duelos de c&oacute;digo"
            title={
              <>
                Press&atilde;o real. <span className="text-blue-400">C&oacute;digo melhor.</span>
              </>
            }
            description="Entre em partidas r&aacute;pidas contra devs do seu n&iacute;vel e prove decis&otilde;es t&eacute;cnicas com o tempo correndo."
          />
          <div data-reveal className={cn(cardClass, 'grid lg:grid-cols-[0.78fr_1.22fr]')}>
            <div className="flex flex-col justify-between border-b border-white/8 p-7 lg:border-b-0 lg:border-r lg:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-rose-400/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-rose-300">
                    Round final
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
                  Desafio
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Reduza a complexidade sem alterar a ordem de sa&iacute;da.
                </p>
              </div>
            </div>

            <div className="min-w-0 bg-black p-4 sm:p-6 flex flex-col justify-between">
              <div className="w-full mb-3 flex items-center justify-end">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
                  COMPARE PROBLEMA VS SOLUÇÃO (HOVER)
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
                  <Check size={14} /> 14 testes aprovados
                </span>
                <span className="font-mono text-[9px] text-slate-500">38ms</span>
              </div>
            </div>
            <BorderBeam duration={8} size={130} colorFrom="#0083fe" colorTo="#60a5fa" />
          </div>
        </div>
      </section>

      <section
        id="profiles"
        data-anime-section
        className="relative mx-auto max-w-7xl px-6 py-28 lg:py-36"
      >
        <SectionHeading
          index="05"
          eyebrow="Perfil t&eacute;cnico"
          title={
            <>
              Um perfil que mostra <span className="text-blue-400">como voc&ecirc; pensa.</span>
            </>
          }
          description="Empresas e comunidade enxergam decis&otilde;es, consist&ecirc;ncia e dom&iacute;nio por tecnologia &mdash; com contexto, n&atilde;o s&oacute; n&uacute;meros."
        />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article data-reveal className={cn(cardClass, 'p-6 sm:p-9')}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative flex size-24 shrink-0 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold">
                US
                <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-4 border-[#080808] bg-emerald-400 text-[#080808]">
                  <Check size={14} strokeWidth={3} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-3xl font-semibold tracking-tight">Usu&aacute;rio Dev</h3>
                  <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-blue-300">
                    Dispon&iacute;vel
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Frontend Engineer &middot; sistemas distribu&iacute;dos e DX
                </p>
                <p className="mt-4 font-mono text-[9px] text-slate-500">
                  S&atilde;o Paulo, BR &middot; user.dev
                </p>
              </div>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {[
                ['8.420', 'XP total'],
                ['148', 'Contribui\u00e7\u00f5es'],
                ['62', 'Aceitas'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                Dom&iacute;nio por tecnologia
              </p>
              <div className="mt-5 grid gap-4">
                {trails.map((trail) => (
                  <div
                    key={trail.language}
                    className="grid grid-cols-[92px_1fr_42px] items-center gap-3 text-xs"
                  >
                    <span className="text-slate-300">{trail.language}</span>
                    <div className="h-1 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${trail.progress}%`, backgroundColor: trail.color }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">L{trail.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            <article data-reveal className={cn(cardClass, 'p-7')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                    Conquista rara
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">Arquitetura resiliente</h3>
                </div>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                  <Trophy size={24} />
                </span>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-400">
                Concedida a 2,4% dos membros ap&oacute;s tr&ecirc;s duelos avan&ccedil;ados sem
                regress&atilde;o.
              </p>
            </article>
            <article data-reveal className={cn(cardClass, 'p-7')}>
              <div className="flex items-center gap-3 text-emerald-300">
                <ShieldCheck size={20} />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
                  Sinais verificados
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                {['GitHub conectado', '62 respostas aceitas', '18 conquistas p\u00fablicas'].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm text-slate-300"
                    >
                      <Check size={14} className="text-emerald-400" />
                      {item}
                    </div>
                  )
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="start"
        data-anime-section
        className="relative border-t border-white/8 px-6 py-24 lg:py-32"
      >
        <div
          data-reveal
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-blue-300/15 bg-black px-6 py-20 text-center sm:px-10 lg:py-28"
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
              <Terminal size={13} /> Sua pr&oacute;xima linha vale XP
            </div>
            <h2 className="mt-7 font-sans text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Pare de apenas dizer que sabe. <span className="text-blue-300">Mostre.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-50/65">
              Transforme experi&ecirc;ncia real em reputa&ccedil;&atilde;o t&eacute;cnica
              p&uacute;blica.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={initialUser ? '/feed' : '/register'}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#04101f] transition-transform hover:-translate-y-0.5"
              >
                {initialUser ? 'Ir para o Feed' : 'Criar meu perfil'}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08]"
              >
                Rever como funciona
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
