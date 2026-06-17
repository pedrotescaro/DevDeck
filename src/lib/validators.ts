import { z } from "zod";
import { Language } from "@prisma/client";

export const createPostSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(100),
  body: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  language: z.nativeEnum(Language).optional().nullable(),
  code_snippet: z.string().optional().nullable(),
  image_url: z.string().url("URL de imagem inválida").or(z.string().length(0)).optional().nullable(),
});

export const createAnswerSchema = z.object({
  body: z.string().min(5, "A resposta deve ter pelo menos 5 caracteres"),
  code_snippet: z.string().optional().nullable(),
});

export const quizAttemptSchema = z.object({
  selected_index: z.number().int().min(0, "Seleção inválida"),
});

export const createDuelSchema = z.object({
  problem_title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  problem_body: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  language: z.nativeEnum(Language, {
    message: "Linguagem inválida",
  }),
});

export const duelVoteSchema = z.object({
  solution_id: z.string().uuid("ID de solução inválido"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .max(20, "O nome de usuário deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "O nome de usuário só pode conter letras, números e sublinhados"),
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
