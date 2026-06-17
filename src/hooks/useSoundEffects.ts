"use client";

import { useCallback } from "react";

export type SoundType =
  | "post"
  | "like"
  | "levelup"
  | "quiz_correct"
  | "quiz_incorrect"
  | "xpgain"
  | "bookmark"
  | "send_dm"
  | "notification";

export function useSoundEffects(enabled: boolean = false) {
  const playSound = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      let file = "";
      switch (type) {
        case "post":
          file = "Post_Sound.ogg";
          break;
        case "like":
          file = "Like_sound.mp3";
          break;
        case "levelup":
          file = "LevelUp_Sound.mp3";
          break;
        case "quiz_correct":
          file = "RightAnswer_Sound.mp3";
          break;
        case "quiz_incorrect":
          file = "WrongAnswer_Sound.mp3";
          break;
        case "xpgain":
          file = "XpGain_Sound.mp3";
          break;
        case "bookmark":
          file = "bookmark_Sound.mp3";
          break;
        case "send_dm":
          file = "SendDM_Sound.ogg";
          break;
        case "notification":
          file = "Notification_Sound.ogg";
          break;
      }

      if (file) {
        const audio = new Audio(`/sounds/${file}`);
        audio.play().catch((err) => console.log("Erro ao tocar áudio:", err));
      }
    },
    [enabled]
  );

  return { playSound };
}
