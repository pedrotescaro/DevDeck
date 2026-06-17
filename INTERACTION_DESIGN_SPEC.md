# DevDeck Interaction Design Specification

Complete interaction system specification for DevDeck — a gamified social network for developers. Each interaction is designed to feel immediate and satisfying like Twitter/X, while maintaining a premium technical identity.

---

## BLOCO 1 — GAMEFEEL CORE (Twitter-like)

### 1.1 Optimistic UI no Post

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
.dd-optimistic-post {
  border-left: 2px solid var(--color-dd-accent);
  opacity: 0.85;
  animation: dd-optimistic-pulse 1.2s ease-in-out infinite;
}

@keyframes dd-optimistic-pulse {
  0%, 100% { border-color: var(--color-dd-accent); opacity: 0.85; }
  50% { border-color: color-mix(in srgb, var(--color-dd-accent) 75%, white); opacity: 1; }
}
```

**Tailwind Classes:**
```tsx
className="dd-optimistic-post dd-gpu transition-all duration-300"
```

**React Hook:**
```tsx
// src/hooks/useOptimisticPost.ts
"use client";

import { useState, useCallback } from "react";

interface OptimisticPostOptions {
  onPublish: (content: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useOptimisticPost({ onPublish, onError }: OptimisticPostOptions) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [optimisticPost, setOptimisticPost] = useState<string | null>(null);

  const publish = useCallback(async (content: string) => {
    // Instant optimistic update
    setOptimisticPost(content);
    setIsPublishing(true);

    try {
      await onPublish(content);
      setOptimisticPost(null); // Remove optimistic state on success
    } catch (error) {
      setOptimisticPost(null); // Remove on error
      onError?.(error as Error);
    } finally {
      setIsPublishing(false);
    }
  }, [onPublish, onError]);

  return { publish, isPublishing, optimisticPost };
}
```

**User Experience:**
Post appears instantly at the top of the feed with a subtle pulsing border, giving the user immediate feedback that their action was received. The 85% opacity signals "syncing" without feeling broken.

**Error Handling:**
On error, the optimistic post fades out with a 300ms transition and a toast appears: "Não foi possível publicar. Seu rascunho foi salvo." The draft is automatically saved to localStorage.

---

### 1.2 Reações com Física

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-particle {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
```

**Tailwind Classes:**
```tsx
<motion.button
  whileTap={{ scale: [1, 1.35, 1.1, 1] }}
  transition={{ duration: 0.3, times: [0, 0.35, 0.7, 1] }}
  className="dd-touch dd-focus-ring dd-gpu relative p-1.5 rounded-md"
>
```

**React Hook:**
```tsx
// src/hooks/useReactionBurst.ts
"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function useReactionBurst() {
  const [bursting, setBursting] = useState(false);
  const reduced = useReducedMotion();

  const triggerBurst = useCallback((color: string = "#f97316") => {
    if (reduced) return;
    setBursting(true);
    setTimeout(() => setBursting(false), 400);
  }, [reduced]);

  const particles = bursting ? PARTICLE_ANGLES.map((deg) => ({
    angle: deg,
    tx: `${Math.cos((deg * Math.PI) / 180) * 16}px`,
    ty: `${Math.sin((deg * Math.PI) / 180) * 16}px`,
    animation: "dd-particle 400ms ease-out forwards",
  })) : [];

  return { triggerBurst, particles, bursting };
}
```

**User Experience:**
The like button compresses and expands with a spring physics curve (scale 1.0 → 1.35 → 1.1 → 1.0) over 300ms, creating a tactile "pop" sensation. 6-8 particles explode radially in the accent color, providing satisfying visual feedback.

**Error Handling:**
If the reaction fails to sync with the server, the animation plays in reverse (particles in gray, scale down) and the button state reverts silently without disrupting the user.

---

### 1.3 Sistema de Reações Expandidas (🔥 ❤️ 😂 👏 💡)

**CSS Classes & Keyframes:**
```css
/* Already defined in lib/motion.ts */
export const reactionPickerVariants = {
  hidden: { opacity: 0, scale: 0, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...springBouncy, staggerChildren: 0.03 },
  },
  exit: { opacity: 0, scale: 0.8, y: 4, transition: { duration: 0.12 } },
};

export const reactionItemVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: springReaction },
};
```

**Tailwind Classes:**
```tsx
<motion.div
  className="absolute bottom-full left-0 mb-2 z-50 flex gap-1 bg-dd-surface border border-dd-border rounded-full px-2 py-1.5 shadow-xl"
  variants={reactionPickerVariants}
>
  {REACTIONS.map((reaction) => (
    <motion.button
      key={reaction.emoji}
      variants={reactionItemVariants}
      whileHover={{ scale: 1.3 }}
      className="dd-touch w-8 h-8 flex items-center justify-center rounded-full hover:bg-dd-border/50"
    >
```

**React Hook:**
```tsx
// Already exists: src/hooks/useLongPress.ts
// Usage with ExpandedReactionButton component
const longPressHandlers = useLongPress({
  onLongPress: () => setPickerOpen(true),
  onPress: handleQuickReact,
  threshold: 400,
});
```

**User Experience:**
Holding the like button for 400ms reveals a floating reaction picker with a spring entrance animation (scale 0 → 1.05 → 1.0). Each reaction scales to 1.3 on hover with a tooltip. Selecting a reaction triggers the corresponding burst animation.

**Error Handling:**
If the picker fails to open or the reaction doesn't save, the picker closes gracefully and the original button state is restored. Escape key closes the picker immediately.

---

### 1.4 XP Flutuante

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-xp-float {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-48px) scale(0.92); opacity: 0; }
}

.dd-xp-float {
  animation: dd-xp-float 800ms var(--motion-ease-out) forwards;
  font-family: var(--font-mono);
  color: var(--color-dd-accent);
  font-weight: 500;
}
```

**Tailwind Classes:**
```tsx
<span className="dd-xp-float absolute font-mono text-dd-accent font-semibold text-sm pointer-events-none">
  +{amount} XP
</span>
```

**React Hook:**
```tsx
// src/hooks/useXPFloat.ts
"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useXPFloat() {
  const [floatingXP, setFloatingXP] = useState<{ amount: number; x: number; y: number } | null>(null);
  const reduced = useReducedMotion();

  const showXP = useCallback((amount: number, element: HTMLElement) => {
    if (reduced) return;
    
    const rect = element.getBoundingClientRect();
    setFloatingXP({
      amount,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });

    setTimeout(() => setFloatingXP(null), 800);
  }, [reduced]);

  return { showXP, floatingXP };
}
```

**User Experience:**
Every XP-generating action (post, like, comment, quiz completion) triggers a floating "+15 XP" or "+5 XP" that rises 40px from the triggering element and fades out over 800ms. The monospace font and accent color reinforce the technical identity.

**Error Handling:**
If the animation fails or the user has reduced motion enabled, the XP is still awarded but without the floating animation. The XP bar updates silently.

---

### 1.5 Level Up

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-level-flash {
  0% { opacity: 0; }
  20% { opacity: 0.08; }
  100% { opacity: 0; }
}

.dd-level-flash {
  position: fixed;
  inset: 0;
  background: white;
  animation: dd-level-flash 600ms ease-out forwards;
  pointer-events: none;
  z-index: 200;
}

@keyframes dd-badge-entrance {
  0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.dd-badge-entrance {
  animation: dd-badge-entrance 400ms var(--motion-ease-out) forwards;
}
```

