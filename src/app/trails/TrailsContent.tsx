'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
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
}

export function TrailsContent({ user, initialTrails, initialAttempts }: TrailsContentProps) {
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
  const [trails, setTrails] = useState(initialTrails);
  const [userXp, setUserXp] = useState(user.total_xp);

  // Estados para as Seções e Unidades (Dropdown)
  const defaultSection = () => {
    const levels = TRAILS_DATA['JS'] || [];
    const firstIncompleteLevel = levels.find((level) => {
      const completedCount = level.questions.filter((q) => initialAttempts[q.id] === true).length;
      return completedCount < 3;
    });
    return firstIncompleteLevel ? firstIncompleteLevel.sectionName : levels[0]?.sectionName || '';
  };

  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  // Resetar a seção ativa quando a linguagem selecionada mudar
  useEffect(() => {
    if (!activeLang) return;
    const levels = TRAILS_DATA[activeLang] || [];
    const firstIncompleteLevel = levels.find((level) => {
      const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
      return completedCount < 3;
    });

    if (firstIncompleteLevel) {
      setActiveSection(firstIncompleteLevel.sectionName);
    } else if (levels.length > 0) {
      setActiveSection(levels[0].sectionName);
    }
  }, [activeLang]);

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
    if (!quizModalOpen) {
      setAiMessages([]);
      setAiChatOpen(false);
      return;
    }

    if (!activeLevel) return;

    let welcomeText = '';
    if (currentStage === 'learn') {
      const slides = getLearnSlidesForLevel(activeLevel);
      const slide = slides[learnStep];
      welcomeText = `Acompanhando você no conceito **"${slide?.title}"**. Como posso te ajudar a entender melhor?`;
    } else if (currentStage === 'practice' || currentStage === 'challenge') {
      welcomeText = `Exercício ativo. Se precisar de uma dica sutil sem a resposta direta, basta me pedir!`;
    } else {
      welcomeText = `Fase concluída! Quer tirar alguma dúvida final sobre o conteúdo estudado?`;
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
          content: `Olá! Sou o **DevAssistant**, seu tutor de IA para **${activeLang}**. ${welcomeText}`,
        },
      ];
    });
  }, [quizModalOpen, currentStage, learnStep, currentQuestionIndex, activeLevel, activeLang]);

  // Função para enviar mensagem para o Tutor de IA
  const handleSendAiMessage = async (customMessage?: string) => {
    const textToSend = customMessage || aiInput;
    if (!textToSend.trim() || aiLoading || !activeLevel) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...aiMessages, userMessage];

    setAiMessages(updatedMessages);
    if (!customMessage) setAiInput('');
    setAiLoading(true);

    try {
      let currentContext: any = {};
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

      const response = await fetch('/api/ai/trails/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeLang,
          levelTitle: activeLevel.title,
          stage: currentStage,
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

  // Seções disponíveis para a trilha atual
  const sections = Array.from(
    new Set(TRAILS_DATA[activeLang]?.map((level) => level.sectionName) || [])
  );

  // Fases da seção atual
  const sectionLevels =
    TRAILS_DATA[activeLang]?.filter((level) => level.sectionName === activeSection) || [];

  // Verificar se o nível está desbloqueado (Duolingo-like progression)
  const isLevelUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true;
    const prevLevel = TRAILS_DATA[activeLang][levelIndex - 1];
    return prevLevel.questions.every((q) => attempts[q.id] === true);
  };

  // Nível recomendado (primeira fase incompleta da linguagem atual que esteja desbloqueada)
  const recommendedLevel = TRAILS_DATA[activeLang]?.find((level, idx) => {
    const globalIdx = TRAILS_DATA[activeLang].findIndex((l) => l.levelNumber === level.levelNumber);
    const unlocked = isLevelUnlocked(globalIdx);
    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    return unlocked && completedCount < 3;
  });

  // Unidade ativa com base no nível recomendado (ou primeiro da seção se todos concluídos)
  const activeUnitLevel =
    sectionLevels.find((level) => {
      const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
      return completedCount < 3;
    }) || sectionLevels[0];

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

        setActiveLevel(level);
        setCurrentStage('learn');
        setLearnStep(0);
        setPracticeStep(0);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setAnswered(false);
        setCorrectCount(0);
        setXpEarned(0);
        setQuizModalOpen(true);
        setQuizError(null);
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

    const completedCount = level.questions.filter((q) => attempts[q.id] === true).length;
    if (completedCount > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Refazer do Zero?',
        message: `Você já respondeu a esta fase anteriormente e obteve ${completedCount} de 3 estrelas. Deseja refazer do zero para tentar obter as 3 estrelas?`,
        confirmText: 'Refazer do Zero',
        cancelText: 'Continuar Progresso',
        variant: 'warning',
        onConfirm: async () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          await handleResetLevelAttempts(level);
        },
        onCancel: () => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          setActiveLevel(level);
          setCurrentStage('learn');
          setLearnStep(0);
          setPracticeStep(0);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setAnswered(false);
          setCorrectCount(0);
          setXpEarned(0);
          setQuizModalOpen(true);
          setQuizError(null);
        },
      });
      return;
    }

    setActiveLevel(level);
    setCurrentStage('learn');
    setLearnStep(0);
    setPracticeStep(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setCorrectCount(0);
    setXpEarned(0);
    setQuizModalOpen(true);
    setQuizError(null);
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
        setSelectedOption(null);
        setAnswered(false);
      }
    } else if (currentStage === 'practice') {
      if (practiceStep < 1) {
        setPracticeStep((prev) => prev + 1);
        setCurrentQuestionIndex(1);
        setSelectedOption(null);
        setAnswered(false);
      } else {
        setCurrentStage('challenge');
        setCurrentQuestionIndex(2);
        setSelectedOption(null);
        setAnswered(false);
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
        setSelectedOption(null);
        setAnswered(false);
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
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (answered) return;
    setSelectedOption(optionIdx);
  };

  const handleRetryQuestion = () => {
    setAnswered(false);
    setSelectedOption(null);
    setQuizError(null);
  };

  useEffect(() => {
    if (!activeLevel || !quizModalOpen) return;
    const question = activeLevel.questions[currentQuestionIndex];
    if (!question) return;

    if (attempts[question.id] === true) {
      setAnswered(true);
      setSelectedOption(question.correctIndex);
    } else {
      setAnswered(false);
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, activeLevel, quizModalOpen, attempts]);

  const handleCheckAnswer = async () => {
    if (selectedOption === null || answered || !activeLevel) return;
    const question = activeLevel.questions[currentQuestionIndex];
    if (attempts[question.id] === true) return;

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

        // Atualizar tentativas localmente
        setAttempts((prev) => ({
          ...prev,
          [question.id]: isCorrect,
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
    // Padrão Duolingo: zigue-zague vertical
    const values = [0, 50, 95, 50, 0, -50, -95, -50];
    const val = values[index % values.length];
    return { transform: `translateX(${val}px)` };
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 pb-36 md:pb-48 flex flex-col min-w-0 space-y-8">
          {/* Header & Title */}
          <div className="flex items-center justify-between border-b border-dd-border pb-4">
            <div>
              <h1 className="text-dd-text text-xl font-extrabold tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Trilhas de Aprendizado
              </h1>
              <p className="text-dd-muted text-xs">
                Complete as lições no formato Duolingo e domine as linguagens de programação.
              </p>
            </div>
          </div>

          {/* Seletor de Linguagens */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {['JS', 'TS', 'PYTHON', 'RUST', 'GO', 'JAVA'].map((lang) => {
              const langCode = lang === 'PYTHON' ? 'PYTHON' : lang;
              const isSelected = activeLang === (lang === 'PYTHON' ? 'PYTHON' : lang);
              const label = lang.toUpperCase();

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
                <h3 className="text-sm font-black text-dd-text">Trilha de {activeLang}</h3>
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

          {/* Header Card (Duolingo Style: Dropdown and Active Unit Banner) */}
          <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-dd-border rounded-2xl p-7 shadow-md flex flex-col items-center text-center space-y-4.5">
            {/* Section Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
                className="flex items-center gap-2.5 px-4.5 py-2.5 bg-dd-surface border border-dd-border hover:border-orange-500/50 hover:bg-dd-border/30 rounded-xl transition-all cursor-pointer shadow-sm text-xs md:text-sm font-black text-dd-text uppercase tracking-wider"
              >
                <span>Nível: {activeSection}</span>
                <ChevronDown
                  className={`w-4 h-4 text-orange-500 transition-transform ${sectionDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {sectionDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSectionDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-dd-surface border border-dd-border rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-dd-border/50"
                    >
                      {sections.map((sec) => {
                        const isSelected = sec === activeSection;
                        return (
                          <button
                            key={sec}
                            onClick={() => {
                              setActiveSection(sec);
                              setSectionDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-orange-500/10 text-orange-400 font-black'
                                : 'text-dd-muted hover:text-dd-text hover:bg-dd-border/30'
                            }`}
                          >
                            <span>{sec}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Active Unit Title */}
            {activeUnitLevel && (
              <div className="space-y-1.5">
                <h2 className="text-dd-text text-base md:text-lg lg:text-xl font-black uppercase tracking-tight">
                  Unidade {activeUnitLevel.unitNumber}: {activeUnitLevel.unitTitle}
                </h2>
                <p className="text-xs md:text-sm text-dd-muted font-medium max-w-xl">
                  Domine esta unidade completando os exercícios e quizzes abaixo para expandir seu
                  conhecimento em {activeLang}.
                </p>
              </div>
            )}
          </div>

          {/* Winding Trail Path (Duolingo Map) */}
          <div className="relative flex flex-col items-center py-14 bg-dd-surface/5 border border-dd-border/50 border-dashed rounded-2xl overflow-hidden min-h-[550px]">
            <div className="space-y-5 w-full max-w-sm flex flex-col items-center">
              {(() => {
                let lastUnitNumber: number | null = null;

                return sectionLevels.map((level) => {
                  const showSeparator = level.unitNumber !== lastUnitNumber;
                  lastUnitNumber = level.unitNumber;

                  const globalIdx = TRAILS_DATA[activeLang].findIndex(
                    (l) => l.levelNumber === level.levelNumber
                  );
                  const unlocked = isLevelUnlocked(globalIdx);
                  const completedCount = level.questions.filter(
                    (q) => attempts[q.id] === true
                  ).length;
                  const isCompleted = completedCount === 3;

                  return (
                    <div key={level.levelNumber} className="w-full flex flex-col items-center">
                      {showSeparator && (
                        <div className="w-full flex items-center justify-center my-10 max-w-sm px-4">
                          <div className="flex-grow border-t border-dd-border/60"></div>
                          <span className="px-4.5 py-2 bg-dd-surface border border-dd-border text-dd-text text-[10px] font-extrabold uppercase tracking-wider rounded-full mx-3 text-center shadow-sm whitespace-nowrap">
                            Unidade {level.unitNumber}: {level.unitTitle}
                          </span>
                          <div className="flex-grow border-t border-dd-border/60"></div>
                        </div>
                      )}

                      <div
                        className="relative z-10 flex flex-col items-center my-7 transition-transform"
                        style={getOffsetStyle(globalIdx)}
                      >
                        {/* Estrelas orgânicas/curvadas */}
                        <div className="flex gap-1.5 justify-center mb-2.5 items-end h-6.5">
                          {Array.from({ length: 3 }).map((_, starIdx) => {
                            const isStarEarned = attempts[level.questions[starIdx]?.id] === true;
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
              })()}
            </div>
          </div>

          {/* Floating Recommended Level Bar */}
          <AnimatePresence>
            {recommendedLevel && (
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
        </main>

        <Footer />
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
              className={`relative w-full ${aiChatOpen ? 'max-w-4xl' : 'max-w-lg'} bg-dd-surface border border-dd-border rounded-2xl shadow-2xl z-10 font-sans flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-5 pb-8 relative flex flex-col gap-4">
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
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DevAssistant {aiChatOpen ? 'Aberto' : 'IA'}</span>
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
              <div className="flex flex-row flex-grow overflow-hidden relative">
                {/* Left Column: Study content */}
                <div
                  className={`flex flex-col flex-grow overflow-hidden ${aiChatOpen ? 'md:w-1/2 border-r border-dd-border' : 'w-full'}`}
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
                                💡
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
                                <span className="text-orange-500 text-xs mt-0.5">💡</span>
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
                            Você concluiu a Fase {activeLevel.levelNumber} de {activeLang}!
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
                  <div className="p-4 border-t border-dd-border flex justify-between items-center bg-dd-surface">
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
                          const isCorrect = selectedOption === question.correctIndex;

                          if (!isCorrect) {
                            return (
                              <button
                                onClick={handleRetryQuestion}
                                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                Tentar Novamente
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
                  <div className="w-full md:w-1/2 flex flex-col bg-dd-surface/50 h-full overflow-hidden relative border-t border-dd-border md:border-t-0 select-text">
                    {/* Header/Title of AI */}
                    <div className="p-4 border-b border-dd-border flex items-center justify-between bg-dd-surface/70">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-dd-text">DevAssistant IA</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-[8px] font-bold text-orange-500 uppercase tracking-wide">
                        Online
                      </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-3 scrollbar-thin select-text">
                      {aiMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2.5 max-w-[85%] ${
                            msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              msg.role === 'user'
                                ? 'bg-orange-500 text-white'
                                : 'bg-dd-border text-orange-500'
                            }`}
                          >
                            {msg.role === 'user' ? user.username[0].toUpperCase() : '🤖'}
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-[11px] leading-relaxed select-text ${
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
                          <div className="w-7 h-7 rounded-full bg-dd-border text-orange-500 flex items-center justify-center text-xs font-bold shrink-0">
                            🤖
                          </div>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-dd-border/50 bg-dd-surface/20">
                      {currentStage === 'learn' && (
                        <>
                          <button
                            onClick={() =>
                              handleSendAiMessage('Explicar este conceito de forma mais detalhada')
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            💡 Explicar Conceito
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage(
                                'Me dê outro exemplo prático de código para fixar'
                              )
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            💻 Exemplo de Código
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
                            className="px-2.5 py-1 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            🔍 Dica Sutil
                          </button>
                          <button
                            onClick={() =>
                              handleSendAiMessage('Explique a teoria por trás desta pergunta')
                            }
                            disabled={aiLoading}
                            className="px-2.5 py-1 rounded-full border border-dd-border bg-dd-surface text-[10px] text-dd-muted hover:text-dd-text hover:border-orange-500/50 transition-all cursor-pointer"
                          >
                            📚 Explicar Teoria
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
                      className="p-3 border-t border-dd-border flex gap-2 items-center bg-dd-surface/80"
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
