'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { TRAILS_DATA, TrailLevel, TrailQuestion } from '@/lib/trailsData';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Lock,
  Star,
  Check,
  X,
  ChevronRight,
  Trophy,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  Info,
  Loader2,
  Play,
  Flag,
  Swords,
  Send,
  Lightbulb,
  Code2,
  Search,
  BookText,
  Bug,
  Library,
} from 'lucide-react';
import Link from 'next/link';
import { CodeEditor } from '@/components/CodeEditor';
import { codemirrorLanguageId } from '@/lib/editor/languages';
import { runCodeInSandbox } from '@/lib/code-runner';
import { CHECKPOINTS_DATA } from '@/lib/checkpointData';
const getLanguageFullName = (code: string) => {
  const map: Record<string, string> = {
    JS: 'JavaScript',
    TS: 'TypeScript',
    PYTHON: 'Python',
    RUST: 'Rust',
    GO: 'Go',
    JAVA: 'Java',
  };
  return map[code.toUpperCase()] || code;
};

function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

function getLearnSlidesForLevel(level: TrailLevel) {
  return level.questions.map((q, idx) => {
    let title = `Conceito ${idx + 1}: ${level.title}`;
    let concept = '';
    let code = '';
    let tip = '';

    if (q.id === 'js-l1-q1') {
      title = "Escopo de Bloco com 'let'";
      concept =
        "Em JavaScript moderno, declaramos variáveis reatribuíveis com escopo de bloco usando a palavra-chave 'let'. Diferente do antigo 'var', que tem escopo de função e sofre com hoisting indesejado, o 'let' respeita as chaves em que foi criado.";
      code =
        "{\n  let blockScoped = 'disponível apenas aqui';\n  var functionScoped = 'vaza para fora';\n}\nconsole.log(functionScoped); // Funciona!\nconsole.log(blockScoped); // Erro!";
      tip = "Use sempre 'const' por padrão, e 'let' apenas se precisar reatribuir a variável.";
    } else if (q.id === 'js-l1-q2') {
      title = "O Tipo Oculto de 'null'";
      concept =
        "O operador 'typeof' retorna uma string indicando o tipo do operando. No entanto, por razões históricas e de compatibilidade com versões antigas do JavaScript, 'typeof null' retorna a string 'object'. Isso é considerado um bug de design na linguagem, mas nunca foi alterado para não quebrar a web legada.";
      code =
        "console.log(typeof null); // 'object'\nconsole.log(typeof undefined); // 'undefined'\nconsole.log(null === null); // true";
      tip =
        "Para verificar se um valor é nulo, compare diretamente usando 'val === null' em vez de usar 'typeof'.";
    } else if (q.id === 'js-l1-q3') {
      title = "Conversão de Tipos com 'parseInt()'";
      concept =
        "A função global 'parseInt()' analisa um argumento do tipo string e retorna um número inteiro da base especificada (radix). Ela é útil para extrair números de strings de texto mistas.";
      code =
        "const larguraStr = '120px';\nconst largura = parseInt(larguraStr, 10);\nconsole.log(largura); // 120 (como number)\nconsole.log(parseInt('abc')); // NaN (Not a Number)";
      tip =
        'Sempre passe o segundo argumento (radix, geralmente 10) para o parseInt() para evitar interpretações incorretas em bases antigas (como octal).';
    } else if (q.id === 'js-l2-q1') {
      title = 'Igualdade Estrita (===)';
      concept =
        "O operador '===' (identidade ou igualdade estrita) compara tanto o valor quanto o tipo dos dois operandos. Já o operador '==' realiza coerção automática de tipo antes de comparar, o que pode levar a comportamentos inesperados.";
      code =
        "console.log(5 == '5');   // true (faz coerção de tipo)\nconsole.log(5 === '5');  // false (tipos diferentes: number vs string)\nconsole.log(0 == false);  // true\nconsole.log(0 === false); // false";
      tip =
        'Use sempre o operador de igualdade estrita (===) para evitar bugs silenciosos de coerção de tipo.';
    } else if (q.id === 'js-l2-q2') {
      title = "Tratamento de Erros com 'try...catch'";
      concept =
        "A instrução 'try...catch' marca um bloco de declarações para testar (try) e especifica uma resposta, caso uma exceção seja lançada (catch). Isso previne que um erro interrompa totalmente a execução da sua aplicação.";
      code =
        "try {\n  const res = executarFuncaoPerigosa();\n} catch (error) {\n  console.error('Um erro ocorreu:', error.message);\n  // A aplicação continua rodando de forma estável\n}";
      tip =
        "Você pode usar um bloco 'finally' opcional que roda independente de ter ocorrido erro ou não.";
    } else if (q.id === 'js-l2-q3') {
      title = "Garantindo Execução com 'do...while'";
      concept =
        "O loop 'do...while' repete uma instrução até que a condição de teste avalie como falsa. A principal característica do 'do...while' é que o bloco de código dentro do 'do' sempre roda pelo menos uma vez antes de avaliar a condição.";
      code =
        "let contador = 10;\ndo {\n  console.log('Executou pelo menos uma vez!');\n} while (contador < 5);";
      tip =
        "Use 'do...while' quando a primeira interação precisa acontecer antes de fazer a checagem lógica.";
    } else if (q.id === 'ts-l1-q1') {
      title = "O Tipo 'never' no TypeScript";
      concept =
        "No TypeScript, o tipo 'never' representa valores que nunca ocorrem. É usado para tipar funções que sempre lançam exceções ou loops infinitos de onde a execução nunca retorna, garantindo segurança de tipos estrita.";
      code =
        'function lancarErro(msg: string): never {\n  throw new Error(msg);\n}\n\nfunction loopInfinito(): never {\n  while (true) {}\n}';
      tip = "O tipo 'never' é ideal para análise exaustiva em switch statements (type narrowing).";
    } else if (q.id === 'ts-l1-q2') {
      title = "Diferença entre 'any' e 'unknown'";
      concept =
        "Tanto 'any' quanto 'unknown' aceitam qualquer valor. No entanto, 'unknown' é o tipo seguro correspondente. Você não pode chamar métodos ou acessar propriedades de uma variável 'unknown' sem antes realizar uma checagem de tipo (type guard) ou asserção.";
      code =
        "let valor1: any = 'olá';\nvalor1.falar(); // Compila (mas pode dar erro em runtime)\n\nlet valor2: unknown = 'olá';\n// valor2.falar(); // Erro de Compilação!\n\nif (typeof valor2 === 'string') {\n  console.log(valor2.toUpperCase()); // Seguro e permitido!\n}";
      tip =
        "Prefira sempre usar 'unknown' no lugar de 'any' para manter a segurança estática de tipo.";
    } else if (q.id === 'ts-l1-q3') {
      title = 'Type Assertion (Asserção de Tipo)';
      concept =
        "A asserção de tipo informa ao compilador do TypeScript que você sabe mais sobre o tipo da variável do que ele. É uma conversão puramente em tempo de compilação. Pode ser declarada usando a sintaxe 'as Tipo' ou '<Tipo>'.";
      code =
        "let algumaCoisa: any = 'DevDeck';\nlet tamanho1 = (algumaCoisa as string).length; // Recomendado\nlet tamanho2 = (<string>algumaCoisa).length; // Sintaxe alternativa";
      tip =
        "A sintaxe '<Tipo>' pode conflitar com JSX/TSX em React, portanto, prefira usar a palavra-chave 'as'.";
    } else {
      const correctAnswer = q.options[q.correctIndex];
      title = `Lição: ${q.question.replace(/\?$/, '').replace(/^Qual\s+|^O que\s+|^Qual é o\s+/, '')}`;
      concept = `Para dominar este tema, entenda o seguinte: no contexto de "${level.title}", a pergunta principal é: "${q.question}"\n\nNesta situação, a resposta correta e mais performática é "${correctAnswer}". Ao projetar sistemas e escrever códigos, lembre-se de que essa convenção ou abordagem ajuda a otimizar a legibilidade, a evitar erros lógicos e a seguir as melhores práticas recomendadas para a linguagem.`;
      if (q.options.length > 0) {
        code = `// Exemplo prático do conceito de ${level.title}\n// O valor esperado/correto para esta lógica é:\nconst resultado = "${correctAnswer}";\nconsole.log(resultado); // Atende ao comportamento esperado`;
      }
      tip = `Lembre-se sempre de examinar as nuances de ${level.title} ao escrever códigos de produção!`;
    }

    return { title, concept, code, tip };
  });
}
function getCheckpointReviewSlides(levels: TrailLevel[]) {
  return levels.map((level) => {
    const slides = getLearnSlidesForLevel(level);
    return {
      levelTitle: level.title,
      ...slides[0],
    };
  });
}

interface TrailsContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  initialTrails: {
    language: string;
    xp: number;
    level: number;
  }[];
  initialAttempts: Record<string, boolean>;
  initialAttemptSelections: Record<string, number>;
}