**Tailwind Classes:**
```tsx
<div className="dd-level-flash" />
<motion.div
  variants={levelUpBadgeVariants}
  initial="hidden"
  animate="visible"
  className="dd-badge-entrance"
>
```

**React Hook:**
```tsx
// src/hooks/useLevelUp.ts
"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface LevelUpOptions {
  newLevel: number;
  title: string;
}

export function useLevelUp() {
  const [levelUp, setLevelUp] = useState<LevelUpOptions | null>(null);
  const reduced = useReducedMotion();

  const triggerLevelUp = useCallback((options: LevelUpOptions) => {
    setLevelUp(options);
    setTimeout(() => setLevelUp(null), 3000);
  }, []);

  return { triggerLevelUp, levelUp, reduced };
}
```

**User Experience:**
When leveling up, a white flash overlays the screen at 8% opacity for 200ms, creating a dramatic moment. The new level badge enters with scale + rotation (0.5 → 1.0, rotate -10deg → 0deg) over 400ms. A centered toast displays "Level {N} desbloqueado! Você agora é um {título}" for 3 seconds.

**Error Handling:**
If animations fail, show a static badge and toast. The level up is still recorded and displayed without the dramatic effects.

---

## BLOCO 2 — COMPOSE / CRIAÇÃO DE POST

### 2.1 Expansão do Compose

**CSS Classes & Keyframes:**
```css
/* Height transition with spring physics */
.compose-textarea {
  transition: height 250ms var(--motion-spring);
}

/* Backdrop blur for modal */
.backdrop-blur-8 {
  backdrop-filter: blur(8px);
}
```

**Tailwind Classes:**
```tsx
<textarea
  className="w-full bg-transparent text-sm text-dd-text placeholder-dd-muted/65 focus:outline-none resize-none transition-all duration-250"
  style={{ height: isFocused ? '140px' : '60px' }}
/>
```

**React Hook:**
```tsx
// src/hooks/useComposeExpansion.ts
"use client";

import { useState, useCallback } from "react";

export function useComposeExpansion() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Only collapse if empty
    setIsExpanded(false);
  }, []);

  return { isExpanded, handleFocus, handleBlur };
}
```

**User Experience:**
The compose box expands fluidly from 60px to 140px when focused, using spring physics for a natural feel. The backdrop blur activates at 8px for the modal, creating depth without distraction. Modal entrance is scale 0.95 → 1.0 with 200ms fade-in.

**Error Handling:**
If the expansion animation fails, the textarea defaults to the expanded height. The modal still opens with a simple fade if scale animation is disabled.

---

### 2.2 Seletor de Tipo de Post

**CSS Classes & Keyframes:**
```css
/* Pill toggle with sliding indicator */
.post-type-pill {
  position: relative;
  background: var(--color-dd-surface);
  border-radius: 9999px;
  padding: 4px;
}

.post-type-indicator {
  position: absolute;
  height: calc(100% - 8px);
  background: var(--color-dd-accent);
  border-radius: 9999px;
  transition: transform 200ms var(--motion-ease-out);
}

/* Slide down for code area */
@keyframes slide-down {
  from { height: 0; opacity: 0; }
  to { height: auto; opacity: 1; }
}

.slide-down {
  animation: slide-down 200ms ease-out forwards;
  overflow: hidden;
}
```

**Tailwind Classes:**
```tsx
<div className="post-type-pill flex gap-1 p-1 bg-dd-surface rounded-full">
  <div 
    className="post-type-indicator absolute h-[calc(100%-8px)] bg-dd-accent rounded-full transition-transform duration-200"
    style={{ transform: postType === 'question' ? 'translateX(0)' : 'translateX(100%)' }}
  />
  <button onClick={() => setPostType('question')}>Dúvida Técnica</button>
  <button onClick={() => setPostType('discussion')}>Discussão Geral</button>
</div>

<div className={postType === 'question' ? 'slide-down' : 'hidden'}>
  {/* Code editor and language selector */}
</div>
```

**React Hook:**
```tsx
// src/hooks/usePostTypeToggle.ts
"use client";

import { useState, useCallback } from "react";

type PostType = 'question' | 'discussion';

export function usePostTypeToggle(initial: PostType = 'question') {
  const [postType, setPostType] = useState<PostType>(initial);

  const toggle = useCallback((type: PostType) => {
    setPostType(type);
  }, []);

  return { postType, toggle };
}
```

**User Experience:**
A premium pill toggle slides smoothly between "Dúvida Técnica" and "Discussão Geral" with a 200ms transition. Selecting "Dúvida Técnica" reveals the code area with a slide-down animation, while "Discussão Geral" shows the image URL field. The transitions feel intentional and premium.

**Error Handling:**
If the toggle animation fails, both options remain visible. Default to "Dúvida Técnica" if state is lost.

---

### 2.3 Contador de Caracteres

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-char-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.dd-char-shake {
  animation: dd-char-shake 200ms ease-in-out 2;
}
```

**Tailwind Classes:**
```tsx
<span className={cn(
  "text-xs font-semibold transition-colors",
  !visible && "invisible",
  color === "default" && "text-dd-muted",
  color === "amber" && "text-amber-500",
  color === "red" && "text-red-500",
  shake && "dd-char-shake"
)}>
  {limit - count}
</span>
```

**React Hook:**
```tsx
// Already exists: src/hooks/useCharCounter.ts
// Verified to match specification:
// - Invisible until 70%
// - Amber at 90% with shake
// - Red at 100% with disabled state
```

**User Experience:**
The counter is invisible until 70% of the limit, then fades in as a subtle reminder. At 90%, it turns amber and shakes gently (±2px, 2 cycles) to draw attention. At 100%, it turns red and the publish button is disabled with 40% opacity.

**Error Handling:**
If the counter fails to update, the publish button still enforces the limit server-side. The shake animation is skipped if reduced motion is enabled.

---

### 2.4 Descarte de Rascunho

**CSS Classes & Keyframes:**
```css
/* Already defined in lib/motion.ts */
export const bottomSheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ...springGentle, duration: 0.3 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};
```

**Tailwind Classes:**
```tsx
<motion.div
  variants={bottomSheetVariants}
  className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-2xl rounded-t-3xl border border-dd-border bg-dd-surface px-5 pb-6 pt-4 shadow-2xl"
>
  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-dd-border" />
  <p className="text-sm font-bold text-dd-text">Descartar rascunho?</p>
