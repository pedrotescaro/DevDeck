import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let question = "";
    let options: string[] = [];
    let correctIndex = 0;
    let quizCreated = false;

    const openAiKey = process.env.OPENAI_API_KEY;

    if (openAiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  'Você é um gerador de quiz técnico. Você deve retornar um JSON com a seguinte estrutura: { "question": "pergunta de tecnologia geral", "options": ["opção A", "opção B", "opção C", "opção D"], "correct_index": 0 }',
              },
              {
                role: "user",
                content: "Gere um quiz desafiador sobre desenvolvimento de software geral.",
              },
            ],
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const content = JSON.parse(result.choices[0].message.content);
          if (
            content.question &&
            Array.isArray(content.options) &&
            content.options.length === 4 &&
            typeof content.correct_index === "number"
          ) {
            question = content.question;
            options = content.options;
            correctIndex = content.correct_index;
            quizCreated = true;
          }
        }
      } catch (err) {
        console.error("OpenAI failed generating daily quiz, falling back:", err);
      }
    }

    if (!quizCreated) {
      const count = await prisma.quizLibrary.count();
      if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuizzes = await prisma.quizLibrary.findMany({
          take: 1,
          skip: randomIndex,
        });
        if (randomQuizzes.length > 0) {
          question = randomQuizzes[0].question;
          options = randomQuizzes[0].options as string[];
          correctIndex = randomQuizzes[0].correct_index;
          quizCreated = true;
        }
      }
    }

    if (!quizCreated) {
      question = "Qual é o comportamento do typeof null no JavaScript?";
      options = ["'null'", "'undefined'", "'object'", "'string'"];
      correctIndex = 2;
    }

    const quiz = await prisma.quiz.upsert({
      where: { scheduled_for: today },
      update: {
        question,
        options,
        correct_index: correctIndex,
        is_daily: true,
      },
      create: {
        question,
        options,
        correct_index: correctIndex,
        is_daily: true,
        scheduled_for: today,
        post_id: null,
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error: any) {
    console.error("Daily quiz generation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar quiz diário" },
      { status: 500 }
    );
  }
}