export function TrailsContent({
  user,
  initialTrails,
  initialAttempts,
  initialAttemptSelections,
}: TrailsContentProps) {
  const reduced = useReducedMotion();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateSoundState = () => {
      setSoundEnabled(localStorage.getItem('devdeck-sound') !== 'false');
    };

    updateSoundState();

    window.addEventListener('storage', updateSoundState);
    window.addEventListener('devdeck-sound-changed', updateSoundState);

    return () => {
      window.removeEventListener('storage', updateSoundState);
      window.removeEventListener('devdeck-sound-changed', updateSoundState);
    };
  }, []);

  const { playSound } = useSoundEffects(soundEnabled);

  // Estados principais
  const [activeLang, setActiveLang] = useState<string>('JS');
  const [attempts, setAttempts] = useState<Record<string, boolean>>(initialAttempts);
  const [attemptSelections, setAttemptSelections] =
    useState<Record<string, number>>(initialAttemptSelections);
  const [trails, setTrails] = useState(initialTrails);
  const [userXp, setUserXp] = useState(user.total_xp);

  // Trilha Única Contínua - Estados de Seção removidos

  // Estados do Modal do Quiz
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<TrailLevel | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Estados das etapas (Aprender, Praticar, Desafio)
  const [currentStage, setCurrentStage] = useState<'learn' | 'practice' | 'challenge' | 'summary'>(
    'learn'
  );
  const [learnStep, setLearnStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);

  // Estado do LevelUp
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [unlockedTitle, setUnlockedTitle] = useState('');
  const [newLevelNumber, setNewLevelNumber] = useState(1);

  // Estados para o Agente de IA nas Trilhas
  const [aiChatOpen, setAiChatOpen] = useState(false);
  interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Estados para o Ducky IA na barra lateral
  interface DuckyMessage {
    role: 'user' | 'model';
    content: string;
  }
  const [duckyMessages, setDuckyMessages] = useState<DuckyMessage[]>([]);
  const [duckyInput, setDuckyInput] = useState('');
  const [duckyLoading, setDuckyLoading] = useState(false);

  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const sidebarChatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para mensagens nos modals
  useEffect(() => {
    if (aiChatOpen) {
      setTimeout(() => {
        aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [aiMessages, aiLoading, aiChatOpen]);

  // Auto-scroll para mensagens na sidebar principal
  useEffect(() => {
    setTimeout(() => {
      sidebarChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }, [duckyMessages, duckyLoading]);

  useEffect(() => {
    setDuckyMessages([
      {
        role: 'model',
        content: `Quack! 🦆 Eu sou o Ducky, seu patinho de borracha! Como posso ajudar com a trilha de **${getLanguageFullName(activeLang)}** hoje? Pode me enviar um código com bug ou tirar dúvidas!`,
      },
    ]);
  }, [activeLang]);

  // Enviar mensagem para o Ducky IA
  const handleSendDuckyMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!duckyInput.trim() || duckyLoading) return;

    const userMsg: DuckyMessage = { role: 'user', content: duckyInput };
    const updatedMessages = [...duckyMessages, userMsg];
    setDuckyMessages(updatedMessages);
    setDuckyInput('');
    setDuckyLoading(true);

    try {
      const response = await fetch('/api/ai/ducky/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeLang,
          history: updatedMessages,
        }),
      });

      const data = await response.json();
      setDuckyLoading(false);

      if (response.ok && data.text) {
        setDuckyMessages((prev) => [...prev, { role: 'model', content: data.text }]);
      } else {
        setDuckyMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content:
              'Quack... Desculpe, tive um problema ao processar sua dúvida. Pode tentar novamente?',
          },
        ]);
      }
    } catch (err) {
      setDuckyLoading(false);
      setDuckyMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Quack... Não consegui me conectar com os servidores de IA.',
        },
      ]);
    }
  };

  // Estado para o ranking/classificação geral na barra lateral
  interface LeaderboardUser {
    rank: number;
    username: string;
    avatar_url?: string | null;
    xp: number;
    level: number;
  }
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [topUsersLoading, setTopUsersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setTopUsersLoading(true);
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setTopUsers(data.slice(0, 3));
        }
      })
      .catch((err) => console.error('Erro ao buscar ranking na sidebar:', err))
      .finally(() => {
        if (active) setTopUsersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Estados para Checkpoints
  const [checkpointModalOpen, setCheckpointModalOpen] = useState(false);
  const [activeCheckpointUnit, setActiveCheckpointUnit] = useState<number | null>(null);
  const [checkpointStage, setCheckpointStage] = useState<'review' | 'exercise' | 'summary'>(
    'review'
  );
  const [checkpointReviewStep, setCheckpointReviewStep] = useState(0);
  const [checkpointCode, setCheckpointCode] = useState('');
  const [checkpointOutput, setCheckpointOutput] = useState<string | null>(null);
  const [checkpointError, setCheckpointError] = useState<string | null>(null);
  const [checkpointRunning, setCheckpointRunning] = useState(false);
  const [checkpointSuccess, setCheckpointSuccess] = useState(false);

  // Função para renderizar o conteúdo da mensagem com markdown simples
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`|\`.*?\`|\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^[a-zA-Z]+\n/, '');
        return (
          <pre
            key={idx}
            className="bg-black/30 text-orange-200 rounded-lg p-2.5 my-1.5 font-mono text-[9px] overflow-x-auto whitespace-pre leading-relaxed select-text"
          >
            <code>{code}</code>
          </pre>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const code = part.slice(1, -1);
        return (
          <code
            key={idx}
            className="bg-dd-border px-1 py-0.5 rounded text-[10px] font-mono text-orange-400"
          >
            {code}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={idx} className="font-extrabold text-dd-text">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  // Efeito para atualizar as mensagens de boas-vindas do Tutor de IA dependendo do contexto
  useEffect(() => {
    if (!quizModalOpen && !checkpointModalOpen) {
      setAiMessages([]);
      setAiChatOpen(false);
      return;
    }

    let welcomeText = '';

    if (checkpointModalOpen && activeCheckpointUnit) {
      const challenge = CHECKPOINTS_DATA[activeLang]?.[activeCheckpointUnit]?.challenge;
      if (checkpointStage === 'review') {
        const slides = getCheckpointSlides();
        const slide = slides[checkpointReviewStep];
        welcomeText = `Revisão do checkpoint ativo: **"${slide?.title}"**. Qual conceito você gostaria que eu explicasse melhor?`;
      } else if (checkpointStage === 'exercise') {
        welcomeText = `Desafio de código ativo: **"${challenge?.title}"**. Se tiver dificuldades com a lógica do desafio ou a sintaxe de ${getLanguageFullName(activeLang)}, compartilhe suas dúvidas!`;
      } else {
        welcomeText = `Checkpoint concluído com sucesso!`;
      }
    } else if (quizModalOpen && activeLevel) {
      if (currentStage === 'learn') {
        const slides = getLearnSlidesForLevel(activeLevel);
        const slide = slides[learnStep];
        welcomeText = `Acompanhando você no conceito **"${slide?.title}"**. Como posso te ajudar a entender melhor?`;
      } else if (currentStage === 'practice' || currentStage === 'challenge') {
        welcomeText = `Exercício ativo. Se precisar de uma dica sutil sem a resposta direta, basta me pedir!`;
      } else {
        welcomeText = `Fase concluída! Quer tirar alguma dúvida final sobre o conteúdo estudado?`;
      }
    }

    setAiMessages((prev) => {
      if (prev.length > 0) {
        // Evitar duplicar mensagens de atualização idênticas consecutivas
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.content.includes(welcomeText)) return prev;
        return [
          ...prev,
          { role: 'assistant', content: `🔄 *Contexto atualizado:* ${welcomeText}` },
        ];
      }
      return [
        {
          role: 'assistant',
          content: `Quack! 🦆 Eu sou o **Ducky**, seu tutor de IA para **${getLanguageFullName(activeLang)}**. ${welcomeText}`,
        },
      ];
    });
  }, [
    quizModalOpen,
    checkpointModalOpen,
    currentStage,
    learnStep,
    currentQuestionIndex,
    activeLevel,
    activeLang,
    checkpointStage,
    checkpointReviewStep,
    activeCheckpointUnit,
  ]);

  // Função para enviar mensagem para o Tutor de IA
  const handleSendAiMessage = async (customMessage?: string) => {
    const textToSend = customMessage || aiInput;
    if (!textToSend.trim() || aiLoading || (!activeLevel && !checkpointModalOpen)) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...aiMessages, userMessage];

    setAiMessages(updatedMessages);
    if (!customMessage) setAiInput('');
    setAiLoading(true);

    try {
      let currentContext: any = {};
      let stageToSend = '';

      if (checkpointModalOpen && activeCheckpointUnit) {
        const challenge = CHECKPOINTS_DATA[activeLang]?.[activeCheckpointUnit]?.challenge;
        if (checkpointStage === 'review') {
          const slides = getCheckpointSlides();
          const slide = slides[checkpointReviewStep];
          stageToSend = 'checkpoint-review';
          currentContext = {
            title: slide?.title || '',
            concept: slide?.concept || '',
            code: slide?.code || '',
            tip: slide?.tip || '',
            checkpointUnit: activeCheckpointUnit,
          };
        } else if (checkpointStage === 'exercise') {
          stageToSend = 'checkpoint-challenge';
          currentContext = {
            challengeTitle: challenge?.title || '',
            challengeDescription: challenge?.description || '',
            userCode: checkpointCode,
            checkpointUnit: activeCheckpointUnit,
          };
        } else {
          stageToSend = 'checkpoint-summary';
          currentContext = {
            checkpointUnit: activeCheckpointUnit,
          };
        }
      } else if (activeLevel) {
        stageToSend = currentStage;
        if (currentStage === 'learn') {
          const slides = getLearnSlidesForLevel(activeLevel);
          const slide = slides[learnStep];
          currentContext = {
            title: slide.title,
            concept: slide.concept,
            code: slide.code,
            tip: slide.tip,
          };
        } else if (currentStage === 'practice' || currentStage === 'challenge') {
          const question = activeLevel.questions[currentQuestionIndex];
          currentContext = {
            question: question.question,
            options: question.options,
            correctIndex: question.correctIndex,
          };
        }
      }

      const response = await fetch('/api/ai/trails/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeLang,
          levelTitle: activeLevel?.title || `Checkpoint ${activeCheckpointUnit}`,
          stage: stageToSend,
          currentContext,
          history: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da API');
      }

      const data = await response.json();
      setAiMessages([...updatedMessages, { role: 'assistant', content: data.text }]);
    } catch (error) {
      console.error(error);
      setAiMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao tentar processar sua mensagem. Certifique-se de que as chaves de API estão configuradas corretamente.',
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Obter nível e XP da linguagem atual
  const activeTrail = trails.find((t) => t.language === activeLang) || {
    language: activeLang,
    xp: 0,
    level: 1,
  };

  const currentLevel = getLevelFromXp(userXp);
  const hasAnsweredQuestion = (questionId: string) =>
    Object.prototype.hasOwnProperty.call(attempts, questionId);
  const getSavedSelectedOption = (question: TrailQuestion) => {
    if (!hasAnsweredQuestion(question.id)) return null;
    return attemptSelections[question.id] ?? (attempts[question.id] ? question.correctIndex : null);
  };
  const loadQuestionState = (level: TrailLevel, questionIndex: number) => {
    const question = level.questions[questionIndex];

    if (!question || !hasAnsweredQuestion(question.id)) {
      setSelectedOption(null);
      setAnswered(false);
      return;
    }

    setSelectedOption(getSavedSelectedOption(question));
    setAnswered(true);
  };

  // Verificar se o nível está desbloqueado (progressão linear com checkpoints)
  const isLevelUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true;

    const currentLevel = TRAILS_DATA[activeLang]?.[levelIndex];
    const prevLevel = TRAILS_DATA[activeLang]?.[levelIndex - 1];

    if (currentLevel && prevLevel && currentLevel.unitNumber !== prevLevel.unitNumber) {
      const prevUnitNumber = prevLevel.unitNumber;
      const checkpointId = `${activeLang.toLowerCase()}-u${prevUnitNumber}-checkpoint`;
      return attempts[checkpointId] === true;
    }

    return prevLevel.questions.every((q) => attempts[q.id] === true);
  };

  // Checkpoints da linguagem ativa
  const activeLangCheckpoints = [1, 2, 3].map((unitNum) => {
    const checkpointId = `${activeLang.toLowerCase()}-u${unitNum}-checkpoint`;
    const isCompleted = attempts[checkpointId] === true;

    // Achar o último nível dessa unidade
    const unitLevels = TRAILS_DATA[activeLang]?.filter((l) => l.unitNumber === unitNum) || [];
    const lastLevel = unitLevels[unitLevels.length - 1];
    const isUnlocked = lastLevel && lastLevel.questions.every((q) => attempts[q.id] === true);

    return {
      unitNumber: unitNum,
      checkpointId,
      isCompleted,
      isUnlocked,
      data: CHECKPOINTS_DATA[activeLang]?.[unitNum],
    };
  });

  const recommendedCheckpoint = activeLangCheckpoints.find(
    (cp) => cp.isUnlocked && !cp.isCompleted
  );

  // Nível recomendado (primeira fase incompleta da linguagem atual que esteja desbloqueada, se não houver checkpoint pendente)
  const recommendedLevel = recommendedCheckpoint
    ? null
    : TRAILS_DATA[activeLang]?.find((level) => {
        const globalIdx = TRAILS_DATA[activeLang].findIndex(
          (l) => l.levelNumber === level.levelNumber
        );
        const unlocked = isLevelUnlocked(globalIdx);
        const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
        return unlocked && completedCount < level.questions.length;
      });

  // Unidade ativa
  const activeUnitNumber = recommendedCheckpoint
    ? recommendedCheckpoint.unitNumber
    : recommendedLevel
      ? recommendedLevel.unitNumber
      : 3;

  const activeUnitLevel =
    TRAILS_DATA[activeLang]?.find((level) => level.unitNumber === activeUnitNumber) ||
    TRAILS_DATA[activeLang]?.[0];

  const handleCheckpointClick = (unitNumber: number) => {
    const checkpointId = `${activeLang.toLowerCase()}-u${unitNumber}-checkpoint`;
    const isCompleted = attempts[checkpointId] === true;

    // Verificar se o checkpoint está desbloqueado (todas as fases da unidade concluídas)
    const unitLevels = TRAILS_DATA[activeLang]?.filter((l) => l.unitNumber === unitNumber) || [];
    const lastLevel = unitLevels[unitLevels.length - 1];
    const checkpointUnlocked =
      lastLevel && lastLevel.questions.every((q) => attempts[q.id] === true);

    if (!checkpointUnlocked) {
      playSound('notification');
      setConfirmDialog({
        isOpen: true,
        title: 'Checkpoint Bloqueado',
        message:
          'Este checkpoint está bloqueado! Complete todas as fases e exercícios desta unidade para liberá-lo.',
        confirmText: 'Entendido',
        variant: 'info',
        onConfirm: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (isCompleted) {
      setConfirmDialog({
        isOpen: true,
        title: 'Refazer Checkpoint?',
        message:
          'Você já concluiu este checkpoint e recebeu a recompensa de XP. Deseja refazer a revisão e o exercício prático de código?',
        confirmText: 'Refazer',
        cancelText: 'Cancelar',
        variant: 'warning',
        onConfirm: () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          startCheckpoint(unitNumber);
        },
        onCancel: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
    } else {
      startCheckpoint(unitNumber);
    }
  };

  const startCheckpoint = (unitNumber: number) => {
    const data = CHECKPOINTS_DATA[activeLang]?.[unitNumber];
    if (!data) return;

    setActiveCheckpointUnit(unitNumber);
    setCheckpointStage('review');
    setCheckpointReviewStep(0);
    setCheckpointCode(data.challenge.template);
    setCheckpointOutput(null);
    setCheckpointError(null);
    setCheckpointRunning(false);
    setCheckpointSuccess(false);
    setCheckpointModalOpen(true);
  };

  const getCheckpointSlides = () => {
    if (!activeCheckpointUnit) return [];
    const unitLevels =
      TRAILS_DATA[activeLang]?.filter((l) => l.unitNumber === activeCheckpointUnit) || [];
    return getCheckpointReviewSlides(unitLevels);
  };

  const openLevelFromStart = (level: TrailLevel) => {
    setActiveLevel(level);
    setCurrentStage('learn');
    setLearnStep(0);
    setPracticeStep(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setCorrectCount(0);
    setXpEarned(0);
    setQuizError(null);
    setQuizModalOpen(true);
  };

  const openLevelAtSavedProgress = (level: TrailLevel) => {
    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    const firstPendingQuestionIndex = level.questions.findIndex((q) => !hasAnsweredQuestion(q.id));

    setActiveLevel(level);
    setCorrectCount(completedCount);
    setXpEarned(0);
    setQuizError(null);
    setQuizModalOpen(true);

    if (firstPendingQuestionIndex === -1) {
      const lastQuestionIndex = Math.max(level.questions.length - 1, 0);
      const lastQuestion = level.questions[lastQuestionIndex];

      setCurrentStage('summary');
      setLearnStep(Math.max(level.questions.length - 1, 0));
      setPracticeStep(Math.max(level.questions.length - 2, 0));
      setCurrentQuestionIndex(lastQuestionIndex);
      setSelectedOption(lastQuestion ? getSavedSelectedOption(lastQuestion) : null);
      setAnswered(true);
      return;
    }

    setLearnStep(Math.max(level.questions.length - 1, 0));
    setCurrentQuestionIndex(firstPendingQuestionIndex);
    setSelectedOption(null);
    setAnswered(false);

    if (firstPendingQuestionIndex >= 2) {
      setCurrentStage('challenge');
      setPracticeStep(Math.max(level.questions.length - 2, 0));
    } else {
      setCurrentStage('practice');
      setPracticeStep(firstPendingQuestionIndex);
    }
  };

  const handleRunCheckpointCode = async () => {
    if (!activeCheckpointUnit) return;
    const challenge = CHECKPOINTS_DATA[activeLang]?.[activeCheckpointUnit]?.challenge;
    if (!challenge) return;

    setCheckpointRunning(true);
    setCheckpointOutput(null);
    setCheckpointError(null);

    const fullCode = checkpointCode + '\n' + challenge.checkCode;

    try {
      const result = await runCodeInSandbox(fullCode, activeLang);

      setCheckpointOutput(result.output || null);
      setCheckpointError(result.error || null);

      if (result.ok) {
        const normalize = (str: string) => str.replace(/\r/g, '').trim();

        const outputLines = normalize(result.output || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        const expectedLines = normalize(challenge.expectedOutput)
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        const lastOutputLines = outputLines.slice(-expectedLines.length);

        const isMatch =
          lastOutputLines.length === expectedLines.length &&
          lastOutputLines.every((line, idx) => {
            const normLine = line.replace(/\s+/g, ' ');
            const normExp = expectedLines[idx].replace(/\s+/g, ' ');
            return normLine === normExp;
          });

        if (isMatch) {
          playSound('quiz_correct');
          setCheckpointSuccess(true);
        } else {
          playSound('quiz_incorrect');
          setCheckpointError(
            `Output incorreto.\nEsperado:\n${challenge.expectedOutput}\n\nObtido:\n${result.output}`
          );
        }
      } else {
        playSound('quiz_incorrect');
      }
    } catch (err: any) {
      playSound('quiz_incorrect');
      setCheckpointError(err.message || 'Erro ao executar o código.');
    } finally {
      setCheckpointRunning(false);
    }
  };

  const handleCompleteCheckpoint = async () => {
    if (!activeCheckpointUnit) return;
    const checkpointId = `${activeLang.toLowerCase()}-u${activeCheckpointUnit}-checkpoint`;

    setSubmittingAttempt(true);

    try {
      const res = await fetch('/api/trails/checkpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkpointId,
          language: activeLang,
          unitNumber: activeCheckpointUnit,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        setAttempts((prev) => ({
          ...prev,
          [checkpointId]: true,
        }));

        if (data.xpResult) {
          setXpEarned(data.xpEarned || 50);
          setUserXp(data.xpResult.newTotalXp);

          setTrails((prev) => {
            return prev.map((t) => {
              if (t.language === activeLang) {
                return {
                  ...t,
                  xp: data.xpResult.newLanguageXp,
                  level: data.xpResult.newLanguageLevel,
                };
              }
              return t;
            });
          });

          const oldLevel = getLevelFromXp(userXp);
          const newLevel = getLevelFromXp(data.xpResult.newTotalXp);
          if (newLevel > oldLevel) {
            setNewLevelNumber(newLevel);
            setUnlockedTitle(getLevelTitle(newLevel));
            setLevelUpVisible(true);
            playSound('levelup');
          }
        }

        setCheckpointStage('summary');
      } else {
        const errData = await res.json();
        console.error('Error saving checkpoint:', errData.error);
      }
    } catch (err) {
      console.error('Network error saving checkpoint:', err);
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const handleResetLevelAttempts = async (level: TrailLevel) => {
    const questionIds = level.questions.map((q) => q.id);

    try {
      const res = await fetch('/api/quiz/reset-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_ids: questionIds }),
      });

      if (res.ok) {
        setAttempts((prev) => {
          const next = { ...prev };
          questionIds.forEach((id) => {
            delete next[id];
          });
          return next;
        });
        setAttemptSelections((prev) => {
          const next = { ...prev };
          questionIds.forEach((id) => {
            delete next[id];
          });
          return next;
        });

        openLevelFromStart(level);
      } else {
        setConfirmDialog({
          isOpen: true,
          title: 'Erro',
          message: 'Erro ao resetar progresso da fase.',
          confirmText: 'Entendido',
          variant: 'danger',
          onConfirm: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
        });
      }
    } catch (err) {
      console.error('Error resetting level attempts:', err);
      setConfirmDialog({
        isOpen: true,
        title: 'Erro de Conexão',
        message: 'Erro de conexão ao tentar resetar a fase.',
        confirmText: 'Entendido',
        variant: 'danger',
        onConfirm: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleLevelClick = async (level: TrailLevel, unlocked: boolean) => {
    if (!unlocked) {
      playSound('notification');
      setConfirmDialog({
        isOpen: true,
        title: 'Fase Bloqueada',
        message:
          'Esta fase está bloqueada! Complete todos os exercícios da fase anterior para liberá-la.',
        confirmText: 'Entendido',
        variant: 'info',
        onConfirm: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    const answeredCount = level.questions.filter((q) => hasAnsweredQuestion(q.id)).length;
    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    if (answeredCount > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Refazer do Zero?',
        message: `Você já respondeu ${answeredCount} de ${level.questions.length} questões desta fase e obteve ${completedCount} estrelas. Deseja refazer do zero para tentar obter todas as estrelas?`,
        confirmText: 'Refazer do Zero',
        cancelText: 'Continuar Progresso',
        variant: 'warning',
        onConfirm: async () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          await handleResetLevelAttempts(level);
        },
        onCancel: () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          openLevelAtSavedProgress(level);
        },
      });
      return;
    }

    openLevelFromStart(level);
  };

  const handleCloseQuizRequest = () => {
    if (currentStage !== 'summary' && !submittingAttempt) {
      setConfirmDialog({
        isOpen: true,
        title: 'Sair do Quiz',
        message: 'Quer realmente sair do quiz? Seu progresso nesta sessão será perdido.',
        confirmText: 'Sair',
        cancelText: 'Continuar',
        variant: 'danger',
        onConfirm: () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          setQuizModalOpen(false);
        },
        onCancel: () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setQuizModalOpen(false);
    }
  };

  const handleNextStageOrStep = () => {
    if (!activeLevel) return;

    if (currentStage === 'learn') {
      if (learnStep < 2) {
        setLearnStep((prev) => prev + 1);
      } else {
        setCurrentStage('practice');
        setPracticeStep(0);
        setCurrentQuestionIndex(0);
        loadQuestionState(activeLevel, 0);
      }
    } else if (currentStage === 'practice') {
      if (practiceStep < 1) {
        setPracticeStep((prev) => prev + 1);
        setCurrentQuestionIndex(1);
        loadQuestionState(activeLevel, 1);
      } else {
        setCurrentStage('challenge');
        setCurrentQuestionIndex(2);
        loadQuestionState(activeLevel, 2);
      }
    } else if (currentStage === 'challenge') {
      setCurrentStage('summary');
    }
  };

  const handlePrevStageOrStep = () => {
    if (!activeLevel) return;

    if (currentStage === 'learn') {
      if (learnStep > 0) {
        setLearnStep((prev) => prev - 1);
      }
    } else if (currentStage === 'practice') {
      if (practiceStep > 0) {
        setPracticeStep((prev) => prev - 1);
        setCurrentQuestionIndex(0);
        loadQuestionState(activeLevel, 0);
      } else {
        setCurrentStage('learn');
        setLearnStep(2);
        setSelectedOption(null);
        setAnswered(false);
      }
    } else if (currentStage === 'challenge') {
      setCurrentStage('practice');
      setPracticeStep(1);
      setCurrentQuestionIndex(1);
      loadQuestionState(activeLevel, 1);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (answered) return;
    setSelectedOption(optionIdx);
  };

  useEffect(() => {
    if (!activeLevel || !quizModalOpen) return;
    const question = activeLevel.questions[currentQuestionIndex];
    if (!question) return;

    if (Object.prototype.hasOwnProperty.call(attempts, question.id)) {
      setAnswered(true);
      setSelectedOption(
        attemptSelections[question.id] ?? (attempts[question.id] ? question.correctIndex : null)
      );
    } else {
      setAnswered(false);
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, activeLevel, quizModalOpen, attempts, attemptSelections]);

  const handleCheckAnswer = async () => {
    if (selectedOption === null || answered || !activeLevel) return;
    const question = activeLevel.questions[currentQuestionIndex];
    if (hasAnsweredQuestion(question.id)) return;

    setAnswered(true);
    setSubmittingAttempt(true);

    const isCorrect = selectedOption === question.correctIndex;

    if (isCorrect) {
      playSound('quiz_correct');
    } else {
      playSound('quiz_incorrect');
    }

    try {
      const res = await fetch(`/api/quiz/${question.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_index: selectedOption }),
      });

      if (res.ok) {
        const data = await res.json();
        const answerIsCorrect = Boolean(data.is_correct);

        // Atualizar tentativas localmente
        setAttempts((prev) => ({
          ...prev,
          [question.id]: answerIsCorrect,
        }));
        setAttemptSelections((prev) => ({
          ...prev,
          [question.id]: data.attempt?.selected_index ?? selectedOption,
        }));

        // Se ganhou XP
        if (data.xpResult) {
          setCorrectCount((prev) => prev + 1);
          setXpEarned((prev) => prev + (data.xpResult.xpEarned ?? 15));
          setUserXp(data.xpResult.newTotalXp);

          // Atualizar trilhas de linguagem localmente (inserindo se não existir)
          setTrails((prev) => {
            const exists = prev.some((t) => t.language === activeLang);
            if (exists) {
              return prev.map((t) => {
                if (t.language === activeLang) {
                  return {
                    ...t,
                    xp: data.xpResult.newLanguageXp,
                    level: data.xpResult.newLanguageLevel,
                  };
                }
                return t;
              });
            } else {
              return [
                ...prev,
                {
                  language: activeLang,
                  xp: data.xpResult.newLanguageXp,
                  level: data.xpResult.newLanguageLevel,
                },
              ];
            }
          });

          // Verificar se subiu de nível geral do usuário
          const oldLevel = getLevelFromXp(userXp);
          const newLevel = getLevelFromXp(data.xpResult.newTotalXp);
          if (newLevel > oldLevel) {
            setNewLevelNumber(newLevel);
            setUnlockedTitle(getLevelTitle(newLevel));
            setLevelUpVisible(true);
            playSound('levelup');
          }
        }
      } else {
        const data = await res.json();
        // Se já respondeu antes, não impede o avanço no wizard
        if (data.error !== 'Você já respondeu a este quiz') {
          setQuizError(data.error || 'Erro ao registrar resposta.');
        }
      }
    } catch (err) {
      console.error('Error checking answer:', err);
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 10) return 'Arquiteto Lendário';
    if (lvl >= 8) return 'Engenheiro Principal';
    if (lvl >= 6) return 'Desenvolvedor Sênior';
    if (lvl >= 4) return 'Desenvolvedor Pleno';
    if (lvl >= 2) return 'Desenvolvedor Júnior';
    return 'Estagiário de Código';
  };

  const getOffsetStyle = (index: number) => {
    // Padrão sinuoso: zigue-zague vertical
    const values = [0, 50, 95, 50, 0, -50, -95, -50];
    const val = values[index % values.length];
    return { transform: `translateX(${val}px)` };
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen bg-dd-bg pb-24 md:pb-8 flex flex-col">
          {/* Header (Twitter style: Sticky + Title + Subtitle) */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-dd-text text-base font-black tracking-tight flex items-center gap-2">
                Trilhas de Aprendizado
              </h1>
              <p className="text-dd-muted text-[10px] uppercase font-bold tracking-wider mt-0.5">
                Complete as lições e domine as linguagens de programação
              </p>
            </div>
          </div>

          <div className="p-4 space-y-6 flex flex-col flex-grow">
            {/* Seletor de Linguagens */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['JS', 'TS', 'PYTHON', 'RUST', 'GO', 'JAVA'].map((lang) => {
                const langCode = lang === 'PYTHON' ? 'PYTHON' : lang;
                const isSelected = activeLang === (lang === 'PYTHON' ? 'PYTHON' : lang);
                const label = getLanguageFullName(lang);

                return (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang === 'PYTHON' ? 'PYTHON' : lang)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-dd-accent border-orange-500 text-white shadow-md shadow-orange-500/10'
                        : 'bg-dd-surface border-dd-border text-dd-muted hover:text-dd-text hover:bg-dd-border/40'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Progress Indicator da Trilha Ativa */}
            <div className="bg-dd-surface border border-dd-border rounded-xl p-6 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xl">
                  {activeLang.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-dd-text">
                    Trilha de {getLanguageFullName(activeLang)}
                  </h3>
                  <p className="text-xs text-dd-muted uppercase tracking-wider font-bold mt-0.5">
                    Nível {activeTrail.level} • {activeTrail.xp.toLocaleString('pt-BR')} XP
                  </p>
                </div>
              </div>

              {/* XP progress bar */}
              <div className="flex-1 w-full max-w-lg">
                <div className="flex justify-between text-[10.5px] font-bold text-dd-muted mb-1.5 uppercase">
                  <span>Progresso do Nível</span>
                  <span>{activeTrail.xp % 500} / 500 XP</span>
                </div>
                <div className="h-2.5 w-full bg-dd-border/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${((activeTrail.xp % 500) / 500) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Header Card (Active Unit Banner) */}
            {activeUnitLevel && (
              <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-dd-border rounded-2xl p-7 shadow-md flex flex-col items-center text-center space-y-3">
                <span className="px-3 py-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm whitespace-nowrap">
                  Unidade Atual
                </span>
                <div className="space-y-1.5">
                  <h2 className="text-dd-text text-base md:text-lg lg:text-xl font-black uppercase tracking-tight">
                    Unidade {activeUnitNumber}: {activeUnitLevel.unitTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-dd-muted font-medium max-w-xl">
                    Domine esta unidade completando os exercícios e checkpoints abaixo para expandir
                    seu conhecimento em {getLanguageFullName(activeLang)}.
                  </p>
                </div>
              </div>
            )}

            {/* Winding Trail Path */}
            <div className="relative flex flex-col items-center py-14 bg-dd-surface/5 border border-dd-border/50 border-dashed rounded-2xl overflow-hidden min-h-[550px]">
              <div className="space-y-5 w-full max-w-sm flex flex-col items-center">
                {(() => {
                  const levels = TRAILS_DATA[activeLang] || [];
                  const elements: React.ReactNode[] = [];
                  let pathNodeIndex = 0;

                  // Group levels by unitNumber
                  const unitsMap = new Map<number, TrailLevel[]>();
                  levels.forEach((level) => {
                    if (!unitsMap.has(level.unitNumber)) {
                      unitsMap.set(level.unitNumber, []);
                    }
                    unitsMap.get(level.unitNumber)!.push(level);
                  });

                  // Iterate over each unit
                  unitsMap.forEach((unitLevels, unitNumber) => {
                    // Render unit header separator
                    const firstLevelOfUnit = unitLevels[0];
                    elements.push(
                      <div
                        key={`unit-sep-${unitNumber}`}
                        className="w-full flex items-center justify-center my-10 max-w-sm px-4"
                      >
                        <div className="flex-grow border-t border-dd-border/60"></div>
                        <span className="px-4.5 py-2 bg-dd-surface border border-dd-border text-dd-text text-[10px] font-extrabold uppercase tracking-wider rounded-full mx-3 text-center shadow-sm whitespace-nowrap">
                          Unidade {unitNumber}:{' '}
                          {firstLevelOfUnit?.unitTitle || `Unidade ${unitNumber}`}
                        </span>
                        <div className="flex-grow border-t border-dd-border/60"></div>
                      </div>
                    );

                    // Render all levels of this unit
                    unitLevels.forEach((level) => {
                      const globalIdx = levels.findIndex(
                        (l) => l.levelNumber === level.levelNumber
                      );
                      const unlocked = isLevelUnlocked(globalIdx);
                      const completedCount = level.questions.filter(
                        (q) => attempts[q.id] === true
                      ).length;
                      const isCompleted = completedCount === level.questions.length;
                      const offsetIdx = pathNodeIndex++;

                      elements.push(
                        <div
                          key={`level-${level.levelNumber}`}
                          className="w-full flex flex-col items-center"
                        >
                          <div
                            className="relative z-10 flex flex-col items-center my-7 transition-transform"
                            style={getOffsetStyle(offsetIdx)}
                          >
                            {/* Estrelas orgânicas/curvadas */}
                            <div className="flex gap-1.5 justify-center mb-2.5 items-end h-6.5">
                              {Array.from({ length: level.questions.length }).map((_, starIdx) => {
                                const isStarEarned =
                                  attempts[level.questions[starIdx]?.id] === true;
                                const isMiddle = starIdx === 1;
                                const starClass = isMiddle
                                  ? 'w-5.5 h-5.5 -translate-y-0.5 scale-110'
                                  : 'w-5 h-5 translate-y-0.5 ' +
                                    (starIdx === 0 ? 'rotate-[-12deg]' : 'rotate-[12deg]');

                                return (
                                  <Star
                                    key={starIdx}
                                    className={`transition-all ${starClass} ${
                                      isStarEarned
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-dd-border/70'
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            {/* Botão 3D da fase (Rounded-Square) */}
                            <button
                              onClick={() => handleLevelClick(level, unlocked)}
                              className={`w-20 h-20 rounded-[22px] flex items-center justify-center transition-all transform cursor-pointer ${
                                unlocked
                                  ? isCompleted
                                    ? 'bg-orange-500 text-white border-x-2 border-t-2 border-b-[7px] border-orange-600 hover:bg-orange-400 active:border-b-0 active:translate-y-[7px]'
                                    : 'bg-dd-surface text-orange-500 border-x-2 border-t-2 border-b-[7px] border-orange-500 hover:bg-dd-border/30 active:border-b-0 active:translate-y-[7px]'
                                  : 'bg-dd-surface/40 text-dd-muted/30 border-x-2 border-t-2 border-b-[7px] border-dd-border/40 cursor-not-allowed'
                              }`}
                            >
                              {unlocked ? (
                                <BookOpen className="w-8 h-8" />
                              ) : (
                                <Lock className="w-7 h-7" />
                              )}
                            </button>

                            {/* Título da fase */}
                            <div className="mt-3 text-center max-w-[170px]">
                              <p className="text-xs font-black uppercase text-dd-text leading-tight">
                                Fase {level.levelNumber}
                              </p>
                              <p className="text-[10.5px] text-dd-muted font-bold leading-tight mt-1 truncate">
                                {level.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    });

                    // Render unit Checkpoint at the end of the unit levels
                    const checkpointId = `${activeLang.toLowerCase()}-u${unitNumber}-checkpoint`;
                    const isCheckpointCompleted = attempts[checkpointId] === true;

                    const lastLevelOfUnit = unitLevels[unitLevels.length - 1];
                    const lastLevelCompleted =
                      lastLevelOfUnit &&
                      lastLevelOfUnit.questions.every((q) => attempts[q.id] === true);
                    const checkpointUnlocked = lastLevelCompleted;
                    const checkpointOffsetIdx = pathNodeIndex++;

                    elements.push(
                      <div
                        key={`checkpoint-${unitNumber}`}
                        className="w-full flex flex-col items-center"
                      >
                        {/* Linha pontilhada conectando à bandeira */}
                        <div className="w-full flex items-center justify-center my-6 max-w-sm px-4">
                          <div className="flex-grow border-t-2 border-dashed border-dd-border/50"></div>
                          <span className="px-4 py-1.5 bg-dd-accent/15 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase tracking-wider rounded-full mx-3 text-center shadow-sm whitespace-nowrap">
                            Revisão Final & Checkpoint {unitNumber}
                          </span>
                          <div className="flex-grow border-t-2 border-dashed border-dd-border/50"></div>
                        </div>

                        <div
                          className="relative z-10 flex flex-col items-center my-6 transition-transform"
                          style={getOffsetStyle(checkpointOffsetIdx)}
                        >
                          {/* Três estrelas douradas se concluído, cinzas caso contrário */}
                          <div className="flex gap-1.5 justify-center mb-2.5 items-end h-6.5">
                            {Array.from({ length: 3 }).map((_, starIdx) => {
                              const isMiddle = starIdx === 1;
                              const starClass = isMiddle
                                ? 'w-5.5 h-5.5 -translate-y-0.5 scale-110'
                                : 'w-5.5 h-5.5 translate-y-0.5 ' +
                                  (starIdx === 0 ? 'rotate-[-12deg]' : 'rotate-[12deg]');

                              return (
                                <Star
                                  key={starIdx}
                                  className={`transition-all ${starClass} ${
                                    isCheckpointCompleted
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-dd-border/70'
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {/* Botão 3D da bandeira (Checkpoint) */}
                          <button
                            onClick={() => handleCheckpointClick(unitNumber)}
                            className={`w-20 h-20 rounded-[22px] flex items-center justify-center transition-all transform cursor-pointer relative ${
                              checkpointUnlocked
                                ? isCheckpointCompleted
                                  ? 'bg-dd-accent text-white border-x-2 border-t-2 border-b-[7px] border-orange-600 hover:bg-orange-500 active:border-b-0 active:translate-y-[7px]'
                                  : 'bg-dd-surface text-orange-500 border-x-2 border-t-2 border-b-[7px] border-orange-500 hover:bg-dd-border/30 active:border-b-0 active:translate-y-[7px]'
                                : 'bg-dd-surface/40 text-dd-muted/30 border-x-2 border-t-2 border-b-[7px] border-dd-border/30 cursor-not-allowed'
                            }`}
                          >
                            <Flag
                              className={`w-8 h-8 ${checkpointUnlocked && !isCheckpointCompleted ? 'animate-pulse' : ''}`}
                            />
                            {!checkpointUnlocked && (
                              <div className="absolute -top-1 -right-1 bg-dd-surface border border-dd-border p-1 rounded-full text-dd-muted shadow-sm">
                                <Lock className="w-3.5 h-3.5 text-dd-muted" />
                              </div>
                            )}
                          </button>

                          {/* Título do Checkpoint */}
                          <div className="mt-3 text-center max-w-[170px]">
                            <p className="text-xs font-black uppercase text-dd-text leading-tight">
                              Checkpoint
                            </p>
                            <p className="text-[10.5px] text-dd-muted font-bold leading-tight mt-1 truncate">
                              Unidade {unitNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  });

                  return elements;
                })()}
              </div>
            </div>

            {/* Floating Recommended Level Bar */}
            <AnimatePresence>
              {recommendedCheckpoint && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="sticky bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
                >
                  <div className="pointer-events-auto bg-dd-surface/90 backdrop-blur-md border border-orange-500/30 rounded-2xl px-6 py-5 shadow-xl max-w-lg w-full flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">
                        Próxima Atividade Recomendada
                      </p>
                      <h4 className="text-sm font-black text-dd-text truncate mt-0.5">
                        {recommendedCheckpoint.data?.title ||
                          `Checkpoint da Unidade ${recommendedCheckpoint.unitNumber}`}
                      </h4>
                      <p className="text-xs text-dd-muted truncate mt-0.5">
                        {recommendedCheckpoint.data?.description ||
                          'Revisão e desafio prático de código.'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCheckpointClick(recommendedCheckpoint.unitNumber)}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      Começar
                    </button>
                  </div>
                </motion.div>
              )}

              {!recommendedCheckpoint && recommendedLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="sticky bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
                >
                  <div className="pointer-events-auto bg-dd-surface/90 backdrop-blur-md border border-orange-500/30 rounded-2xl px-6 py-5 shadow-xl max-w-lg w-full flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">
                        Próxima Atividade Recomendada
                      </p>
                      <h4 className="text-sm font-black text-dd-text truncate mt-0.5">
                        Fase {recommendedLevel.levelNumber}: {recommendedLevel.title}
                      </h4>
                      <p className="text-xs text-dd-muted truncate mt-0.5">
                        {recommendedLevel.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLevelClick(recommendedLevel, true)}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      Começar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Footer />
        </main>

        {/* Right Sidebar: Duelos, Ducky Chat, Leaderboard */}
        <aside className="hidden lg:flex w-80 shrink-0 flex-col gap-4 p-4 sticky top-0 h-screen overflow-y-auto">
          {/* Widget 1: Duelos de Código */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-orange-500">
              <Swords className="w-5 h-5" />
              <h3 className="text-sm font-black text-dd-text">Duelos de Código</h3>
            </div>
            <p className="text-xs text-dd-muted leading-relaxed font-semibold">
              Desafie outros desenvolvedores em batalhas em tempo real e teste suas habilidades sob
              pressão!
            </p>
            <Link
              href="/duels"
              className="flex items-center justify-center w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 active:scale-95"
            >
              Buscar Duelo
            </Link>
          </div>

          {/* Widget 2: Ducky IA Chat Panel */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4 flex flex-col h-[340px]">
            <div className="flex items-center gap-2 pb-2 border-b border-dd-border/50 shrink-0">
              <img src="/Logo_ia_ducky.png" alt="Ducky" className="w-5 h-5 object-contain" />
              <h3 className="text-sm font-black text-dd-text">Ducky IA Tutor</h3>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow overflow-y-auto py-3 space-y-4 scrollbar-ducky select-text min-h-0">
              {duckyMessages.map((msg, idx) => {
                const isDucky = msg.role !== 'user';
                return (
                  <div
                    key={idx}
                    className="flex gap-2.5 items-start w-full border-b border-dd-border/5 pb-3 last:border-b-0 last:pb-0"
                  >
                    {/* Avatar */}
                    <div className="w-6.5 h-6.5 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#0c0c0e] border border-dd-border/40 select-none">
                      {isDucky ? (
                        <img
                          src="/Logo_ia_ducky.png"
                          alt="Ducky"
                          className="w-5.5 h-5.5 object-contain"
                        />
                      ) : user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-6.5 h-6.5 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] font-bold text-dd-muted">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Message body */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 select-none">
                        <span className="text-[10px] font-bold text-dd-text">
                          {isDucky ? 'Ducky AI' : user.username}
                        </span>
                        <span className="text-[8px] text-dd-muted font-medium">
                          {isDucky ? '@ducky' : `@${user.username.toLowerCase()}`}
                        </span>
                      </div>

                      <div className="text-[10px] text-dd-text leading-relaxed font-sans pr-2">
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {duckyLoading && (
                <div className="flex gap-2.5 items-start w-full">
                  <div className="w-6.5 h-6.5 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#0c0c0e] border border-dd-border/40 select-none">
                    <img
                      src="/Logo_ia_ducky.png"
                      alt="Ducky"
                      className="w-5.5 h-5.5 object-contain"
                    />
                  </div>
                  <div className="flex gap-1 mt-2.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSendDuckyMessage}
              className="pt-2 border-t border-dd-border/50 flex gap-1.5 shrink-0"
            >
              <input
                type="text"
                value={duckyInput}
                onChange={(e) => setDuckyInput(e.target.value)}
                placeholder="Perguntar ao patinho..."
                disabled={duckyLoading}
                className="flex-grow rounded-lg border border-dd-border bg-dd-bg px-2.5 py-1.5 text-[10.5px] text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={duckyLoading || !duckyInput.trim()}
                className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0 animate-in fade-in duration-100"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Widget 3: Classificação Geral (Leaderboard Top 3) */}
          <div className="bg-dd-sidebar-bg border border-dd-border rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center gap-2 text-orange-500">
              <Trophy className="w-5 h-5" />
              <h3 className="text-sm font-black text-dd-text">Classificação Geral</h3>
            </div>

            <div className="space-y-3">
              {topUsersLoading ? (
                <div className="flex items-center gap-2 justify-center py-4 text-xs text-dd-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Carregando ranking...</span>
                </div>
              ) : topUsers.length === 0 ? (
                <p className="text-xs text-dd-muted text-center py-2">Nenhum competidor ainda.</p>
              ) : (
                topUsers.map((u) => (
                  <div key={u.username} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`font-mono font-black ${
                          u.rank === 1
                            ? 'text-yellow-500'
                            : u.rank === 2
                              ? 'text-slate-400'
                              : 'text-amber-600'
                        }`}
                      >
                        {u.rank}º
                      </span>
                      <div className="w-6 h-6 rounded-full bg-dd-border flex items-center justify-center text-[10px] font-black shrink-0 text-orange-500 uppercase overflow-hidden border border-dd-border/50">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={u.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.username[0]
                        )}
                      </div>
                      <span className="font-bold text-dd-text truncate">@{u.username}</span>
                    </div>
                    <span className="font-mono font-black text-orange-400 shrink-0 text-[11px]">
                      {u.xp} XP
                    </span>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/leaderboard"
              className="block text-center text-[10.5px] font-bold text-orange-400 hover:text-orange-300 transition-colors pt-1 border-t border-dd-border/50"
            >
              Ver classificação completa →
            </Link>
          </div>
        </aside>
      </div>

      {/* QUIZ WIZARD MODAL */}
      <AnimatePresence>
        {quizModalOpen && activeLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-[8px]"
              onClick={handleCloseQuizRequest}
            />

            <motion.div
              variants={reduced ? fadeVariants : modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative w-full ${aiChatOpen ? 'max-w-4xl' : 'max-w-lg'} bg-dd-surface border border-dd-border rounded-2xl shadow-2xl z-10 font-sans flex flex-col h-[90vh] overflow-hidden transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored Modal Header */}
              <div className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white p-5 pb-8 relative flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={handleCloseQuizRequest}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-none"
                    aria-label="Fechar quiz"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>

                  <h2 className="text-xs font-black uppercase tracking-wider text-center flex-grow text-white">
                    {(() => {
                      if (currentStage === 'learn') {
                        return `Etapa 1: Aprender ${learnStep + 1} de 3`;
                      }
                      if (currentStage === 'practice') {
                        return `Etapa 2: Prática ${practiceStep + 1} de 2`;
                      }
                      if (currentStage === 'challenge') {
                        return `Etapa 3: Desafio Final`;
                      }
                      return `Fase Concluída!`;
                    })()}
                  </h2>

                  <button
                    onClick={() => setAiChatOpen(!aiChatOpen)}
                    className={`h-7 px-2.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer border-none shadow-sm ${
                      aiChatOpen
                        ? 'bg-white text-orange-600 hover:bg-white/95 font-black'
                        : 'bg-white/15 text-white hover:bg-white/25 animate-pulse'
                    }`}
                  >
                    <img
                      src="/Logo_ia_ducky.png"
                      alt="Ducky"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span>Ducky {aiChatOpen ? 'Aberto' : 'IA'}</span>
                  </button>
                </div>

                {/* Segmented Progress Pills */}
                <div className="flex gap-2 w-full mt-1">
                  {[0, 1, 2].map((segIdx) => {
                    let fillPercent = 0;
                    if (currentStage === 'learn') {
                      if (segIdx === 0) {
                        fillPercent = ((learnStep + 1) / 3) * 100;
                      }
                    } else if (currentStage === 'practice') {
                      if (segIdx === 0) fillPercent = 100;
                      if (segIdx === 1) {
                        fillPercent = (practiceStep / 2) * 100;
                        if (answered && practiceStep === 0) fillPercent = 50;
                        if (answered && practiceStep === 1) fillPercent = 100;
                      }
                    } else if (currentStage === 'challenge') {
                      if (segIdx === 0 || segIdx === 1) fillPercent = 100;
                      if (segIdx === 2) {
                        fillPercent = answered ? 100 : 0;
                      }
                    } else if (currentStage === 'summary') {
                      fillPercent = 100;
                    }

                    return (
                      <div
                        key={segIdx}
                        className="h-1.5 flex-grow bg-white/25 rounded-full overflow-hidden relative"
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Split Content Pane */}
              <div className="flex flex-col md:flex-row flex-grow overflow-hidden relative min-h-0">
                {/* Left Column: Study content */}
                <div
                  className={`flex flex-col flex-grow overflow-hidden min-h-0 ${aiChatOpen ? 'border-b md:border-b-0 md:border-r border-dd-border' : 'w-full'}`}
                >
                  {/* Overlapping Content Container */}
                  <div className="relative -mt-4 rounded-t-2xl bg-dd-surface p-6 flex-grow flex flex-col overflow-y-auto min-h-[350px]">
                    {currentStage === 'learn' &&
                      (() => {
                        const slides = getLearnSlidesForLevel(activeLevel);
                        const slide = slides[learnStep];
                        return (
                          <div className="space-y-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-sm">
                                <Lightbulb className="w-4 h-4" />
                              </div>
                              <h3 className="text-sm font-extrabold text-dd-text">{slide.title}</h3>
                            </div>

                            <p className="text-xs text-dd-text leading-relaxed font-medium">
                              {slide.concept}
                            </p>

                            {slide.code && (
                              <div className="relative bg-black/40 rounded-xl p-4 border border-dd-border font-mono text-[10px] text-orange-200 overflow-x-auto whitespace-pre leading-relaxed font-semibold">
                                {slide.code}
                              </div>
                            )}

                            {slide.tip && (
                              <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 flex items-start gap-2.5">
                                <Lightbulb className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                                    Dica Pro
                                  </h4>
                                  <p className="text-[10px] text-dd-muted leading-relaxed">
                                    {slide.tip}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    {(currentStage === 'practice' || currentStage === 'challenge') &&
                      (() => {
                        const question = activeLevel.questions[currentQuestionIndex];
                        return (
                          <div className="space-y-6 py-2">
                            {currentStage === 'challenge' && (
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-[9px] font-black text-orange-500 uppercase tracking-wider">
                                  Desafio Final
                                </span>
                              </div>
                            )}

                            <h3 className="text-sm font-bold text-dd-text leading-relaxed">
                              {question.question}
                            </h3>

                            <div className="space-y-2.5">
                              {question.options.map((opt, oIdx) => {
                                const isSelected = selectedOption === oIdx;
                                const isCorrectAnswer = oIdx === question.correctIndex;

                                let btnClasses =
                                  'border border-dd-border bg-dd-surface text-dd-text hover:bg-dd-border/20';

                                if (answered) {
                                  if (isCorrectAnswer) {
                                    btnClasses =
                                      'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                                  } else if (isSelected) {
                                    btnClasses = 'border-red-500 bg-red-500/10 text-red-400';
                                  } else {
                                    btnClasses =
                                      'border-dd-border opacity-50 bg-dd-surface text-dd-muted';
                                  }
                                } else if (isSelected) {
                                  btnClasses = 'border-orange-500 bg-orange-500/5 text-orange-400';
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleOptionSelect(oIdx)}
                                    disabled={answered}
                                    className={`w-full text-left p-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${btnClasses}`}
                                  >
                                    <span>{opt}</span>
                                    {answered && isCorrectAnswer && (
                                      <Check className="w-4 h-4 text-emerald-400" />
                                    )}
                                    {answered && isSelected && !isCorrectAnswer && (
                                      <X className="w-4 h-4 text-red-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizError && (
                              <p className="text-[10px] text-red-400 font-bold bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                                {quizError}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                    {currentStage === 'summary' && (
                      <div className="text-center py-6 space-y-6">
                        <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto animate-bounce">
                          <Trophy className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-dd-text uppercase">
                            Fase Concluída!
                          </h3>
                          <p className="text-xs text-dd-muted max-w-xs mx-auto">
                            Você concluiu a Fase {activeLevel.levelNumber} de{' '}
                            {getLanguageFullName(activeLang)}!
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                          <div className="bg-dd-surface border border-dd-border p-4 rounded-xl text-center">
                            <p className="text-[9px] font-bold text-dd-muted uppercase">Acertos</p>
                            <p className="text-lg font-black text-dd-text mt-1">
                              {correctCount} / 3
                            </p>
                          </div>
                          <div className="bg-dd-surface border border-dd-border p-4 rounded-xl text-center">
                            <p className="text-[9px] font-bold text-dd-muted uppercase">XP Ganho</p>
                            <p className="text-lg font-black text-orange-400 mt-1 font-mono">
                              +{xpEarned} XP
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="shrink-0 p-4 border-t border-dd-border flex justify-between items-center bg-dd-surface">
                    {currentStage !== 'summary' ? (
                      <>
                        <button
                          onClick={handlePrevStageOrStep}
                          disabled={currentStage === 'learn' && learnStep === 0}
                          className="px-6 py-2.5 bg-transparent border border-dd-border hover:bg-dd-border/20 text-dd-text rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>

                        {(() => {
                          if (currentStage === 'learn') {
                            return (
                              <button
                                onClick={handleNextStageOrStep}
                                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                Próximo
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            );
                          }

                          const question = activeLevel.questions[currentQuestionIndex];

                          if (!answered) {
                            return (
                              <button
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null || submittingAttempt}
                                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-dd-surface disabled:border disabled:border-dd-border disabled:text-dd-muted text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                {submittingAttempt ? 'Verificando...' : 'Confirmar'}
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            );
                          }

                          const isCorrect = selectedOption === question.correctIndex;

                          if (!isCorrect) {
                            return (
                              <button
                                onClick={handleNextStageOrStep}
                                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                {currentStage === 'challenge' ? 'Ver Resultado' : 'Avançar'}
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            );
                          }

                          if (currentStage === 'practice') {
                            return (
                              <button
                                onClick={handleNextStageOrStep}
                                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                              >
                                Avançar
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            );
                          }

                          return (
                            <button
                              onClick={handleNextStageOrStep}
                              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                            >
                              Ver Resultado
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          );
                        })()}
                      </>
                    ) : (
                      <button
                        onClick={() => setQuizModalOpen(false)}
                        className="w-full py-2.5 bg-dd-surface border border-dd-border hover:bg-dd-border/30 text-dd-text rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Voltar para a Trilha
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: AI Chat Panel */}
                {aiChatOpen && (
                  <div className="w-full md:w-[320px] shrink-0 flex flex-col bg-dd-surface/50 flex-grow md:flex-grow-0 md:h-full overflow-hidden relative border-t border-dd-border md:border-t-0 select-text min-h-0">
                    {/* Header/Title of AI */}
                    <div className="shrink-0 p-4 border-b border-dd-border flex items-center justify-between bg-dd-surface/70">
                      <div className="flex items-center gap-2">
                        <img
                          src="/Logo_ia_ducky.png"
                          alt="Ducky"
                          className="w-4 h-4 object-contain"
                        />
                        <span className="text-xs font-bold text-dd-text">Ducky IA</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-[8px] font-bold text-orange-500 uppercase tracking-wide">
                        Online
                      </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-grow p-4 overflow-y-auto overflow-x-hidden space-y-3 scrollbar-ducky select-text">
                      {aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2.5 max-w-[85%] ${
                            msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${
                              msg.role === 'user'
                                ? 'bg-orange-500 text-white'
                                : 'bg-[#0c0c0e] border border-dd-border/40'
                            }`}
                          >
                            {msg.role === 'user' ? (
                              user.username[0].toUpperCase()
                            ) : (
                              <img
                                src="/Logo_ia_ducky.png"
                                alt="Ducky"
                                className="w-5.5 h-5.5 object-contain"
                              />
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-[11px] leading-relaxed select-text break-words ${
                              msg.role === 'user'
                                ? 'bg-orange-500 text-white rounded-tr-none font-semibold'
                                : 'bg-dd-border/40 text-dd-text rounded-tl-none border border-dd-border/30 font-medium'
                            }`}
                          >
                            {renderMessageContent(msg.content)}
                          </div>
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                          <div className="w-7 h-7 rounded-full bg-[#0c0c0e] border border-dd-border/40 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            <img
                              src="/Logo_ia_ducky.png"
                              alt="Ducky"
                              className="w-5.5 h-5.5 object-contain"
                            />
                          </div>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-300" />
                          </div>
                        </div>
                      )}
                      <div ref={aiChatEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="shrink-0 px-4 py-2 flex flex-wrap gap-1.5 border-t border-dd-border/50 bg-dd-surface/20">
                      {currentStage === 'learn' && (
                        <>
                          <button
                            onClick={() =>
                              handleSendAiMessage('Explicar este conceito de forma mais detalhada')
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Lightbulb className="w-3 h-3 text-orange-500/80" /> Explicar Conceito
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Me dê outro exemplo prático de código para fixar'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Code2 className="w-3 h-3 text-orange-500/80" /> Exemplo de Código
                          </button>
                        </>
                      )}
                      {(currentStage === 'practice' || currentStage === 'challenge') && (
                        <>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Por favor, me dê uma dica sutil sobre esta questão sem me dar a resposta direta'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Search className="w-3 h-3 text-orange-500/80" /> Dica Sutil
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage('Explique a teoria por trás desta pergunta')
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <BookText className="w-3 h-3 text-orange-500/80" /> Explicar Teoria
                          </button>
                        </>
                      )}
                    </div>

                    {/* Chat Input Field */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendAiMessage();
                      }}
                      className="shrink-0 p-3 border-t border-dd-border flex gap-2 items-center bg-dd-surface/80"
                    >
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Perguntar ao tutor..."
                        disabled={aiLoading}
                        className="flex-grow rounded-xl border border-dd-border bg-dd-surface px-3 py-2 text-xs text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={aiLoading || !aiInput.trim()}
                        className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKPOINT WIZARD MODAL */}
      <AnimatePresence>
        {checkpointModalOpen && activeCheckpointUnit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-[8px]"
              onClick={() => {
                if (checkpointStage !== 'summary' && !submittingAttempt) {
                  setConfirmDialog({
                    isOpen: true,
                    title: 'Sair do Checkpoint',
                    message:
                      'Quer realmente sair do checkpoint? Seu progresso nesta sessão de revisão será perdido.',
                    confirmText: 'Sair',
                    cancelText: 'Continuar',
                    variant: 'danger',
                    onConfirm: () => {
                      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                      setCheckpointModalOpen(false);
                    },
                    onCancel: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
                  });
                } else {
                  setCheckpointModalOpen(false);
                }
              }}
            />

            <motion.div
              variants={reduced ? fadeVariants : modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative w-full ${aiChatOpen ? 'max-w-4xl' : 'max-w-2xl'} bg-dd-surface border border-dd-border rounded-2xl shadow-2xl z-10 font-sans flex flex-col h-[90vh] overflow-hidden transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored Modal Header */}
              <div className="shrink-0 bg-gradient-to-r from-dd-accent to-orange-600 text-white p-5 pb-8 relative flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => {
                      if (checkpointStage !== 'summary' && !submittingAttempt) {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Sair do Checkpoint',
                          message:
                            'Quer realmente sair do checkpoint? Seu progresso nesta sessão de revisão será perdido.',
                          confirmText: 'Sair',
                          cancelText: 'Continuar',
                          variant: 'danger',
                          onConfirm: () => {
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                            setCheckpointModalOpen(false);
                          },
                          onCancel: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
                        });
                      } else {
                        setCheckpointModalOpen(false);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-none"
                    aria-label="Fechar checkpoint"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>

                  <h2 className="text-xs font-black uppercase tracking-wider text-center flex-grow text-white">
                    {(() => {
                      if (checkpointStage === 'review') {
                        return `Revisão da Unidade ${activeCheckpointUnit}: Parte ${checkpointReviewStep + 1} de 3`;
                      }
                      if (checkpointStage === 'exercise') {
                        return `Desafio Prático de Código`;
                      }
                      return `Unidade Concluída!`;
                    })()}
                  </h2>

                  <button
                    onClick={() => setAiChatOpen(!aiChatOpen)}
                    className={`h-7 px-2.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer border-none shadow-sm ${
                      aiChatOpen
                        ? 'bg-white text-orange-600 hover:bg-white/95 font-black'
                        : 'bg-white/15 text-white hover:bg-white/25 animate-pulse'
                    }`}
                  >
                    <img
                      src="/Logo_ia_ducky.png"
                      alt="Ducky"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span>Ducky {aiChatOpen ? 'Aberto' : 'IA'}</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 w-full mt-1">
                  {[0, 1, 2].map((segIdx) => {
                    let fillPercent = 0;
                    if (checkpointStage === 'review') {
                      if (segIdx === 0) {
                        fillPercent = ((checkpointReviewStep + 1) / 3) * 100;
                      }
                    } else if (checkpointStage === 'exercise') {
                      if (segIdx === 0) fillPercent = 100;
                      if (segIdx === 1) {
                        fillPercent = checkpointSuccess ? 100 : 50;
                      }
                    } else if (checkpointStage === 'summary') {
                      fillPercent = 100;
                    }

                    return (
                      <div
                        key={segIdx}
                        className="h-1.5 flex-grow bg-white/25 rounded-full overflow-hidden relative"
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Split Content Pane */}
              <div className="flex flex-col md:flex-row flex-grow overflow-hidden relative min-h-0">
                {/* Left Column: Checkpoint content */}
                <div
                  className={`flex flex-col flex-grow overflow-hidden min-h-0 ${aiChatOpen ? 'border-b md:border-b-0 md:border-r border-dd-border' : 'w-full'}`}
                >
                  {/* Overlapping Content Container */}
                  <div className="relative -mt-4 rounded-t-2xl bg-dd-surface p-6 flex-grow flex flex-col overflow-y-auto min-h-[420px]">
                    {checkpointStage === 'review' &&
                      (() => {
                        const slides = getCheckpointSlides();
                        const slide = slides[checkpointReviewStep];
                        if (!slide) return null;
                        return (
                          <div className="space-y-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-sm">
                                <Library className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                                  Revisando: {slide.levelTitle}
                                </p>
                                <h3 className="text-sm font-extrabold text-dd-text">
                                  {slide.title}
                                </h3>
                              </div>
                            </div>

                            <p className="text-xs text-dd-text leading-relaxed font-medium">
                              {slide.concept}
                            </p>

                            {slide.code && (
                              <div className="relative bg-black/40 rounded-xl p-4 border border-dd-border font-mono text-[10px] text-orange-200 overflow-x-auto whitespace-pre leading-relaxed font-semibold">
                                {slide.code}
                              </div>
                            )}

                            {slide.tip && (
                              <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 flex items-start gap-2.5">
                                <Lightbulb className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                                    Dica Pro
                                  </h4>
                                  <p className="text-[10px] text-dd-muted leading-relaxed">
                                    {slide.tip}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    {checkpointStage === 'exercise' &&
                      (() => {
                        const data = CHECKPOINTS_DATA[activeLang]?.[activeCheckpointUnit];
                        if (!data) return null;
                        return (
                          <div className="space-y-5 py-2 flex flex-col flex-grow min-h-0">
                            <div>
                              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-[9px] font-black text-orange-500 uppercase tracking-wider">
                                Desafio de Código da Unidade {activeCheckpointUnit}
                              </span>
                              <h3 className="text-base font-black text-dd-text mt-1">
                                {data.challenge.title}
                              </h3>
                            </div>

                            <p className="text-xs text-dd-text leading-relaxed font-semibold">
                              {data.challenge.description}
                            </p>

                            {/* Code Editor */}
                            <div className="border border-dd-border rounded-xl overflow-hidden bg-dd-bg">
                              <CodeEditor
                                value={checkpointCode}
                                onChange={(val) => setCheckpointCode(val)}
                                language={codemirrorLanguageId(activeLang)}
                                height="180px"
                              />
                            </div>

                            {/* Execution Console Area */}
                            <div className="flex-grow min-h-[100px] flex flex-col bg-black/35 rounded-xl border border-dd-border overflow-hidden">
                              <div className="border-b border-dd-border bg-dd-surface/80 px-3 py-1.5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-dd-muted uppercase tracking-wider">
                                  Console Output
                                </span>
                                {checkpointSuccess && (
                                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> Sucesso! Teste passou.
                                  </span>
                                )}
                              </div>
                              <div className="p-3 font-mono text-[11px] overflow-y-auto flex-grow max-h-[140px]">
                                {checkpointRunning ? (
                                  <div className="flex items-center gap-2 text-dd-muted">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Executando testes...</span>
                                  </div>
                                ) : checkpointError ? (
                                  <pre className="text-red-400 whitespace-pre-wrap leading-relaxed">
                                    {checkpointError}
                                  </pre>
                                ) : checkpointOutput ? (
                                  <pre className="text-dd-text whitespace-pre-wrap leading-relaxed">
                                    {checkpointOutput}
                                  </pre>
                                ) : (
                                  <span className="text-dd-muted italic">
                                    Escreva seu código e clique em executar para ver o resultado.
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    {checkpointStage === 'summary' && (
                      <div className="text-center py-8 space-y-6">
                        <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto animate-bounce shadow-lg shadow-orange-500/10">
                          <Trophy className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-dd-text uppercase">
                            Checkpoint Concluído!
                          </h3>
                          <p className="text-xs text-dd-muted max-w-sm mx-auto font-medium">
                            Parabéns! Você completou a revisão e o desafio prático de código da
                            Unidade {activeCheckpointUnit}!
                          </p>
                        </div>

                        <div className="bg-dd-surface border border-dd-border p-4 rounded-xl text-center max-w-xs mx-auto">
                          <p className="text-[10px] font-black text-dd-muted uppercase">XP Ganho</p>
                          <p className="text-2xl font-black text-orange-400 mt-1 font-mono">
                            +50 XP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="shrink-0 p-4 border-t border-dd-border flex justify-between items-center bg-dd-surface">
                    {checkpointStage !== 'summary' ? (
                      <>
                        <button
                          onClick={() => {
                            if (checkpointStage === 'review') {
                              if (checkpointReviewStep > 0) {
                                setCheckpointReviewStep((prev) => prev - 1);
                              }
                            } else if (checkpointStage === 'exercise') {
                              setCheckpointStage('review');
                              setCheckpointReviewStep(2);
                            }
                          }}
                          disabled={checkpointStage === 'review' && checkpointReviewStep === 0}
                          className="px-6 py-2.5 bg-transparent border border-dd-border hover:bg-dd-border/20 text-dd-text rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>

                        {checkpointStage === 'review' ? (
                          <button
                            onClick={() => {
                              if (checkpointReviewStep < 2) {
                                setCheckpointReviewStep((prev) => prev + 1);
                              } else {
                                setCheckpointStage('exercise');
                              }
                            }}
                            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            {checkpointReviewStep === 2 ? 'Ir para o Exercício' : 'Próximo'}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleRunCheckpointCode}
                              disabled={checkpointRunning || checkpointSuccess}
                              className="px-5 py-2.5 bg-dd-surface border border-orange-500/50 hover:bg-dd-border/30 text-orange-400 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {checkpointRunning ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                              Executar e Verificar
                            </button>

                            <button
                              onClick={handleCompleteCheckpoint}
                              disabled={!checkpointSuccess || submittingAttempt}
                              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed enabled:animate-pulse"
                            >
                              {submittingAttempt ? 'Gravando...' : 'Concluir Checkpoint'}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => setCheckpointModalOpen(false)}
                        className="w-full py-2.5 bg-dd-surface border border-dd-border hover:bg-dd-border/30 text-dd-text rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Voltar para a Trilha
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: AI Chat Panel */}
                {aiChatOpen && (
                  <div className="w-full md:w-[320px] shrink-0 flex flex-col bg-dd-surface/50 flex-grow md:flex-grow-0 md:h-full overflow-hidden relative border-t border-dd-border md:border-t-0 select-text min-h-0">
                    {/* Header/Title of AI */}
                    <div className="shrink-0 p-4 border-b border-dd-border flex items-center justify-between bg-dd-surface/70">
                      <div className="flex items-center gap-2">
                        <img
                          src="/Logo_ia_ducky.png"
                          alt="Ducky"
                          className="w-4 h-4 object-contain"
                        />
                        <span className="text-xs font-bold text-dd-text">Ducky IA</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-[8px] font-bold text-orange-500 uppercase tracking-wide">
                        Online
                      </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-grow p-4 overflow-y-auto overflow-x-hidden space-y-3 scrollbar-ducky select-text">
                      {aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2.5 max-w-[85%] ${
                            msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${
                              msg.role === 'user'
                                ? 'bg-orange-500 text-white'
                                : 'bg-[#0c0c0e] border border-dd-border/40'
                            }`}
                          >
                            {msg.role === 'user' ? (
                              user.username[0].toUpperCase()
                            ) : (
                              <img
                                src="/Logo_ia_ducky.png"
                                alt="Ducky"
                                className="w-5.5 h-5.5 object-contain"
                              />
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-[11px] leading-relaxed select-text break-words ${
                              msg.role === 'user'
                                ? 'bg-orange-500 text-white rounded-tr-none font-semibold'
                                : 'bg-dd-border/40 text-dd-text rounded-tl-none border border-dd-border/30 font-medium'
                            }`}
                          >
                            {renderMessageContent(msg.content)}
                          </div>
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                          <div className="w-7 h-7 rounded-full bg-[#0c0c0e] border border-dd-border/40 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            <img
                              src="/Logo_ia_ducky.png"
                              alt="Ducky"
                              className="w-5.5 h-5.5 object-contain"
                            />
                          </div>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-300" />
                          </div>
                        </div>
                      )}
                      <div ref={aiChatEndRef} />
                    </div>

                    {/* Quick Suggestion Chips for Checkpoints */}
                    <div className="shrink-0 px-4 py-2 flex flex-wrap gap-1.5 border-t border-dd-border/50 bg-dd-surface/20">
                      {checkpointStage === 'review' && (
                        <>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Por favor, explique com mais detalhes este conceito da revisão'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Lightbulb className="w-3 h-3 text-orange-500/80" /> Explicar Revisão
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Me dê um exemplo prático desse conceito em código'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Code2 className="w-3 h-3 text-orange-500/80" /> Exemplo de Código
                          </button>
                        </>
                      )}
                      {checkpointStage === 'exercise' && (
                        <>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Me dê uma dica lógica para resolver este desafio sem me passar código'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Search className="w-3 h-3 text-orange-500/80" /> Dica de Lógica
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Explique o que o meu código atual faz e onde posso ajustar'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            <Bug className="w-3 h-3 text-orange-500/80" /> Ajudar com o Bug
                          </button>
                        </>
                      )}
                    </div>

                    {/* Chat Input Field */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendAiMessage();
                      }}
                      className="shrink-0 p-3 border-t border-dd-border flex gap-2 items-center bg-dd-surface/80"
                    >
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Perguntar ao tutor..."
                        disabled={aiLoading}
                        className="flex-grow rounded-xl border border-dd-border bg-dd-surface px-3 py-2 text-xs text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={aiLoading || !aiInput.trim()}
                        className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEVEL UP OVERLAY */}
      <AnimatePresence>
        {levelUpVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setLevelUpVisible(false)}
            />

            {/* White screen flash */}
            <div className="dd-level-flash" />

            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-full max-w-sm bg-dd-surface border border-dd-border p-8 rounded-2xl shadow-2xl z-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-orange-500/10">
                ⭐
              </div>

              <div className="space-y-2">
                <p className="text-dd-accent font-extrabold uppercase text-xs tracking-widest">
                  Parabéns!
                </p>
                <h2 className="text-2xl font-black text-dd-text">Subiu de Nível!</h2>
                <p className="text-xs text-dd-muted">
                  Você agora atingiu o nível{' '}
                  <strong className="text-dd-text">{newLevelNumber}</strong> geral no DevDeck.
                </p>
              </div>

              <div className="bg-dd-border/20 border border-dd-border/50 py-3.5 px-5 rounded-xl">
                <span className="text-[10px] font-bold text-dd-muted uppercase block">
                  Título Conquistado
                </span>
                <span className="text-sm font-black text-orange-400 uppercase tracking-wide mt-1 block">
                  {unlockedTitle}
                </span>
              </div>

              <button
                onClick={() => setLevelUpVisible(false)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/15 transition-all cursor-pointer active:scale-95"
              >
                Continuar Jornada
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-[6px]"
              onClick={() => {
                if (confirmDialog.onCancel) {
                  confirmDialog.onCancel();
                } else {
                  confirmDialog.onConfirm();
                }
              }}
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative w-full max-w-sm bg-dd-surface border border-dd-border/80 rounded-2xl shadow-2xl p-6 z-10 text-center space-y-5"
            >
              {/* Icon based on variant */}
              <div className="flex justify-center">
                {confirmDialog.variant === 'danger' && (
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                {confirmDialog.variant === 'warning' && (
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-pulse">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                )}
                {confirmDialog.variant === 'info' && (
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Info className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-dd-text text-sm font-extrabold tracking-tight uppercase">
                  {confirmDialog.title}
                </h3>
                <p className="text-dd-muted text-[11.5px] leading-relaxed font-medium">
                  {confirmDialog.message}
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                {confirmDialog.onCancel && (
                  <button
                    type="button"
                    onClick={confirmDialog.onCancel}
                    className="flex-1 py-2.5 bg-dd-surface border border-dd-border hover:bg-dd-border/40 text-dd-text rounded-xl text-[10.5px] font-black transition-all cursor-pointer select-none active:scale-[0.98]"
                  >
                    {confirmDialog.cancelText || 'Cancelar'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-[10.5px] font-black transition-all cursor-pointer select-none active:scale-[0.98] ${
                    confirmDialog.variant === 'danger'
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/15'
                      : confirmDialog.variant === 'warning'
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/15'
                        : 'bg-dd-accent hover:bg-dd-accent/90 text-white shadow-md'
                  }`}
                >
                  {confirmDialog.confirmText || 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animações
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 450, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 12,
    transition: { duration: 0.15 },
  },
};