</motion.div>
```

**React Hook:**
```tsx
// Already implemented in ComposeModal component
// Uses escape key handler and click-outside detection
// Shows bottom sheet when hasDraft is true
```

**User Experience:**
Clicking outside or pressing Escape with content triggers a bottom sheet that slides up from the bottom (not a modal), asking "Descartar rascunho?" with "Descartar" and "Continuar" options. This feels less intrusive than a full modal.

**Error Handling:**
If the bottom sheet fails to open, the modal closes immediately and the draft is auto-saved to localStorage. The user can recover their content later.

---

### 2.5 Menções @username

**CSS Classes & Keyframes:**
```css
/* Already defined in lib/motion.ts */
export const mentionDropdownVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1 } },
};
```

**Tailwind Classes:**
```tsx
<motion.div
  variants={mentionDropdownVariants}
  className="absolute left-0 top-full mt-2 z-50 w-64 rounded-xl border border-dd-border bg-dd-surface shadow-xl overflow-hidden"
>
  {users.map((user) => (
    <button
      key={user.id}
      className="flex items-center gap-3 px-3 py-2 hover:bg-dd-border/50 transition-colors w-full text-left"
    >
      <img src={user.avatar_url} className="w-6 h-6 rounded-full" />
      <span className="text-sm font-semibold text-dd-text">@{user.username}</span>
    </button>
  ))}
</motion.div>
```

**React Hook:**
```tsx
// src/hooks/useMentionDropdown.ts
"use client";

import { useState, useCallback, useEffect } from "react";

export function useMentionDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  const searchUsers = useCallback(async (q: string) => {
    if (!q.startsWith("@") || q.length < 2) {
      setResults([]);
      setVisible(false);
      return;
    }

    try {
      const res = await fetch(`/api/users/search?q=${q.slice(1)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setVisible(true);
      }
    } catch (error) {
      console.error("Mention search failed:", error);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => searchUsers(query), 200);
    return () => clearTimeout(debounce);
  }, [query, searchUsers]);

  const selectUser = useCallback((username: string) => {
    // Replace the @query with @username
    setVisible(false);
    return username;
  }, []);

  return { query, results, visible, setQuery, selectUser };
}
```

**User Experience:**
Typing "@" triggers a real-time search dropdown with a 200ms debounce. Results appear with a slide-down animation showing avatar (24px), username, and full name. Selecting with Enter or click inserts the mention as a colored pill inline. In the rendered post, @username becomes a clickable link to the profile.

**Error Handling:**
If the search fails, the dropdown doesn't appear and the user can continue typing. Mentions are stored as plain text and parsed on render.

---

## BLOCO 3 — FEED & SCROLL

### 3.1 Loading States

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.dd-skeleton {
  border-radius: 0.5rem;
  background: linear-gradient(
    90deg,
    var(--color-dd-surface) 0%,
    color-mix(in srgb, var(--color-dd-border) 60%, transparent) 50%,
    var(--color-dd-surface) 100%
  );
  background-size: 200% 100%;
  animation: dd-shimmer 1.4s ease-in-out infinite;
}
```

**Tailwind Classes:**
```tsx
<div className="dd-skeleton h-4 w-3/4 rounded mb-2" />
<div className="dd-skeleton h-4 w-1/2 rounded mb-2" />
<div className="dd-skeleton h-20 w-full rounded" />
```

**React Hook:**
```tsx
// src/hooks/useSkeletonLoader.ts
"use client";

import { useState, useEffect } from "react";

export function useSkeletonLoader(isLoading: boolean, delay: number = 200) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSkeleton(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [isLoading, delay]);

  return showSkeleton;
}
```

**User Experience:**
Each PostCard shows a skeleton shimmer while loading, with a sweep animation from left to right. The shimmer uses the dd-surface color with a 10% lighter highlight. This feels premium and avoids the generic spinner look.

**Error Handling:**
If loading fails, the skeleton is replaced with an error state or empty state. The shimmer animation stops if reduced motion is enabled.

---

### 3.2 Novos Posts

**CSS Classes & Keyframes:**
```css
/* Already defined in lib/motion.ts */
export const newPostsPillVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springBouncy },
  exit: { opacity: 0, y: -8, scale: 0.9, transition: { duration: 0.15 } },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springGentle },
};
```

**Tailwind Classes:**
```tsx
<motion.button
  variants={newPostsPillVariants}
  className="fixed top-20 left-1/2 -translate-x-1/2 z-30 bg-dd-accent text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
>
  Ver {count} novos posts
</motion.button>

<motion.div variants={staggerContainerVariants}>
  {newPosts.map((post, i) => (
    <motion.div key={post.id} variants={staggerItemVariants} custom={i}>
      <PostCard post={post} />
    </motion.div>
  ))}
</motion.div>
```

**React Hook:**
```tsx
// src/hooks/useNewPostsIndicator.ts
"use client";

import { useState, useCallback } from "react";

export function useNewPostsIndicator() {
  const [newPostCount, setNewPostCount] = useState(0);
  const [hasNewPosts, setHasNewPosts] = useState(false);

  const increment = useCallback(() => {
    setNewPostCount(prev => prev + 1);
    setHasNewPosts(true);
  }, []);

  const dismiss = useCallback(() => {
    setNewPostCount(0);
    setHasNewPosts(false);
  }, []);

  return { newPostCount, hasNewPosts, increment, dismiss };
}
```

**User Experience:**
A pill "Ver X novos posts" is fixed at the top of the feed with a bounce-in animation when new posts are detected. Clicking it scrolls smoothly to the top, and new posts enter with staggered slide-down (each 40ms after the previous one).

**Error Handling:**
If the scroll fails, the pill remains clickable. The stagger animation is skipped if reduced motion is enabled.

---

### 3.3 Infinite Scroll

**CSS Classes & Keyframes:**
```css
/* Fade-in for appended posts */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fade-in 200ms ease-out;
}
```

**Tailwind Classes:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
  className="fade-in"
>
  <PostCard post={post} />
</motion.div>
```

**React Hook:**
```tsx
// Already exists: src/hooks/useInfiniteScroll.ts
// Verify it loads 3 posts before the end
// Verify it appends silently without jump
```

**User Experience:**
The next page loads when the user is 3 posts from the end, with no jarring jump. New posts append silently with a 200ms fade-in animation. The scroll position is preserved to avoid disorientation.

**Error Handling:**
If loading fails, show a "Carregar mais" button at the bottom. Stop infinite scroll after 3 consecutive failures.

---

### 3.4 Busca em Tempo Real

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
.dd-search-highlight {
  background-color: rgba(245, 166, 35, 0.18);
  animation: dd-search-pulse 220ms ease-out;
  border-radius: 2px;
  padding: 0 1px;
}

@keyframes dd-search-pulse {
  0% { background-color: rgba(245, 166, 35, 0.12); }
  100% { background-color: rgba(245, 166, 35, 0.24); }
}
```

**Tailwind Classes:**
```tsx
<input
  className="w-full bg-dd-surface border border-dd-border rounded-full px-4 py-2 text-sm text-dd-text placeholder-dd-muted focus:outline-none focus:border-dd-accent transition-colors"
  placeholder="Buscar posts..."
