export type TaskType =
  | 'single-choice'       // Бір дұрыс жауапты тест
  | 'multiple-choice'     // Бірнеше дұрыс жауапты тест
  | 'true/false'          // Ақиқат / Жалған
  | 'matching'            // Сәйкестендіру
  | 'fill-in-the-blank'   // Бос орынды толтыру
  | 'short answer'        // Қысқаша жауап
  | 'open-ended response' // Толық ашық жауап / эссе
  | 'ordering'            // Реттілікпен орналастыру
  | 'table completion'    // Кестені толтыру
  | 'calculation'         // Есептеу тапсырмасы
  | 'practical coding task'; // Практикалық кодтау тапсырмасы

export type AssessmentType = 'БЖБ' | 'ТЖБ' | 'ҚБ';

export type LessonStage =
  | 'Сабақтың басы (Кіріспе / Миға шабуыл)'
  | 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)'
  | 'Сабақтың соңы (Шығу парағы / Рефлексия)';

export type FormativeMethod =
  | 'Деңгейлік тапсырмалар (A, B, C)'
  | 'Шығу парағы (Exit ticket)'
  | '«3-2-1» әдісі'
  | 'Экспресс-тест (5 минут)'
  | 'Күнделікті 1–10 балдық жұмыс'
  | 'Өзара бағалау және жұптық жұмыс';

export type DifficultyLevel = 'Базалық' | 'Орташа' | 'Жоғары';

export type ThinkingSkillLevel =
  | 'Білу және түсіну'
  | 'Қолдану'
  | 'Жоғары деңгей дағдылары';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface TableRow {
  col1: string;
  col2: string;
  col3?: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  question: string;
  options?: string[]; // Тест нұсқалары (A, B, C, D)
  matchingPairs?: MatchingPair[]; // Сәйкестендіру
  tableData?: TableRow[]; // Кестелік тапсырма
  orderingItems?: string[]; // Реттік тапсырма
  codeSnippet?: string; // Информатика үшін код
  points: number;
  difficulty: DifficultyLevel;
  thinkingSkill?: ThinkingSkillLevel;
  learningObjective: string; // Оқу мақсаты (мысалы 8.1.3.2)
  criteria: string; // Бағалау критерийі
  descriptors: string[]; // Дескрипторлар тізімі (әрқайсысы 1 балл)
  answerKey: string; // Дұрыс жауап
  explanation?: string; // Шешу жолы немесе түсіндірме
  lessonStage?: LessonStage; // Сабақтың кезеңі (ҚБ үшін)
  differentiation?: 'А деңгейі' | 'В деңгейі' | 'С деңгейі'; // Деңгейлік саралау
  teacherFeedbackSample?: string; // Қалыптастырушы кері байланыс шаблоны
  isAiGenerated?: boolean;
  savedToBank?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subject?: string;
  grade?: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType; // БЖБ немесе ТЖБ
  subject: string;
  grade: number;
  term: number; // 1, 2, 3, 4
  unitOrTopic: string;
  learningObjectives: string[];
  durationMinutes: number; // Орындау уақыты (мин)
  targetPoints: number; // Мақсатты балл
  difficulty: DifficultyLevel;
  tasks: Task[];
  status: 'Жоба' | 'Дайын' | 'Өткізілді';
  author: string;
  schoolName?: string;
  instructions?: string; // Оқушыға арналған нұсқаулық
  createdAt: string;
  updatedAt: string;
}

export interface StudentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  subject: string;
  grade: number;
  className: string; // 8 "А", 9 "Б"
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'Төмен' | 'Орта' | 'Жоғары';
  objectiveResults: {
    objective: string;
    achieved: boolean;
  }[];
  teacherFeedback: string;
  recordedAt: string;
}

export interface TeacherProfile {
  name: string;
  email: string;
  school: string;
  subjects: string[];
  activeSubject?: string;
  grades: number[];
  autoSave: boolean;
  defaultDurationBJB: number;
  defaultDurationTZHB: number;
}

export interface AiTaskGenerateRequest {
  subject: string;
  grade: number;
  term: number;
  topic: string;
  learningObjective: string;
  taskTypes: TaskType[];
  taskCount: number;
  difficulty: DifficultyLevel;
  targetPoints: number;
  assessmentType?: AssessmentType;
  formativeMethod?: FormativeMethod;
  additionalInstructions?: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  email?: string;
  joinedAt?: string;
}

export interface AssignedAssessment {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  type: AssessmentType;
  subject: string;
  grade: number;
  assignedAt: string;
  deadline: string;
  durationMinutes: number;
  totalPoints: number;
  status: 'Белсенді' | 'Аяқталды' | 'Жоспарланды';
  submissionsCount: number;
  accessCode: string;
  instructions?: string;
}

export interface Classroom {
  id: string;
  name: string; // e.g. 8 "А"
  subject: string; // e.g. Физика
  grade: number;
  academicYear: string; // 2026-2027
  code: string; // EDU-8A73
  color: string; // indigo, emerald, amber, purple, blue
  students: ClassroomStudent[];
  assignedAssessments: AssignedAssessment[];
  createdAt: string;
  description?: string;
}

export interface StudentSubmission {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  classId: string;
  className: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  submittedAt: string;
  status: 'Тексерілуде' | 'Тексерілді';
  answers: Record<string, any>;
  taskScores: Record<string, number>;
  taskDescriptorsAchieved?: Record<string, boolean[]>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'Жоғары' | 'Орта' | 'Төмен';
  teacherFeedback: string;
  gradedAt?: string;
}

export type UserRole = 'teacher' | 'student';

export interface CurrentStudentUser {
  id: string;
  name: string;
  className: string;
  classCode: string;
}

export type NavigationPage =
  | 'dashboard'
  | 'builder-qb'
  | 'builder-bjb'
  | 'builder-tzhb'
  | 'converter'
  | 'classrooms'
  | 'grading'
  | 'ai-generator'
  | 'question-bank'
  | 'monitoring'
  | 'my-assessments'
  | 'settings';

export interface ConvertDocumentRequest {
  text?: string;
  fileBase64?: string;
  fileName?: string;
  mimeType?: string;
  assessmentTypeHint?: AssessmentType | 'auto';
  subjectHint?: string;
  gradeHint?: number;
}

export interface ConvertedAssessmentResult {
  title: string;
  type: AssessmentType;
  subject: string;
  grade: number;
  term: number;
  unitOrTopic: string;
  learningObjectives: string[];
  durationMinutes: number;
  targetPoints: number;
  tasks: Task[];
  summary: string;
  rawSourceSnippet?: string;
  detectedSourceType?: string;
}

