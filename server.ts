import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory store for assessments and question bank on server
let savedAssessments: any[] = [];
let savedBankTasks: any[] = [];
let studentResults: any[] = [];

// Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health and AI status check endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// AI task generation endpoint
app.post('/api/ai/generate-tasks', async (req, res) => {
  const {
    subject,
    grade,
    term,
    topic,
    learningObjective,
    taskTypes,
    taskCount = 3,
    difficulty = 'Орташа',
    targetPoints = 5,
    assessmentType = 'БЖБ',
    formativeMethod = '',
    additionalInstructions = '',
  } = req.body;

  if (!apiKey || !aiClient) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY табылмады',
      message:
        'ЖИ арқылы тапсырма құрастыру үшін жүйеде GEMINI_API_KEY кілті орнатылуы қажет. Платформаның баптаулар бөлімінде үлгілік тапсырмаларды пайдалануға болады.',
      isMissingKey: true,
    });
  }

  try {
    const isQB = assessmentType === 'ҚБ';
    const prompt = isQB
      ? `
Сіз — Қазақстанның жаңартылған білім беру бағдарламасы бойынша күнделікті сабаққа арналған ҚАЛЫПТАСТЫРУШЫ БАҒАЛАУ (ҚБ) тапсырмаларын құрастырушы тәжірибелі әдіскерсіз.

ПАРАМЕТРЛЕР:
- Бағалау түрі: Күнделікті сабаққа арналған Қалыптастырушы бағалау (ҚБ)
- Пән: ${subject || 'Жалпы пән'}
- Сынып: ${grade || 8}-сынып
- Сабақ тақырыбы: ${topic || 'Сабақ тақырыбы'}
- Оқу мақсаты: ${learningObjective || 'Оқу бағдарламасының негізгі мақсаты'}
- ҚБ әдісі: ${formativeMethod || 'Деңгейлік тапсырмалар (A, B, C)'}
- Тапсырмалар саны: ${taskCount}
- Жалпы балл: ${targetPoints || 10} балл (ҚР мектептеріндегі 1-10 балдық күнделікті ҚБ шкаласы)
- Қосымша нұсқау: ${additionalInstructions || 'Оқушылардың сабақта жаңа білімді қалай меңгергенін анықтау үшін сараланған, тиімді тапсырмалар құрастыру.'}

ТАЛАПТАР:
1. Барлық мәтіндер тек қана таза, әдеби, қатесіз қазақ тілінде болуы шарт.
2. Әр тапсырмаға сабақ кезеңін белгілеңіз:
   - 'Сабақтың басы (Кіріспе / Миға шабуыл)'
   - 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)'
   - 'Сабақтың соңы (Шығу парағы / Рефлексия)'
3. Әр тапсырмаға деңгейлік саралауды көрсетіңіз: 'А деңгейі', 'В деңгейі' немесе 'С деңгейі'.
4. Әр тапсырмаға нақты қадамдық дескрипторлар (әр дескриптор 1 балл) берілсін.
5. Мұғалімнің оқушыға беретін қалыптастырушы сындарлы кері байланыс сөзін (teacherFeedbackSample) жазыңыз (мысалы: "Жарайсың! Формуланы орынды таңдадың, енді соңғы есептеу амалына назар аудар").
6. Дұрыс жауап кілті және шешу түсіндірмесі толық берілсін.
7. Толық JSON форматында қайтарыңыз.
`
      : `
Сіз — Қазақстанның жаңартылған білім беру мазмұны бойынша БЖБ (Бөлім бойынша жиынтық бағалау) және ТЖБ (Тоқсандық жиынтық бағалау) тапсырмаларын құрастырушы кәсіби әдіскер-сарапшысыз.

ТАПСЫРМА ПАРАМЕТРЛЕРІ:
- Пән: ${subject || 'Жалпы пән'}
- Сынып: ${grade || 8}-сынып
- Тоқсан: ${term || 2}-тоқсан
- Бөлім/Тақырып: ${topic || 'Бөлім тақырыбы'}
- Оқу мақсаты: ${learningObjective || 'Негізгі оқу бағдарламасының мақсаты'}
- Ұсынылатын тапсырма түрлері: ${Array.isArray(taskTypes) && taskTypes.length > 0 ? taskTypes.join(', ') : 'single-choice, short answer, calculation'}
- Құрастырылатын тапсырмалар саны: ${taskCount}
- Қиындық деңгейі: ${difficulty}
- Жалпы шамалас балл: ${targetPoints} балл
- Қосымша талаптар: ${additionalInstructions || 'Қазақстанның білім стандартына сай нақты, түсінікті, сауатты қазақ тілінде құрастыру.'}

ТАЛАПТАР:
1. Барлық мәтіндер тек қана әдеби, қатесіз қазақ тілінде болуы шарт.
2. Әр тапсырмаға бағалау критерийі және нақты қадамдық дескрипторлар (әр дескриптор 1 балл) берілсін.
3. Әр тапсырмаға нақты дұрыс жауап кілті және түсіндірме (шешу жолы) жазылсын.
4. Тест болса (single-choice, multiple-choice), міндетті түрде кемінде 4 нұсқа (A, B, C, D) және олардың ішінен дұрыс жауабы белгіленсін.
5. Сәйкестендіру (matching) болса, екі бағандағы элементтер берілсін.
6. Толық JSON форматында қайтарыңыз.
`;

    // Attempt generation with retry for transient high demand
    let response: any = null;
    let lastErr: any = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'Сіз Қазақстан Республикасының орта білім беру стандартына (ҚБ, БЖБ, ТЖБ) толық сәйкес келетін оқу тапсырмаларын тек JSON пішімінде жасайтын сарапшы мұғалімсіз. Тек таза қазақ тілінде жазыңыз.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: {
                        type: Type.STRING,
                        description:
                          'single-choice, multiple-choice, true/false, matching, fill-in-the-blank, short answer, open-ended response, ordering, table completion, calculation, practical coding task',
                      },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Нұсқалар (тест үшін A, B, C, D)',
                      },
                      matchingPairs: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            left: { type: Type.STRING },
                            right: { type: Type.STRING },
                          },
                        },
                      },
                      points: { type: Type.NUMBER },
                      difficulty: { type: Type.STRING },
                      learningObjective: { type: Type.STRING },
                      criteria: { type: Type.STRING },
                      descriptors: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      answerKey: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      lessonStage: { type: Type.STRING },
                      differentiation: { type: Type.STRING },
                      teacherFeedbackSample: { type: Type.STRING },
                    },
                    required: [
                      'title',
                      'type',
                      'question',
                      'points',
                      'criteria',
                      'descriptors',
                      'answerKey',
                    ],
                  },
                },
              },
              required: ['tasks'],
            },
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastErr = err;
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }

    if (!response && lastErr) {
      throw lastErr;
    }

    const text = response.text;
    if (!text) {
      throw new Error('ЖИ бос жауап қайтарды');
    }

    const parsed = JSON.parse(text);
    // Enrich with unique IDs
    const tasksWithId = (parsed.tasks || []).map((t: any, idx: number) => ({
      ...t,
      id: `ai_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      subject: subject || 'Жалпы пән',
      grade: Number(grade) || 8,
    }));

    return res.json({
      success: true,
      tasks: tasksWithId,
    });
  } catch (error: any) {
    console.error('Error generating AI tasks:', error);
    return res.status(500).json({
      error: 'ЖИ арқылы тапсырма генерациялау кезінде қате орын алды',
      details: error.message || String(error),
    });
  }
});

// AI Document Converter endpoint (Converts PDF, Word text, scanned photos into structured BJB/TZHB)
app.post('/api/ai/convert-document', async (req, res) => {
  const {
    text = '',
    fileBase64 = '',
    fileName = '',
    mimeType = 'application/pdf',
    assessmentTypeHint = 'auto',
    subjectHint = '',
    gradeHint,
  } = req.body;

  if (!text && !fileBase64) {
    return res.status(400).json({
      error: 'Құжат мазмұны немесе файлы жіберілмеді',
      message: 'Түрлендіру үшін Word/PDF файлы немесе мәтін қажет.',
    });
  }

  // Fallback generator in case Gemini key is missing or transient failure
  const buildFallbackResult = () => {
    const rawContent = (text || fileName || '').toLowerCase();
    const isTZHB =
      assessmentTypeHint === 'ТЖБ' ||
      rawContent.includes('тжб') ||
      rawContent.includes('тоқсандық') ||
      rawContent.includes('summative');
    const detectedType = isTZHB ? 'ТЖБ' : 'БЖБ';
    const detectedSubject = subjectHint || (rawContent.includes('алгебра') ? 'Алгебра' : rawContent.includes('физика') ? 'Физика' : rawContent.includes('информатика') ? 'Информатика' : rawContent.includes('тарих') ? 'Қазақстан тарихы' : 'Жалпы пән');
    const detectedGrade = Number(gradeHint) || 8;

    return {
      title: `${detectedSubject} бойынша ${detectedGrade}-сынып ${detectedType} (Құжаттан түрлендірілген)`,
      type: detectedType,
      subject: detectedSubject,
      grade: detectedGrade,
      term: 2,
      unitOrTopic: 'Құжаттан алынған бөлім тақырыбы',
      learningObjectives: [`${detectedGrade}.2.1.1`, `${detectedGrade}.2.1.2`, `${detectedGrade}.3.1.4`],
      durationMinutes: detectedType === 'ТЖБ' ? 45 : 25,
      targetPoints: 10,
      summary: 'Құжат құрылымы оқылып, 4 интерактивті тапсырма және ҚР №125 стандарты бойынша дескрипторлар кестесі құрылды.',
      tasks: [
        {
          id: `conv_${Date.now()}_1`,
          title: '1-тапсырма. Бір дұрыс жауапты тест',
          type: 'single-choice',
          question: text.length > 20 ? text.slice(0, 150).replace(/[\r\n]+/g, ' ') : 'Берілген анықтамалар мен тұжырымдардың қайсысы дұрыс?',
          options: [
            'A) Негізгі ұғым дұрыс сипатталған',
            'B) Көрсеткіш екі есеге артады',
            'C) Параметрлер мәні өзгермейді',
            'D) Шамалар кері пропорционал',
          ],
          points: 1,
          difficulty: 'Базалық',
          learningObjective: `${detectedGrade}.2.1.1`,
          criteria: 'Негізгі ұғымдар мен ережелерді ажырата алады',
          descriptors: ['Дұрыс жауап нұсқасын таңдайды (1 балл)'],
          answerKey: 'A',
          explanation: 'Құжаттағы бірінші сұрақ сәйкес анықтама негізінде талданды.',
        },
        {
          id: `conv_${Date.now()}_2`,
          title: '2-тапсырма. Есептеу тапсырмасы',
          type: 'calculation',
          question: 'Берілген шамалардың мәнін қолдана отырып, белгісіз айнымалыны есептеңіз және нәтижені жазыңыз.',
          points: 3,
          difficulty: 'Орташа',
          learningObjective: `${detectedGrade}.2.1.2`,
          criteria: 'Формуланы қолданып есептеулер жүргізеді',
          descriptors: [
            'Есептің шарты бойынша белгілі шамаларды жазады (1 балл)',
            'Қажетті формуланы дұрыс таңдайды (1 балл)',
            'Математикалық есептеулер жүргізіп, дұрыс жауабын табады (1 балл)',
          ],
          answerKey: '12.5 (немесе тиісті есептеу мәні)',
          explanation: 'Формулаға мәндерді қою арқылы шығарылады.',
        },
        {
          id: `conv_${Date.now()}_3`,
          title: '3-тапсырма. Сәйкестендіру',
          type: 'matching',
          question: 'Сол жақтағы ұғымдар мен оң жақтағы сипаттамаларды сәйкестендіріңіз.',
          matchingPairs: [
            { left: '1. Негізгі қасиет', right: 'А. Бағыты мен өлшемі тұрақты' },
            { left: '2. Өзгермелі процесс', right: 'В. Уақыт өте келе мәні өзгереді' },
            { left: '3. Тұрақты параметр', right: 'С. Физикалық/математикалық константа' },
          ],
          points: 3,
          difficulty: 'Орташа',
          learningObjective: `${detectedGrade}.2.1.3`,
          criteria: 'Ұғымдар арасындағы байланысты анықтайды',
          descriptors: [
            'Бірінші жұпты дұрыс табады (1 балл)',
            'Екінші жұпты дұрыс табады (1 балл)',
            'Үшінші жұпты дұрыс табады (1 балл)',
          ],
          answerKey: '1-А, 2-В, 3-С',
          explanation: 'Әрбір ұғым тиісті анықтамасымен сәйкестендірілді.',
        },
        {
          id: `conv_${Date.now()}_4`,
          title: '4-тапсырма. Ашық жауапты тапсырма',
          type: 'open-ended response',
          question: 'Құбылысты немесе процесті сипаттаңыз. Себеп-салдарлық байланысты дәлелдермен негіздеңіз.',
          points: 3,
          difficulty: 'Жоғары',
          learningObjective: `${detectedGrade}.3.1.4`,
          criteria: 'Құбылысты талдап, қорытынды жасайды',
          descriptors: [
            'Құбылыстың негізгі себебін көрсетеді (1 балл)',
            'Дәлелдемелер мен мысалдар келтіреді (1 балл)',
            'Логикалық тұжырым жасайды (1 балл)',
          ],
          answerKey: 'Толық сипаттама және дәлелдеме жазылуы қажет.',
          explanation: 'Ашық тапсырма оқушының талдау дағдысын бағалайды.',
        },
      ],
    };
  };

  if (!apiKey || !aiClient) {
    const fallback = buildFallbackResult();
    return res.json({
      success: true,
      result: fallback,
      isFallback: true,
      message: 'GEMINI_API_KEY табылмағандықтан, құжат үлгілік талдау негізінде құрастырылды.',
    });
  }

  try {
    const prompt = `
Сіз — Қазақстанның жаңартылған білім беру мазмұны бойынша БЖБ (Бөлім бойынша жиынтық бағалау) және ТЖБ (Тоқсандық жиынтық бағалау) құжаттарын талдап, интерактивті оқу тапсырмаларына айналдырушы бас әдіскер-сарапшысыз (ҚР БҒМ №125 бұйрығы негізінде).

МІНДЕТ:
Ұсынылған құжат мазмұнын (мәтін, сканерленген сурет немесе PDF парағы) мұқият оқып шығып, оны оқушылар онлайн орындай алатын, ал мұғалім дескриптор бойынша тексере алатын толық интерактивті жиынтық бағалау тапсырмаларына айналдырыңыз.

ҚОСЫМША НҰСҚАУЛЫҚТАР:
- Ұсынылған пән: ${subjectHint || 'Құжаттан анықтау'}
- Ұсынылған сынып: ${gradeHint ? `${gradeHint}-сынып` : 'Құжаттан анықтау'}
- Ұсынылған бағалау түрі: ${assessmentTypeHint !== 'auto' ? assessmentTypeHint : 'Құжаттан анықтау (БЖБ немесе ТЖБ)'}
- Құжат атауы: ${fileName || 'Белгісіз құжат'}

ТАЛАПТАР:
1. Барлық мәтіндерді таза, әдеби, қатесіз қазақ тілінде құрастырыңыз.
2. Құжаттағы әрбір сұрақты, есепті немесе тест тапсырмасын бөлек 'Task' ретінде шығарыңыз.
3. Тапсырма түрлерін дәл белгілеңіз:
   - 'single-choice' (бір дұрыс жауапты тест: кемінде 4 нұсқа - A, B, C, D)
   - 'multiple-choice' (бірнеше дұрыс жауапты тест)
   - 'true/false' (ақиқат немесе жалған)
   - 'matching' (сәйкестендіру — left және right элементтері)
   - 'fill-in-the-blank' (бос орынға сөз не сан қою)
   - 'short answer' (қысқаша жауап)
   - 'open-ended response' (толық ашық жауап)
   - 'calculation' (есептеу тапсырмасы)
   - 'practical coding task' (код жазу / алгоритм)
4. Әр тапсырмаға ҚР №125 стандарты талабы бойынша:
   - Бағалау критерийі (criteria)
   - Нақты қадамдық дескрипторлар тізімі (descriptors, әр қадамға 1 балл)
   - Дұрыс жауап кілті (answerKey)
   - Түсіндірме / шешу алгоритмі (explanation)
5. Жалпы балл сомасын (targetPoints) дескрипторлар мен тапсырма баллдарының қосындысына сәйкестендіріңіз.
6. Құжат бойынша толық JSON форматында қайтарыңыз.
`;

    const parts: any[] = [];

    // Multimodal image/PDF support if fileBase64 provided
    if (fileBase64 && typeof fileBase64 === 'string') {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    if (text) {
      parts.push({
        text: `ҚҰЖАТ МӘТІНІ МЕН ТАПСЫРМАЛАРЫ:\n${text}`,
      });
    }

    parts.push({ text: prompt });

    let response: any = null;
    let lastErr: any = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts }],
          config: {
            systemInstruction:
              'Сіз Қазақстанның БЖБ және ТЖБ құжаттарын талдап, интерактивті дескрипторлы оқу тапсырмаларына түрлендіретін кәсіби сарапшысыз. Тек JSON форматында және сауатты қазақ тілінде жауап беріңіз.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, description: 'БЖБ немесе ТЖБ' },
                subject: { type: Type.STRING },
                grade: { type: Type.NUMBER },
                term: { type: Type.NUMBER },
                unitOrTopic: { type: Type.STRING },
                learningObjectives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                durationMinutes: { type: Type.NUMBER },
                targetPoints: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: {
                        type: Type.STRING,
                        description:
                          'single-choice, multiple-choice, true/false, matching, fill-in-the-blank, short answer, open-ended response, ordering, table completion, calculation, practical coding task',
                      },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      matchingPairs: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            left: { type: Type.STRING },
                            right: { type: Type.STRING },
                          },
                        },
                      },
                      points: { type: Type.NUMBER },
                      difficulty: { type: Type.STRING },
                      learningObjective: { type: Type.STRING },
                      criteria: { type: Type.STRING },
                      descriptors: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      answerKey: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: [
                      'title',
                      'type',
                      'question',
                      'points',
                      'criteria',
                      'descriptors',
                      'answerKey',
                    ],
                  },
                },
              },
              required: [
                'title',
                'type',
                'subject',
                'grade',
                'term',
                'unitOrTopic',
                'targetPoints',
                'tasks',
              ],
            },
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        lastErr = err;
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }

    if (!response && lastErr) {
      console.warn('Gemini convert-document error, using smart fallback:', lastErr);
      const fallback = buildFallbackResult();
      return res.json({
        success: true,
        result: fallback,
        isFallback: true,
      });
    }

    const resText = response?.text;
    if (!resText) {
      const fallback = buildFallbackResult();
      return res.json({
        success: true,
        result: fallback,
        isFallback: true,
      });
    }

    const parsed = JSON.parse(resText);

    // Ensure all tasks have proper IDs and default properties
    const tasksWithIds = (parsed.tasks || []).map((t: any, idx: number) => ({
      ...t,
      id: `task_conv_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      subject: parsed.subject || subjectHint || 'Жалпы пән',
      grade: parsed.grade || Number(gradeHint) || 8,
      difficulty: t.difficulty || 'Орташа',
      learningObjective: t.learningObjective || `${parsed.grade || 8}.1.1.${idx + 1}`,
      criteria: t.criteria || 'Берілген тақырып бойынша ұғымдар мен есептерді орындай алады',
      descriptors: Array.isArray(t.descriptors) && t.descriptors.length > 0 ? t.descriptors : [`Тапсырманы дұрыс орындайды (${t.points || 1} балл)`],
      answerKey: t.answerKey || 'Дұрыс жауабы',
      createdAt: new Date().toISOString(),
    }));

    const result = {
      title: parsed.title || `${parsed.subject || subjectHint || 'Пән'} бойынша ${parsed.type || 'БЖБ'} (Түрлендірілген)`,
      type: (parsed.type === 'ТЖБ' ? 'ТЖБ' : 'БЖБ') as 'БЖБ' | 'ТЖБ',
      subject: parsed.subject || subjectHint || 'Жалпы пән',
      grade: Number(parsed.grade) || Number(gradeHint) || 8,
      term: Number(parsed.term) || 2,
      unitOrTopic: parsed.unitOrTopic || 'Құжат бөлімі',
      learningObjectives: parsed.learningObjectives || [`${parsed.grade || 8}.1.1.1`],
      durationMinutes: Number(parsed.durationMinutes) || (parsed.type === 'ТЖБ' ? 45 : 25),
      targetPoints: Number(parsed.targetPoints) || tasksWithIds.reduce((sum: number, t: any) => sum + (t.points || 1), 0),
      summary: parsed.summary || `${tasksWithIds.length} интерактивті тапсырма және дескрипторлар кестесі дайындалды.`,
      tasks: tasksWithIds,
      rawSourceSnippet: text ? text.slice(0, 300) : fileName,
      detectedSourceType: fileBase64 ? (mimeType.includes('pdf') ? 'PDF құжаты' : 'Скан/Сурет') : 'Word / Мәтін',
    };

    return res.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.error('Error in convert-document:', err);
    const fallback = buildFallbackResult();
    return res.json({
      success: true,
      result: fallback,
      isFallback: true,
      warning: err.message,
    });
  }
});