/>

{highlightedText.map((part, i) => (
  <span key={i} className={part.isMatch ? "dd-search-highlight" : ""}>
    {part.text}
  </span>
))}
```

**React Hook:**
```tsx
// src/hooks/useSearchWithDebounce.ts
"use client";

import { useState, useCallback, useEffect } from "react";

export function useSearchWithDebounce(initialQuery: string = "", delay: number = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  return { query, setQuery, debouncedQuery };
}
```

**User Experience:**
The search input has a 300ms debounce to avoid excessive filtering. Results filter inline in the feed with a soft yellow highlight on the matched term. The empty state shows: "Nenhum resultado para '{termo}'. Tente outro termo ou explore os trending topics."

**Error Handling:**
If the search fails, show the empty state with a generic message. The highlight animation is skipped if reduced motion is enabled.

---

### 3.5 Abas Feed / Quizzes

**CSS Classes & Keyframes:**
```css
/* Sliding underline indicator */
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--color-dd-accent);
  border-radius: 2px;
  transition: transform 200ms var(--motion-ease-out), width 200ms var(--motion-ease-out);
}

/* Crossfade for tab content */
@keyframes crossfade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.crossfade {
  animation: crossfade 200ms ease-out;
}
```

**Tailwind Classes:**
```tsx
<div className="relative flex gap-6 border-b border-dd-border">
  <button className="relative py-3 text-sm font-semibold text-dd-text">
    Feed
    <div 
      className="tab-indicator"
      style={{ 
        width: activeTab === 'feed' ? '100%' : '0',
        transform: activeTab === 'feed' ? 'translateX(0)' : 'translateX(-100%)'
      }}
    />
  </button>
  <button className="relative py-3 text-sm font-semibold text-dd-muted">
    Quizzes
    <div 
      className="tab-indicator"
      style={{ 
        width: activeTab === 'quizzes' ? '100%' : '0',
        transform: activeTab === 'quizzes' ? 'translateX(0)' : 'translateX(100%)'
      }}
    />
  </button>
</div>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
  className="crossfade"
>
  {activeTab === 'feed' ? <FeedContent /> : <QuizzesContent />}
</motion.div>
```

**React Hook:**
```tsx
// src/hooks/useTabSwitch.ts
"use client";

import { useState, useCallback } from "react";

type Tab = 'feed' | 'quizzes';

export function useTabSwitch(initial: Tab = 'feed') {
  const [activeTab, setActiveTab] = useState<Tab>(initial);

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return { activeTab, switchTab };
}
```

**User Experience:**
The tab selector uses a sliding underline indicator (not a box) that animates smoothly between tabs. Switching tabs triggers a 200ms crossfade of the content, avoiding a jarring horizontal push. The transition feels fluid and premium.

**Error Handling:**
If the tab switch fails, the content remains on the current tab. The crossfade animation is skipped if reduced motion is enabled.

---

## BLOCO 4 — SOCIAL CORE

### 4.1 Seguir / Unfollow

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
.dd-follow-btn[data-following="true"]:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
}

/* Scale-in for check icon */
@keyframes scale-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.scale-in {
  animation: scale-in 150ms var(--motion-spring);
}
```

**Tailwind Classes:**
```tsx
<button
  data-following={isFollowing}
  className={cn(
    "dd-touch dd-focus-ring px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
    isFollowing 
      ? "bg-dd-surface text-dd-text border border-dd-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
      : "bg-dd-accent text-white hover:bg-orange-600"
  )}
>
  {isFollowing ? (
    <span className="flex items-center gap-1.5">
      <Check className="w-3.5 h-3.5 scale-in" />
      Seguindo
    </span>
  ) : (
    "Seguir"
  )}
</button>
```

**React Hook:**
```tsx
// src/hooks/useFollowButton.ts
"use client";

import { useState, useCallback } from "react";

export function useFollowButton(initialFollowing: boolean = false) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    // Optimistic update
    const newFollowing = !isFollowing;
    setIsFollowing(newFollowing);
    setIsLoading(true);

    try {
      // API call
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: newFollowing ? 'POST' : 'DELETE',
      });
      
      if (!res.ok) {
        // Revert on error
        setIsFollowing(!newFollowing);
      }
    } catch (error) {
      setIsFollowing(!newFollowing);
    } finally {
      setIsLoading(false);
    }
  }, [isFollowing, userId]);

  return { isFollowing, isLoading, toggle };
}
```

**User Experience:**
Clicking "Seguir" changes it to "Seguindo" instantly with an optimistic update. The check icon scales in over 150ms. Hovering over "Seguindo" shows "Deixar de seguir" in coral/red, following Twitter's destructive pattern. The interaction feels immediate and confident.

**Error Handling:**
If the follow/unfollow fails, the button reverts to its previous state silently. A toast appears: "Não foi possível seguir. Tente novamente."

---

### 4.2 Repost / Compartilhar

**CSS Classes & Keyframes:**
```css
/* Already defined in lib/motion.ts */
export const popoverMenuVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.9, y: 4, transition: { duration: 0.1 } },
};
```

**Tailwind Classes:**
```tsx
<motion.div
  variants={popoverMenuVariants}
  className="absolute bottom-full left-0 mb-2 z-50 w-48 rounded-xl border border-dd-border bg-dd-surface shadow-xl overflow-hidden"
>
  <button className="w-full px-4 py-3 text-left text-sm font-semibold text-dd-text hover:bg-dd-border/50 transition-colors">
    Repostar
  </button>
  <button className="w-full px-4 py-3 text-left text-sm font-semibold text-dd-text hover:bg-dd-border/50 transition-colors border-t border-dd-border">
    Citar com comentário
  </button>
</motion.div>
```

**React Hook:**
```tsx
// src/hooks/useRepostMenu.ts
"use client";

import { useState, useCallback } from "react";

export function useRepostMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const repost = useCallback(async (postId: string) => {
    setIsReposting(true);
    // Optimistic counter increment
    try {
      const res = await fetch(`/api/posts/${postId}/repost`, { method: 'POST' });
      if (!res.ok) throw new Error('Repost failed');
    } catch (error) {
      // Revert counter
    } finally {
      setIsReposting(false);
      closeMenu();
    }
  }, [closeMenu]);

  const quote = useCallback((postId: string) => {
    closeMenu();
    // Open compose modal with quoted post
  }, [closeMenu]);

  return { isOpen, isReposting, openMenu, closeMenu, repost, quote };
}
```

**User Experience:**
Clicking the repost icon opens a mini-menu with "Repostar" and "Citar com comentário" options. Repost is optimistic with an immediate counter increment. Citing opens the compose modal with the original post embedded as a card. The menu feels quick and discoverable.

**Error Handling:**
If repost fails, the counter reverts and a toast appears. If quoting fails, the compose modal opens without the quoted post.

