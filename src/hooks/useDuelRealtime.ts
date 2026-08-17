'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface DuelPlayerPresence {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  isReady?: boolean;
}

export interface OpponentLiveState {
  isConnected: boolean;
  isReady: boolean;
  linesCount: number;
  testsPassed: number;
  totalTests: number;
  isTyping: boolean;
  username?: string;
  avatarUrl?: string | null;
}

export function useDuelRealtime({
  duelId,
  user,
  onOpponentWon,
  onRematchOffer,
}: {
  duelId: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
  };
  onOpponentWon?: (winnerData: any) => void;
  onRematchOffer?: () => void;
}) {
  const [presenceUsers, setPresenceUsers] = useState<DuelPlayerPresence[]>([]);
  const [opponentState, setOpponentState] = useState<OpponentLiveState>({
    isConnected: false,
    isReady: false,
    linesCount: 0,
    testsPassed: 0,
    totalTests: 3,
    isTyping: false,
  });
  const [duelPhase, setDuelPhase] = useState<'waiting' | 'countdown' | 'battle' | 'finished'>(
    'waiting'
  );
  const [countdownNumber, setCountdownNumber] = useState<number>(3);
  const [isSelfReady, setIsSelfReady] = useState(false);

  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!duelId || !user?.id) return;

    const supabase = createClient();
    const channel = supabase.channel(`duel:${duelId}`, {
      config: {
        presence: { key: user.id },
      },
    });

    channelRef.current = channel;

    // 1. Presence tracking
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players: DuelPlayerPresence[] = [];
        let opponentPresent = false;

        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          if (presences && presences.length > 0) {
            const p = presences[0];
            players.push({
              userId: p.userId,
              username: p.username,
              avatarUrl: p.avatarUrl,
              isReady: p.isReady,
            });

            if (p.userId !== user.id) {
              opponentPresent = true;
              setOpponentState((prev) => ({
                ...prev,
                isConnected: true,
                username: p.username,
                avatarUrl: p.avatarUrl,
                isReady: !!p.isReady,
              }));
            }
          }
        });

        setPresenceUsers(players);
        if (!opponentPresent) {
          setOpponentState((prev) => ({ ...prev, isConnected: false }));
        }
      })
      .on('presence', { event: 'join' }, ({ newPresences }: any) => {
        if (newPresences?.[0]?.userId !== user.id) {
          setOpponentState((prev) => ({
            ...prev,
            isConnected: true,
            username: newPresences[0].username,
            avatarUrl: newPresences[0].avatarUrl,
            isReady: !!newPresences[0].isReady,
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
        if (leftPresences?.[0]?.userId !== user.id) {
          setOpponentState((prev) => ({
            ...prev,
            isConnected: false,
            isReady: false,
          }));
        }
      });

    // 2. Broadcast events
    channel.on('broadcast', { event: 'duel_action' }, ({ payload }: any) => {
      if (!payload || payload.senderId === user.id) return;

      switch (payload.type) {
        case 'player_ready':
          setOpponentState((prev) => ({ ...prev, isReady: true }));
          break;

        case 'start_countdown':
          setDuelPhase('countdown');
          setCountdownNumber(3);
          let current = 3;
          const timer = setInterval(() => {
            current -= 1;
            if (current > 0) {
              setCountdownNumber(current);
            } else {
              clearInterval(timer);
              setDuelPhase('battle');
            }
          }, 1000);
          break;

        case 'typing':
          setOpponentState((prev) => ({
            ...prev,
            isTyping: true,
            linesCount: payload.linesCount ?? prev.linesCount,
          }));
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setOpponentState((prev) => ({ ...prev, isTyping: false }));
          }, 1500);
          break;

        case 'test_progress':
          setOpponentState((prev) => ({
            ...prev,
            testsPassed: payload.testsPassed,
            totalTests: payload.totalTests ?? prev.totalTests,
          }));
          break;

        case 'player_won':
          setDuelPhase('finished');
          if (onOpponentWon) {
            onOpponentWon(payload);
          }
          break;

        case 'rematch':
          if (onRematchOffer) {
            onRematchOffer();
          }
          break;
      }
    });

    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          userId: user.id,
          username: user.username,
          avatarUrl: user.avatar_url,
          isReady: false,
        });
      }
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [duelId, user?.id, user?.username, user?.avatar_url, onOpponentWon, onRematchOffer]);

  const sendReady = useCallback(async () => {
    setIsSelfReady(true);
    if (!channelRef.current) return;

    await channelRef.current.track({
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatar_url,
      isReady: true,
    });

    await channelRef.current.send({
      type: 'broadcast',
      event: 'duel_action',
      payload: {
        senderId: user.id,
        type: 'player_ready',
      },
    });
  }, [user]);

  const startCountdown = useCallback(async () => {
    setDuelPhase('countdown');
    setCountdownNumber(3);

    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'duel_action',
        payload: {
          senderId: user.id,
          type: 'start_countdown',
        },
      });
    }

    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdownNumber(current);
      } else {
        clearInterval(timer);
        setDuelPhase('battle');
      }
    }, 1000);
  }, [user]);

  const sendTyping = useCallback(
    async (linesCount: number) => {
      if (!channelRef.current) return;
      await channelRef.current.send({
        type: 'broadcast',
        event: 'duel_action',
        payload: {
          senderId: user.id,
          type: 'typing',
          linesCount,
        },
      });
    },
    [user]
  );

  const sendTestProgress = useCallback(
    async (testsPassed: number, totalTests: number) => {
      if (!channelRef.current) return;
      await channelRef.current.send({
        type: 'broadcast',
        event: 'duel_action',
        payload: {
          senderId: user.id,
          type: 'test_progress',
          testsPassed,
          totalTests,
        },
      });
    },
    [user]
  );

  const sendVictory = useCallback(
    async (solutionCode: string) => {
      setDuelPhase('finished');
      if (!channelRef.current) return;
      await channelRef.current.send({
        type: 'broadcast',
        event: 'duel_action',
        payload: {
          senderId: user.id,
          type: 'player_won',
          winnerId: user.id,
          winnerUsername: user.username,
          code: solutionCode,
        },
      });
    },
    [user]
  );

  const sendRematch = useCallback(async () => {
    if (!channelRef.current) return;
    await channelRef.current.send({
      type: 'broadcast',
      event: 'duel_action',
      payload: {
        senderId: user.id,
        type: 'rematch',
      },
    });
  }, [user]);

  return {
    presenceUsers,
    opponentState,
    duelPhase,
    countdownNumber,
    isSelfReady,
    sendReady,
    startCountdown,
    sendTyping,
    sendTestProgress,
    sendVictory,
    sendRematch,
    setDuelPhase,
  };
}