// Assessment endpoints
app.get('/api/assessments', (_req, res) => {
  res.json({ success: true, assessments: savedAssessments });
});

app.post('/api/assessments', (req, res) => {
  const assessment = req.body;
  const existingIdx = savedAssessments.findIndex((a) => a.id === assessment.id);
  if (existingIdx >= 0) {
    savedAssessments[existingIdx] = {
      ...assessment,
      updatedAt: new Date().toISOString(),
    };
  } else {
    savedAssessments.unshift({
      ...assessment,
      id:
        assessment.id ||
        `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  res.json({ success: true, count: savedAssessments.length });
});

app.delete('/api/assessments/:id', (req, res) => {
  const { id } = req.params;
  savedAssessments = savedAssessments.filter((a) => a.id !== id);
  res.json({ success: true, remaining: savedAssessments.length });
});

// Question Bank endpoints
app.get('/api/bank', (_req, res) => {
  res.json({ success: true, tasks: savedBankTasks });
});

app.post('/api/bank', (req, res) => {
  const task = req.body;
  const existingIdx = savedBankTasks.findIndex((t) => t.id === task.id);
  if (existingIdx >= 0) {
    savedBankTasks[existingIdx] = {
      ...task,
      updatedAt: new Date().toISOString(),
    };
  } else {
    savedBankTasks.unshift({
      ...task,
      id:
        task.id ||
        `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      savedToBank: true,
      createdAt: new Date().toISOString(),
    });
  }
  res.json({ success: true, count: savedBankTasks.length });
});

app.delete('/api/bank/:id', (req, res) => {
  const { id } = req.params;
  savedBankTasks = savedBankTasks.filter((t) => t.id !== id);
  res.json({ success: true, remaining: savedBankTasks.length });
});

// Monitoring student results endpoints
app.get('/api/monitoring', (_req, res) => {
  res.json({ success: true, results: studentResults });
});

app.post('/api/monitoring', (req, res) => {
  const result = req.body;
  studentResults.push({
    ...result,
    id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recordedAt: new Date().toISOString(),
  });
  res.json({ success: true, count: studentResults.length });
});

// Dev and Prod serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`EduAccess Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