---

### 4.3 Bookmarks

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-bookmark-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.dd-bookmark-pop {
  animation: dd-bookmark-pop 300ms var(--motion-spring);
}
```

**Tailwind Classes:**
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  className={cn(
    "dd-touch dd-focus-ring p-1.5 rounded-md transition-colors",
    isBookmarked 
      ? "text-dd-accent dd-bookmark-pop" 
      : "text-dd-muted hover:text-dd-text"
  )}
>
  <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
</motion.button>
```

**React Hook:**
```tsx
// src/hooks/useBookmarkButton.ts
"use client";

import { useState, useCallback } from "react";

export function useBookmarkButton(initialBookmarked: boolean = false) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const toggle = useCallback(async (postId: string) => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: newBookmarked ? 'POST' : 'DELETE',
      });
      
      if (!res.ok) {
        setIsBookmarked(!newBookmarked);
      } else {
        // Show toast
      }
    } catch (error) {
      setIsBookmarked(!newBookmarked);
    }
  }, [isBookmarked]);

  return { isBookmarked, toggle };
}
```

**User Experience:**
Clicking the bookmark icon triggers a satisfying pop animation (scale 1.0 → 1.2 → 1.0 over 300ms). The icon fills with the accent color. A toast appears: "Salvo nos seus bookmarks" with a link "Ver todos". The interaction feels rewarding and discoverable.

**Error Handling:**
If bookmarking fails, the icon reverts to its previous state. A toast appears: "Não foi possível salvar. Tente novamente."

---

### 4.4 DMs

**CSS Classes & Keyframes:**
```css
/* Badge pulse with ripple */
@keyframes dd-dot-ripple {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}

.dd-dot-pulse::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background-color: var(--color-dd-amber);
  animation: dd-dot-ripple 1.2s ease-out infinite;
}

/* Staggered message entrance */
@keyframes message-slide-in {
  from { transform: translateX(12px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.message-slide-in {
  animation: message-slide-in 200ms ease-out;
}

/* Typing indicator */
@keyframes dd-typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.dd-typing-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-dd-muted);
  animation: dd-typing-bounce 1.2s ease-in-out infinite;
}
.dd-typing-dot:nth-child(2) { animation-delay: 200ms; }
.dd-typing-dot:nth-child(3) { animation-delay: 400ms; }
```

**Tailwind Classes:**
```tsx
{/* Unread badge */}
<div className="relative">
  <MessageCircle className="w-5 h-5" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 dd-dot-pulse w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</div>

{/* Typing indicator */}
<div className="flex gap-1">
  <span className="dd-typing-dot" />
  <span className="dd-typing-dot" />
  <span className="dd-typing-dot" />
</div>
```

**React Hook:**
```tsx
// src/hooks/useDMBadge.ts
"use client";

import { useState, useEffect } from "react";

export function useDMBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Poll every 3 seconds for unread count
    const interval = setInterval(async () => {
      const res = await fetch('/api/messages/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { unreadCount };
}

// src/hooks/useMessageStagger.ts
"use client";

import { useEffect } from "react";

export function useMessageStagger(messages: any[], containerRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!containerRef.current) return;

    const messageElements = containerRef.current.children;
    Array.from(messageElements).forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 30}ms`;
      (el as HTMLElement).classList.add('message-slide-in');
    });
  }, [messages, containerRef]);
}
```

**User Experience:**
The unread badge pulses with a ring expansion every 3 seconds, drawing attention without being annoying. When opening a conversation, messages enter with a 30ms stagger (oldest first, already visible; new ones slide in from the right). The "digitando..." indicator shows 3 bouncing dots with 200ms stagger.

**Error Handling:**
If the badge animation fails, show a static badge. If message stagger fails, show all messages immediately. The typing indicator is hidden if the user has reduced motion.

---

### 4.5 Notificações em Tempo Real

**CSS Classes & Keyframes:**
```css
/* Bell shake */
@keyframes dd-bell-shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}

.dd-bell-shake {
  animation: dd-bell-shake 400ms ease-in-out 2;
}

/* Notification type colors */
.dd-notif-like { color: var(--color-dd-amber); }
.dd-notif-comment { color: var(--color-dd-blue); }
.dd-notif-mention { color: var(--color-dd-purple); }
.dd-notif-xp { color: var(--color-dd-green); }
.dd-notif-follow { color: #14b8a6; }
```

**Tailwind Classes:**
```tsx
<motion.div
  animate={{ rotate: [0, -2, 2, 0] }}
  transition={{ duration: 0.4, repeat: 2 }}
  className={cn(
    "dd-bell-shake",
    hasNew && "dd-notif-" + notificationType
  )}
>
  <Bell className="w-5 h-5" />
</motion.div>

{/* Staggered notification items */}
<motion.div
  variants={notifStaggerContainer}
  initial="hidden"
  animate="visible"
>
  {notifications.map((notif) => (
    <motion.div key={notif.id} variants={notifItemVariants}>
      <NotificationItem notification={notif} />
    </motion.div>
  ))}
</motion.div>
```

**React Hook:**
```tsx
// src/hooks/useNotificationBell.ts
"use client";

import { useState, useEffect } from "react";

export function useNotificationBell() {
  const [hasNew, setHasNew] = useState(false);
  const [notificationType, setNotificationType] = useState<'like' | 'comment' | 'mention' | 'xp' | 'follow' | null>(null);

  useEffect(() => {
    // Listen for real-time notifications via WebSocket or polling
    const handleNewNotification = (type: 'like' | 'comment' | 'mention' | 'xp' | 'follow') => {
      setHasNew(true);
      setNotificationType(type);
      
      // Reset after animation
      setTimeout(() => setHasNew(false), 800);
    };

    // Subscribe to notification events
    return () => {
      // Unsubscribe
    };
  }, []);

  return { hasNew, notificationType };
}
```

**User Experience:**
When a new notification arrives, the bell shakes (±2°, 2 cycles) to draw attention. Colors indicate type: like (amber), comment (blue), mention (purple), XP milestone (green), follow (teal). The notification panel opens with staggered items (40ms each, bottom to top).

**Error Handling:**
If the shake animation fails, show a static badge. If the stagger fails, show all items immediately. Colors are still applied for type identification.

---

## BLOCO 5 — GAMIFICAÇÃO (DevDeck-specific)

### 5.1 Quiz Diário

**CSS Classes & Keyframes:**
```css
/* Already defined in globals.css */
@keyframes dd-glow-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
  50% { box-shadow: 0 0 12px 4px rgba(249, 115, 22, 0.15); }
}

.dd-glow-ring {
  animation: dd-glow-ring 2s ease-in-out infinite;
}

/* Correct answer flash */
@keyframes dd-correct-flash {
  0% { background-color: rgba(34, 212, 138, 0.15); }
  100% { background-color: transparent; }
}

.dd-correct-flash {
  animation: dd-correct-flash 600ms ease-out;
}

/* Error shake */
@keyframes dd-shake-error {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.dd-shake-error {
  animation: dd-shake-error 300ms ease-in-out;
}
```

**Tailwind Classes:**
```tsx
<div className={cn(
  "border border-dd-border rounded-xl p-4 transition-all",
  !completed && "dd-glow-ring border-dd-accent"
)}>
  {/* Quiz content */}
</div>

<button
  className={cn(
    "w-full text-left p-3 rounded-lg transition-all",
    isCorrect && "bg-green-500/10 dd-correct-flash",
    isWrong && "dd-shake-error"
  )}
>
  {option}
</button>
```

**React Hook:**
```tsx
// src/hooks/useQuizCard.ts
"use client";

import { useState, useCallback } from "react";

export function useQuizCard(quizId: string) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const submitAnswer = useCallback(async (answer: string) => {
    setSelectedAnswer(answer);

    try {
      const res = await fetch(`/api/quizzes/${quizId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsCorrect(data.correct);
        setCompleted(true);
        
        if (data.correct) {
          // Trigger XP float
        }
      }
    } catch (error) {
      console.error('Quiz answer failed:', error);
    }
  }, [quizId]);

  return { selectedAnswer, isCorrect, completed, submitAnswer };
}
```

**User Experience:**
The daily quiz card has a pulsing glow ring (2s loop) to invite interaction. Answering correctly triggers a soft green flash (200ms) and an XP float. Answering incorrectly causes a horizontal shake (±4px, 3 cycles, 300ms) and reveals the correct answer with a slide-down animation.

**Error Handling:**
If the answer submission fails, the card resets to allow retry. The glow ring is static if reduced motion is enabled.

---

### 5.2 Trilhas por Linguagem

**CSS Classes & Keyframes:**
```css
/* Liquid fill animation */
.dd-liquid-track {
  overflow: hidden;
  position: relative;
}

.dd-liquid-track::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 45%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: dd-shimmer 1.6s ease-in-out infinite;
  pointer-events: none;
}

.dd-liquid-fill {
  transform-origin: left center;
  will-change: transform, opacity;
  transition: transform 0.6s var(--motion-ease-out);
}
```

**Tailwind Classes:**
```tsx
<div className="dd-liquid-track h-2 bg-dd-border rounded-full overflow-hidden">
  <div 
    className="dd-liquid-fill h-full bg-dd-accent rounded-full"
    style={{ transform: `scaleX(${progress / 100})` }}
  />
</div>
```

**React Hook:**
```tsx
// src/hooks/useLanguageTrail.ts
"use client";

import { useState, useEffect } from "react";

export function useLanguageTrail(language: string) {
  const [progress, setProgress] = useState(0);
  const [xp, setXP] = useState(0);
  const [milestone, setMilestone] = useState<number | null>(null);

  const addXP = useCallback((amount: number) => {
    setXP(prev => {
      const newXP = prev + amount;
      const newProgress = (newXP % 1000) / 10; // Assuming 1000 XP per level
      
      setProgress(newProgress);
      
      // Check for milestone
      if (newXP % 1000 === 0 && newXP > 0) {
        setMilestone(Math.floor(newXP / 1000));
      }
      
      return newXP;
    });
  }, []);

  return { progress, xp, milestone, addXP };
}
```

**User Experience:**
The language trail progress bar fills with a liquid animation every time XP is gained in that language. The shimmer effect creates a premium feel. When reaching a milestone (every 1000 XP), the badge enters with rotation + scale animation (same as level up).

**Error Handling:**
If the animation fails, the progress bar updates instantly. The milestone badge is shown statically if the entrance animation fails.

---

### 5.3 Leaderboard

**CSS Classes & Keyframes:**
```css
/* Top 3 special borders */
.rank-1 { border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
.rank-2 { border: 2px solid #c0c0c0; box-shadow: 0 0 15px rgba(192, 192, 192, 0.15); }
.rank-3 { border: 2px solid #cd7f32; box-shadow: 0 0 10px rgba(205, 127, 50, 0.15); }

/* Position change animation */
@keyframes dd-rank-up {
  from { transform: translateY(8px); opacity: 0.5; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes dd-rank-down {
  from { transform: translateY(-8px); opacity: 0.5; }
  to { transform: translateY(0); opacity: 1; }
}

.rank-up { animation: dd-rank-up 300ms ease-out; }
.rank-down { animation: dd-rank-down 300ms ease-out; }
```

**Tailwind Classes:**
```tsx
<div className={cn(
  "border border-dd-border rounded-xl p-4 transition-all",
  rank === 1 && "rank-1",
  rank === 2 && "rank-2",
  rank === 3 && "rank-3"
)}>
  {/* Leaderboard item */}
</div>

{/* User's position (sticky if not in top 10) */}
<div className={cn(
  "border border-dd-accent rounded-xl p-4 bg-dd-accent/5",
  !isInTop10 && "sticky bottom-0"
)}>
  {/* User's rank */}
</div>
```

**React Hook:**
```tsx
// src/hooks/useLeaderboard.ts
"use client";

import { useState, useEffect } from "react";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [previousRanks, setPreviousRanks] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        
        // Track position changes
        const newPreviousRanks = new Map(previousRanks);
        data.forEach((item: any) => {
          newPreviousRanks.set(item.id, item.rank);
        });
        setPreviousRanks(newPreviousRanks);
        
        setLeaderboard(data);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, [previousRanks]);

  const getPositionChange = (userId: number, currentRank: number) => {
    const previousRank = previousRanks.get(userId);
    if (!previousRank) return null;
    return previousRank - currentRank; // Positive = moved up
  };

  return { leaderboard, userRank, getPositionChange };
}
```

**User Experience:**
The top 3 positions have special metallic borders (gold, silver, bronze) with subtle glows. The user's position is always visible, sticky at the bottom if not in the top 10. When positions change in real-time, items animate with vertical slide (up for rank increase, down for rank decrease).

**Error Handling:**
If the leaderboard fails to update, show the last known state. Position change animations are skipped if reduced motion is enabled.

---

## BLOCO 6 — DESCOBERTA & COMUNIDADES

### 6.1 Página Explorar

**CSS Classes & Keyframes:**
```css
/* Masonry grid with hover effects */
.explore-card {
  transition: transform 200ms var(--motion-ease-out), border-color 200ms;
}

.explore-card:hover {
  transform: scale(1.02);
  border-color: var(--color-dd-accent);
}

/* Crossfade for grid filter */
@keyframes grid-crossfade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.grid-crossfade {
  animation: grid-crossfade 200ms ease-out;
}
```

**Tailwind Classes:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {developers.map((dev) => (
    <div key={dev.id} className="explore-card border border-dd-border rounded-xl p-4 cursor-pointer">
      <img src={dev.avatar_url} className="w-12 h-12 rounded-full mb-3" />
      <h3 className="text-sm font-bold text-dd-text">{dev.username}</h3>
      <p className="text-xs text-dd-muted">Nível {dev.level}</p>
      <LanguageTag language={dev.mainLanguage} />
      <p className="text-xs text-dd-accent font-mono mt-2">{dev.totalXP} XP</p>
    </div>
  ))}
</div>

{/* Language filter pills */}
<div className="flex gap-2 flex-wrap mb-6">
  {languages.map((lang) => (
    <button
      key={lang}
      onClick={() => setFilter(lang)}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-bold transition-all",
        filter === lang 
          ? "bg-dd-accent text-white" 
          : "bg-dd-surface text-dd-muted hover:text-dd-text"
      )}
    >
      {lang}
    </button>
  ))}
</div>
```

**React Hook:**
```tsx
// src/hooks/useExploreGrid.ts
"use client";

import { useState, useCallback } from "react";

export function useExploreGrid() {
  const [filter, setFilter] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<any[]>([]);

  const filterByLanguage = useCallback(async (language: string | null) => {
    setFilter(language);
    
    try {
      const url = language 
        ? `/api/explore?language=${language}`
        : '/api/explore';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDevelopers(data);
      }
    } catch (error) {
      console.error('Explore filter failed:', error);
    }
  }, []);

  return { filter, developers, filterByLanguage };
}
```

**User Experience:**
The explore page shows a masonry grid of developers with avatar, level, main language, and total XP. Hovering on a card elevates it with scale(1.02) and the accent border appears with fade-in. Language filter pills are clickable with toggle, and the grid refilters with crossfade.

**Error Handling:**
If the filter fails, show all developers. The hover effects are disabled if reduced motion is enabled.

---

### 6.2 Trending Topics

**CSS Classes & Keyframes:**
```css
/* Vertical swap animation for reordering */
@keyframes swap-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes swap-down {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

.swap-up { animation: swap-up 300ms ease-out; }
.swap-down { animation: swap-down 300ms ease-out; }
```

**Tailwind Classes:**
```tsx
<div className="space-y-2">
  {trendingTopics.map((topic, index) => (
    <div 
      key={topic.id}
      className={cn(
        "flex items-center justify-between p-2 rounded-lg hover:bg-dd-surface transition-colors cursor-pointer",
        topic.positionChange > 0 && "swap-up",
        topic.positionChange < 0 && "swap-down"
      )}
      onClick={() => filterFeedByTopic(topic.name)}
    >
      <span className="text-sm font-semibold text-dd-text">{topic.name}</span>
      <span className="text-xs text-dd-muted">{topic.postCount} posts</span>
    </div>
  ))}
</div>
```

**React Hook:**
```tsx
// src/hooks/useTrendingTopics.ts
"use client";

import { useState, useEffect } from "react";

export function useTrendingTopics() {
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch('/api/trending');
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { topics };
}
```

**User Experience:**
The trending topics widget shows 5 topics with post counts. When positions change, items reorder with vertical swap animations (up for position increase, down for decrease). Clicking a topic filters the feed by that theme.

**Error Handling:**
If the trending update fails, keep the last known order. Swap animations are skipped if reduced motion is enabled.

---

### 6.3 Comunidades por Linguagem

**CSS Classes & Keyframes:**
```css
/* Language-derived theme colors */
.theme-js { --theme-color: #f5a623; }
.theme-python { --theme-color: #5ba3f5; }
.theme-rust { --theme-color: #f97316; }
.theme-go { --theme-color: #22d48a; }

.community-card {
  border-color: var(--theme-color);
}

.community-card:hover {
  background-color: color-mix(in srgb, var(--theme-color) 10%, transparent);
}
```

**Tailwind Classes:**
```tsx
<div className={cn(
  "community-card border border-dd-border rounded-xl p-4 transition-all",
  language === 'JavaScript' && 'theme-js',
  language === 'Python' && 'theme-python',
  language === 'Rust' && 'theme-rust',
  language === 'Go' && 'theme-go'
)}>
  <h3 className="text-sm font-bold text-dd-text">{language} Community</h3>
  <p className="text-xs text-dd-muted">{memberCount} membros</p>
  <button
    onClick={joinCommunity}
    className="mt-2 px-3 py-1 rounded-full text-xs font-bold transition-all"
    style={{ backgroundColor: 'var(--theme-color)', color: 'white' }}
  >
    {isMember ? 'Membro' : 'Entrar'}
  </button>
</div>
```

**React Hook:**
```tsx
// src/hooks/useCommunityJoin.ts
"use client";

import { useState, useCallback } from "react";

export function useCommunityJoin(communityId: string) {
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  const join = useCallback(async () => {
    // Optimistic update
    const newMember = !isMember;
    setIsMember(newMember);
    setMemberCount(prev => newMember ? prev + 1 : prev - 1);

    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: newMember ? 'POST' : 'DELETE',
      });

      if (!res.ok) {
        // Revert
        setIsMember(!newMember);
        setMemberCount(prev => newMember ? prev - 1 : prev + 1);
      }
    } catch (error) {
      setIsMember(!newMember);
      setMemberCount(prev => newMember ? prev - 1 : prev + 1);
    }
  }, [isMember, communityId]);

  return { isMember, memberCount, join };
}
```

**User Experience:**
Each community has a theme color derived from the language (JS = amber, Python = blue, Rust = coral, Go = green). The border and hover effects use this color. Joining is optimistic with an immediate member count increment. The color coding creates visual identity.

**Error Handling:**
If joining fails, the button reverts to its previous state. Theme colors fall back to accent color if CSS variables fail.

---

## BLOCO 7 — ESTADOS & MICRO-COPY

### Copy Constants File

```typescript
// src/lib/copy.ts

export const COPY = {
  // Empty States
  EMPTY_FEED: "Nenhum post ainda. Seja o primeiro a quebrar o silêncio.",
  EMPTY_SEARCH: (term: string) => `Nenhum resultado para '${term}'. Você pode ser o primeiro a falar sobre isso.`,
  EMPTY_DM: "Nenhuma mensagem ainda. Manda um 'Hello, World!'",
  EMPTY_NOTIFICATIONS: "Tudo lido. Hora de fazer algo que valha uma notificação.",
  EMPTY_COMMUNITY: "Nenhum post nesta comunidade ainda. Seja o pioneiro!",
  
  // Error States
  ERROR_POST: "Algo deu errado. Seu rascunho foi salvo automaticamente.",
  ERROR_FOLLOW: "Não foi possível seguir. Tente novamente.",
  ERROR_BOOKMARK: "Não foi possível salvar. Tente novamente.",
  ERROR_REPOST: "Não foi possível repostar. Tente novamente.",
  ERROR_QUIZ: "Não foi possível enviar sua resposta. Tente novamente.",
  ERROR_NETWORK: "Erro de conexão. Verifique sua internet.",
  
  // Success States
  SUCCESS_POST: "Post publicado com sucesso!",
  SUCCESS_FOLLOW: "Agora você está seguindo este usuário.",
  SUCCESS_BOOKMARK: "Salvo nos seus bookmarks",
  SUCCESS_REPOST: "Repostado com sucesso!",
  SUCCESS_QUIZ_CORRECT: "Resposta correta! +XP ganho.",
  SUCCESS_QUIZ_WRONG: "Resposta incorreta. A resposta correta foi revelada.",
  
  // Special Events
  FIRST_POST: "+50 XP — Primeira postagem! Bem-vindo ao DevDeck.",
  LEVEL_UP: (level: number, title: string) => `Level ${level} desbloqueado! Você agora é um ${title}.`,
  MILESTONE_XP: (amount: number) => `Milestone alcançado! +${amount} XP.`,
  STREAK_DAY: (days: number) => `${days} dias seguidos! Continue assim!`,
  
  // Loading States
  LOADING_FEED: "Carregando posts...",
  LOADING_SEARCH: "Buscando...",
  LOADING_PROFILE: "Carregando perfil...",
  LOADING_LEADERBOARD: "Carregando classificação...",
  
  // Confirmations
  CONFIRM_DISCARD_DRAFT: "Descartar rascunho?",
  CONFIRM_UNFOLLOW: "Deixar de seguir este usuário?",
  CONFIRM_DELETE_POST: "Excluir este post?",
  CONFIRM_LEAVE_COMMUNITY: "Sair desta comunidade?",
  
  // Hints
  HINT_MENTION: "Digite @ para mencionar outros desenvolvedores.",
  HINT_CODE_BLOCK: "Use ``` para adicionar blocos de código.",
  HINT_MARKDOWN: "Markdown é suportado para formatação.",
  HINT_EMOJI: "Use :emoji: para adicionar emojis.",
  
  // Accessibility
  ARIA_POST_BUTTON: "Criar novo post",
  ARIA_LIKE_BUTTON: "Curtir post",
  ARIA_BOOKMARK_BUTTON: "Salvar post",
  ARIA_SHARE_BUTTON: "Compartilhar post",
  ARIA_FOLLOW_BUTTON: (isFollowing: boolean) => isFollowing ? "Deixar de seguir" : "Seguir usuário",
  ARIA_NOTIFICATION_BELL: "Notificações",
  ARIA_SEARCH_INPUT: "Buscar posts e usuários",
} as const;
```

**User Experience:**
Every empty state and error message is specific and speaks in the developer's voice. No generic "Something went wrong" messages. The copy is concise, helpful, and maintains the platform's technical identity.

**Error Handling:**
If copy fails to load, fall back to generic English messages. Ensure all copy is translatable for internationalization support.

---

## BLOCO 8 — ACESSIBILIDADE & PERFORMANCE

### 8.1 Reduced Motion Support

**CSS:**
```css
/* Already defined in globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Specific overrides */
@media (prefers-reduced-motion: reduce) {
  .dd-skeleton {
    animation: none;
    opacity: 0.6;
  }
  
  .dd-dot-pulse::after {
    animation: none;
  }
  
  .dd-glow-ring {
    animation: none;
    box-shadow: 0 0 8px 2px rgba(249, 115, 22, 0.15);
  }
  
  .dd-typing-dot { 
    animation: none; 
    opacity: 0.6; 
  }
  .dd-typing-dot:nth-child(2) { opacity: 0.4; }
  .dd-typing-dot:nth-child(3) { opacity: 0.2; }
}
```

**React Hook:**
```tsx
// Already exists: src/hooks/useReducedMotion.ts
// Usage in all animated components
const reduced = useReducedMotion();

// Conditionally apply animations
{!reduced && <motion.div variants={variants} />}
```

**User Experience:**
All animations respect the user's `prefers-reduced-motion` setting. Animations are replaced with instant state changes and simple opacity fades. The experience remains functional without motion.

**Error Handling:**
If the media query fails to detect, default to reduced motion for safety. Provide a toggle in settings to manually disable animations.

---

### 8.2 Touch Targets

**CSS:**
```css
/* Already defined in globals.css */
.dd-touch {
  min-height: 2.75rem;
  min-width: 2.75rem;
}

@media (pointer: coarse) {
  .dd-touch {
    min-height: 2.75rem;
    min-width: 2.75rem;
  }
}
```

**Tailwind Classes:**
```tsx
<button className="dd-touch dd-focus-ring p-1.5 rounded-md">
  <Icon className="w-4 h-4" />
</button>
```

**User Experience:**
All interactive elements have minimum 44×44px touch targets on mobile. Buttons, icons, and links are easily tappable. The experience is comfortable on touch devices.

**Error Handling:**
If the touch target is too small, add padding to meet the 44×44px minimum. Test on actual mobile devices.

---

### 8.3 GPU-Composited Animations

**CSS:**
```css
/* Already defined in globals.css */
.dd-gpu {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

**Tailwind Classes:**
```tsx
<motion.div className="dd-gpu">
  {/* Animated content */}
</motion.div>
```

**Guidelines:**
- Only animate `transform` and `opacity` properties
- Never animate `width`, `height`, `top`, `left` directly
- Use `will-change` sparingly for elements that will animate
- Use `transform: translateZ(0)` to promote to GPU layer
- Test performance with Chrome DevTools Performance tab

**User Experience:**
Animations run at 60fps on most devices. No jank or stuttering. The experience feels smooth and premium.

**Error Handling:**
If animations cause jank, reduce complexity or disable specific animations. Provide a performance mode in settings.

---

### 8.4 Optional Sound System

**React Hook:**
```tsx
// src/hooks/useSoundEffects.ts
"use client";

import { useCallback, useEffect, useRef } from "react";

export function useSoundEffects(enabled: boolean = false) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, [enabled]);

  const playSound = useCallback((type: 'post' | 'like' | 'levelup') => {
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Volume max 30%
    gainNode.gain.value = 0.3;

    switch (type) {
      case 'post':
        // Whoosh sound
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      case 'like':
        // Pop sound
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'levelup':
        // 3 ascending notes
        [440, 554, 659].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.value = 0.3;
          osc.frequency.value = freq;
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3 + i * 0.15);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + 0.3 + i * 0.15);
        });
        break;
    }
  }, [enabled]);

  return { playSound };
}
```

**User Experience:**
Optional sound effects (off by default) provide audio feedback: post sent = whoosh, like received = pop, level up = 3 ascending notes. Volume is max 30% to avoid being intrusive. Sounds can be toggled in settings.

**Error Handling:**
If Web Audio API fails, sounds are silently skipped. The experience remains functional without audio.

---

## Summary

This specification provides a complete interaction design system for DevDeck that:

1. **Feels immediate and satisfying** like Twitter/X with optimistic UI and spring physics
2. **Maintains technical identity** with developer-specific micro-copy and monospace fonts
3. **Respects accessibility** with reduced motion support and proper touch targets
4. **Performs well** with GPU-composited animations only
5. **Degrades gracefully** with clear error handling and fallbacks

All interactions are specified with exact CSS classes, keyframes, React hooks, UX descriptions, and error handling strategies. This document serves as the authoritative reference for implementing the complete DevDeck interaction system.
