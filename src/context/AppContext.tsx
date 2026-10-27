import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Assessment,
  Task,
  StudentResult,
  TeacherProfile,
  NavigationPage,
  AssessmentType,
  Classroom,
  AssignedAssessment,
  StudentSubmission,
  UserRole,
  CurrentStudentUser,
} from '../types';
import {
  INITIAL_ASSESSMENTS,
  INITIAL_BANK_TASKS,
  INITIAL_STUDENT_RESULTS,
  INITIAL_TEACHER_PROFILE,
  INITIAL_CLASSROOMS,
  INITIAL_SUBMISSIONS,
} from '../data/mockData';
import {
  checkServerStatus,
  ServerStatus,
  saveAssessmentToServer,
  deleteAssessmentFromServer,
  saveBankTaskToServer,
  deleteBankTaskFromServer,
} from '../services/api';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  assessments: Assessment[];
  activeAssessment: Assessment;
  setActiveAssessment: React.Dispatch<React.SetStateAction<Assessment>>;
  questionBank: Task[];
  studentResults: StudentResult[];
  teacherProfile: TeacherProfile;
  setTeacherProfile: (profile: TeacherProfile) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  serverStatus: ServerStatus;
  refreshStatus: () => Promise<void>;
  saveCurrentAssessment: () => Promise<void>;
  deleteAssessment: (id: string) => Promise<void>;
  duplicateAssessment: (id: string) => void;
  createNewAssessment: (type: AssessmentType) => void;
  openAssessmentInBuilder: (assessment: Assessment) => void;
  addToQuestionBank: (task: Task) => Promise<void>;
  deleteFromQuestionBank: (id: string) => Promise<void>;
  addTaskToActiveAssessment: (task: Task) => void;
  addStudentResult: (res: StudentResult) => void;
  deleteStudentResult: (id: string) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  classrooms: Classroom[];
  addClassroom: (classroom: Classroom) => void;
  updateClassroom: (classroom: Classroom) => void;
  deleteClassroom: (id: string) => void;
  assignAssessmentToClass: (
    classId: string,
    assessmentId: string,
    deadline: string,
    instructions?: string
  ) => void;
  removeAssessmentFromClass: (classId: string, assignmentId: string) => void;
  addStudentToClass: (classId: string, studentName: string, email?: string) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentStudent: CurrentStudentUser | null;
  setCurrentStudent: (student: CurrentStudentUser | null) => void;
  submissions: StudentSubmission[];
  submitStudentWork: (submission: StudentSubmission) => void;
  gradeAndSendResultToStudent: (
    submissionId: string,
    taskScores: Record<string, number>,
    taskDescriptors: Record<string, boolean[]>,
    feedback: string
  ) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  toast: Toast | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  isSubjectModalOpen: boolean;
  setIsSubjectModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const createDefaultAssessment = (type: AssessmentType, subject = 'Физика'): Assessment => {
  const sampleTopicMap: Record<string, { topic: string; objective: string }> = {
    Физика: { topic: 'Жылу құбылыстары', objective: '8.3.2.1' },
    Математика: { topic: 'Рационал сандарға амалдар', objective: '6.1.2.13' },
    Алгебра: { topic: 'Квадрат теңдеулер', objective: '8.2.1.3' },
    Геометрия: { topic: 'Тікбұрышты үшбұрыштар және Пифагор теоремасы', objective: '8.1.1.2' },
    Информатика: { topic: 'Python тілінде циклдер мен тізімдер', objective: '8.3.3.1' },
    Химия: { topic: 'Атом құрылысы және периодтық заң', objective: '8.1.3.1' },
    Биология: { topic: 'Жасушалық тынысалу мен фотосинтез', objective: '8.1.3.3' },
    География: { topic: 'Қазақстанның климаты және табиғи аймақтары', objective: '8.3.1.4' },
    'Қазақ тілі': { topic: 'Сөзжасам және күрделі құрмалас сөйлемдер', objective: '8.4.1.1' },
    'Қазақ әдебиеті': { topic: 'Көркем шығарма композициясы мен троптар', objective: '8.2.1.1' },
    'Қазақстан тарихы': { topic: 'Қазақ хандығы және ұлт-азаттық көтерілістер', objective: '8.3.1.2' },
    'Дүниежүзі тарихы': { topic: 'Еуропадағы жаңа дәуір және ғылыми төңкеріс', objective: '8.2.1.2' },
    'Ағылшын тілі': { topic: 'Daily life, technology and complex syntax', objective: '8.3.7.1' },
  };

  const preset = sampleTopicMap[subject] || {
    topic: `${subject} бөлімі бойынша бақылау`,
    objective: '8.1.1.1',
  };

  let defaultTitle = `2-тоқсандық жиынтық бағалау (ТЖБ) — ${subject}`;
  let defaultDuration = 40;
  let defaultPoints = 20;

  if (type === 'БЖБ') {
    defaultTitle = `«${preset.topic}» бөлімі бойынша жиынтық бағалау`;
    defaultDuration = 20;
    defaultPoints = 10;
  } else if (type === 'ҚБ') {
    defaultTitle = `«${preset.topic}» — Күнделікті сабаққа қалыптастырушы бағалау (ҚБ)`;
    defaultDuration = 15;
    defaultPoints = 10;
  }

  return {
    id: `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: defaultTitle,
    type,
    subject,
    grade: 8,
    term: 2,
    unitOrTopic: preset.topic,
    learningObjectives: [preset.objective],
    durationMinutes: defaultDuration,
    targetPoints: defaultPoints,
    difficulty: 'Орташа',
    tasks: [],
    status: 'Жоба',
    author: 'Асқарова Айгүл Ерланқызы',
    schoolName: '№175 инновациялық IT-лицейі',
    instructions:
      type === 'ҚБ'
        ? 'Сабақ үстінде қалыптастырушы бағалау (1-10 балл). Деңгейлік тапсырмалар мен дескрипторларды орындаңыз.'
        : 'Тапсырмаларды мұқият орындаңыз. Әр дескриптор 1 баллмен бағаланады.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eduaccess_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Server status
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: 'checking',
    aiConfigured: false,
    model: 'gemini-3.8-flash',
  });

  const refreshStatus = async () => {
    const status = await checkServerStatus();
    setServerStatus(status);
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  // Teacher Profile
  const [teacherProfile, setTeacherProfileState] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('eduaccess_profile');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILE;
  });

  const setTeacherProfile = (profile: TeacherProfile) => {
    setTeacherProfileState(profile);
    localStorage.setItem('eduaccess_profile', JSON.stringify(profile));
    showToast('Мұғалім профилі сәтті сақталды', 'success');
  };

  // Selected Subject for teacher
  const [selectedSubject, setSelectedSubjectState] = useState<string>(() => {
    const saved = localStorage.getItem('eduaccess_selected_subject');
    if (saved) return saved;
    const profileSaved = localStorage.getItem('eduaccess_profile');
    if (profileSaved) {
      try {
        const parsed = JSON.parse(profileSaved);
        if (parsed.activeSubject) return parsed.activeSubject;
        if (parsed.subjects && parsed.subjects[0]) return parsed.subjects[0];
      } catch (e) {}
    }
    return INITIAL_TEACHER_PROFILE.subjects[0] || 'Физика';
  });

  const setSelectedSubject = (subject: string) => {
    setSelectedSubjectState(subject);
    localStorage.setItem('eduaccess_selected_subject', subject);
    setTeacherProfileState((prev) => {
      const next = {
        ...prev,
        activeSubject: subject,
        subjects: prev.subjects.includes(subject) ? prev.subjects : [subject, ...prev.subjects],
      };
      localStorage.setItem('eduaccess_profile', JSON.stringify(next));
      return next;
    });
    showToast(`Негізгі оқыту пәні «${subject}» болып таңдалды`, 'success');
  };

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3800);
  };

  // Assessments list
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('eduaccess_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_assessments', JSON.stringify(assessments));
  }, [assessments]);

  // Question Bank
  const [questionBank, setQuestionBank] = useState<Task[]>(() => {
    const saved = localStorage.getItem('eduaccess_bank');
    return saved ? JSON.parse(saved) : INITIAL_BANK_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_bank', JSON.stringify(questionBank));
  }, [questionBank]);

  // Student Results (Monitoring)
  const [studentResults, setStudentResults] = useState<StudentResult[]>(() => {
    const saved = localStorage.getItem('eduaccess_monitoring');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_RESULTS;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_monitoring', JSON.stringify(studentResults));
  }, [studentResults]);

  // Active Assessment being created or edited
  const [activeAssessment, setActiveAssessment] = useState<Assessment>(() => {
    const saved = localStorage.getItem('eduaccess_active_draft');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS[0];
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_active_draft', JSON.stringify(activeAssessment));
  }, [activeAssessment]);

  // Actions
  const createNewAssessment = (type: AssessmentType) => {
    const fresh = createDefaultAssessment(type, selectedSubject);
    setActiveAssessment(fresh);
    if (type === 'ҚБ') {
      setCurrentPage('builder-qb');
    } else if (type === 'БЖБ') {
      setCurrentPage('builder-bjb');
    } else {
      setCurrentPage('builder-tzhb');
    }
    showToast(`Жаңа ${type} (${selectedSubject}) құрастыру пішіні ашылды`, 'info');
  };

  const openAssessmentInBuilder = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    if (assessment.type === 'ҚБ') {
      setCurrentPage('builder-qb');
    } else if (assessment.type === 'БЖБ') {
      setCurrentPage('builder-bjb');
    } else {
      setCurrentPage('builder-tzhb');
    }
    showToast(`«${assessment.title}» құрастырушыға жүктелді`, 'info');
  };

  const saveCurrentAssessment = async () => {
    const updated = {
      ...activeAssessment,
      updatedAt: new Date().toISOString(),
    };
    setActiveAssessment(updated);

    setAssessments((prev) => {
      const idx = prev.findIndex((a) => a.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      } else {
        return [updated, ...prev];
      }
    });

    // Sync to server in background
    saveAssessmentToServer(updated);
    showToast(`«${updated.title}» сәтті сақталды`, 'success');
  };

  const deleteAssessment = async (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    deleteAssessmentFromServer(id);
    showToast('Бағалау сәтті жойылды', 'info');
  };

  const duplicateAssessment = (id: string) => {
    const found = assessments.find((a) => a.id === id);
    if (!found) return;

    const copy: Assessment = {
      ...found,
      id: `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${found.title} (Көшірме)`,
      status: 'Жоба',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: found.tasks.map((t) => ({
        ...t,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };

    setAssessments((prev) => [copy, ...prev]);
    showToast(`«${copy.title}» көшірмесі жасалды`, 'success');
  };

  const addToQuestionBank = async (task: Task) => {
    const bankTask: Task = {
      ...task,
      savedToBank: true,
      updatedAt: new Date().toISOString(),
    };

    setQuestionBank((prev) => {
      const idx = prev.findIndex((t) => t.id === bankTask.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = bankTask;
        return copy;
      }
      return [bankTask, ...prev];
    });

    saveBankTaskToServer(bankTask);
    showToast(`Тапсырма «Тапсырмалар банкіне» қосылды`, 'success');
  };

  const deleteFromQuestionBank = async (id: string) => {
    setQuestionBank((prev) => prev.filter((t) => t.id !== id));
    deleteBankTaskFromServer(id);
    showToast('Тапсырма банктен өшірілді', 'info');
  };

  const addTaskToActiveAssessment = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setActiveAssessment((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    showToast(`Тапсырма «${activeAssessment.type}» құрастырушысына қосылды`, 'success');
  };

  const addStudentResult = (res: StudentResult) => {
    setStudentResults((prev) => [res, ...prev]);
    showToast(`${res.studentName} оқушысының нәтижесі жазылды`, 'success');
  };

  const deleteStudentResult = (id: string) => {
    setStudentResults((prev) => prev.filter((r) => r.id !== id));
    showToast('Оқушы нәтижесі өшірілді', 'info');
  };

  // Classrooms
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('eduaccess_classrooms');
    return saved ? JSON.parse(saved) : INITIAL_CLASSROOMS;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  const addClassroom = (classroom: Classroom) => {
    setClassrooms((prev) => [classroom, ...prev]);
    showToast(`«${classroom.name} — ${classroom.subject}» сынып бумасы құрылды`, 'success');
  };

  const updateClassroom = (classroom: Classroom) => {
    setClassrooms((prev) => prev.map((c) => (c.id === classroom.id ? classroom : c)));
    showToast(`Сынып мәліметтері жаңартылды`, 'success');
  };

  const deleteClassroom = (id: string) => {
    setClassrooms((prev) => prev.filter((c) => c.id !== id));
    showToast('Сынып бумасы өшірілді', 'info');
  };

  const assignAssessmentToClass = (
    classId: string,
    assessmentId: string,
    deadline: string,
    instructions?: string
  ) => {
    const targetAss = assessments.find((a) => a.id === assessmentId);
    if (!targetAss) {
      showToast('Таңдалған бағалау жұмысы табылмады', 'error');
      return;
    }

    const assigned: AssignedAssessment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      assessmentId: targetAss.id,
      assessmentTitle: targetAss.title,
      type: targetAss.type,
      subject: targetAss.subject,
      grade: targetAss.grade,
      assignedAt: new Date().toISOString(),
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: targetAss.durationMinutes,
      totalPoints: targetAss.tasks.reduce((sum, t) => sum + (t.points || 0), 0) || targetAss.targetPoints,
      status: 'Белсенді',
      submissionsCount: 0,
      accessCode: `${targetAss.subject.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      instructions: instructions || targetAss.instructions,
    };

    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignedAssessments: [assigned, ...c.assignedAssessments],
          };
        }
        return c;
      })
    );

    showToast(`«${targetAss.title}» тапсырмасы сыныпқа сәтті тағайындалды`, 'success');
  };

  const removeAssessmentFromClass = (classId: string, assignmentId: string) => {
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignedAssessments: c.assignedAssessments.filter((a) => a.id !== assignmentId),
          };
        }
        return c;
      })
    );
    showToast('Тапсырма сынып бумасынан өшірілді', 'info');
  };

  const addStudentToClass = (classId: string, studentName: string, email?: string) => {
    const student = {
      id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: studentName.trim(),
      email: email?.trim(),
      joinedAt: new Date().toISOString(),
    };

    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            students: [...c.students, student],
          };
        }
        return c;
      })
    );
    showToast(`${student.name} оқушысы сынып тізіміне қосылды`, 'success');
  };

  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            students: c.students.filter((s) => s.id !== studentId),
          };
        }
        return c;
      })
    );
    showToast('Оқушы сыныптан өшірілді', 'info');
  };

  // User Role (Teacher or Student Portal)
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('eduaccess_user_role');
    return saved ? (saved as UserRole) : 'teacher';
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('eduaccess_user_role', role);
    showToast(
      role === 'student' ? '«Оқушы порталына» ауыстыңыз' : '«Мұғалім кабинетіне» оралдыңыз',
      'info'
    );
  };

  // Current logged in student
  const [currentStudent, setCurrentStudent] = useState<CurrentStudentUser | null>(() => {
    const saved = localStorage.getItem('eduaccess_current_student');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'st_1',
          name: 'Әлиханұлы Нұрболат',
          className: '8 "А"',
          classCode: 'EDU-8A42',
        };
  });

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('eduaccess_current_student', JSON.stringify(currentStudent));
    }
  }, [currentStudent]);

  // Submissions (Students works submitted to teacher for grading)
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem('eduaccess_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('eduaccess_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Student submits their work to teacher
  const submitStudentWork = (submission: StudentSubmission) => {
    setSubmissions((prev) => [submission, ...prev]);

    // Also update class assigned assessment submission count
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === submission.classId) {
          return {
            ...c,
            assignedAssessments: c.assignedAssessments.map((a) => {
              if (a.assessmentId === submission.assessmentId) {
                return { ...a, submissionsCount: a.submissionsCount + 1 };
              }
              return a;
            }),
          };
        }
        return c;
      })
    );

    showToast(`Жұмысыңыз мұғалімге тексеруге сәтті жіберілді!`, 'success');
  };

  // Teacher grades student work and sends result back to student
  const gradeAndSendResultToStudent = (
    submissionId: string,
    taskScores: Record<string, number>,
    taskDescriptors: Record<string, boolean[]>,
    feedback: string
  ) => {
    let updatedSub: StudentSubmission | null = null;

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const totalEarned = Object.values(taskScores).reduce((a, b) => a + b, 0);
          const percent = Math.min(100, Math.round((totalEarned / (s.maxScore || 1)) * 100));
          const level: 'Жоғары' | 'Орта' | 'Төмен' =
            percent >= 85 ? 'Жоғары' : percent >= 40 ? 'Орта' : 'Төмен';

          updatedSub = {
            ...s,
            status: 'Тексерілді',
            taskScores,
            taskDescriptorsAchieved: taskDescriptors,
            totalScore: totalEarned,
            percentage: percent,
            level,
            teacherFeedback: feedback.trim() || 'Жақсы орындалған жұмыс.',
            gradedAt: new Date().toISOString(),
          };
          return updatedSub;
        }
        return s;
      })
    );

    // Also update / insert into central studentResults for monitoring
    if (updatedSub) {
      const existingResIdx = studentResults.findIndex(
        (r) =>
          (r as any).studentName === (updatedSub as any).studentName &&
          r.assessmentId === (updatedSub as any).assessmentId
      );

      const newResultEntry: StudentResult = {
        id: `res_${Date.now()}`,
        assessmentId: (updatedSub as StudentSubmission).assessmentId,
        assessmentTitle: (updatedSub as StudentSubmission).assessmentTitle,
        subject: (updatedSub as StudentSubmission).subject,
        grade: 8,
        className: (updatedSub as StudentSubmission).className,
        studentName: (updatedSub as StudentSubmission).studentName,
        score: (updatedSub as StudentSubmission).totalScore,
        maxScore: (updatedSub as StudentSubmission).maxScore,
        percentage: (updatedSub as StudentSubmission).percentage,
        level: (updatedSub as StudentSubmission).level,
        objectiveResults: [
          { objective: 'Негізгі оқу мақсаты', achieved: (updatedSub as StudentSubmission).percentage >= 40 },
        ],
        teacherFeedback: (updatedSub as StudentSubmission).teacherFeedback,
        recordedAt: new Date().toISOString(),
      };

      if (existingResIdx >= 0) {
        setStudentResults((prev) => {
          const copy = [...prev];
          copy[existingResIdx] = newResultEntry;
          return copy;
        });
      } else {
        setStudentResults((prev) => [newResultEntry, ...prev]);
      }
    }

    showToast('Жұмыс тексеріліп, бағасы оқушыға жіберілді!', 'success');
  };

  const loadDemoData = () => {
    setAssessments(INITIAL_ASSESSMENTS);
    setQuestionBank(INITIAL_BANK_TASKS);
    setStudentResults(INITIAL_STUDENT_RESULTS);
    setActiveAssessment(INITIAL_ASSESSMENTS[0]);
    setClassrooms(INITIAL_CLASSROOMS);
    setSubmissions(INITIAL_SUBMISSIONS);
    showToast('Үлгілік қазақстандық оқу деректері сәтті жүктелді', 'success');
  };

  const clearAllData = () => {
    setAssessments([]);
    setQuestionBank([]);
    setStudentResults([]);
    setClassrooms([]);
    setSubmissions([]);
    showToast('Барлық дербес деректер тазартылды', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        assessments,
        activeAssessment,
        setActiveAssessment,
        questionBank,
        studentResults,
        teacherProfile,
        setTeacherProfile,
        darkMode,
        toggleDarkMode,
        serverStatus,
        refreshStatus,
        saveCurrentAssessment,
        deleteAssessment,
        duplicateAssessment,
        createNewAssessment,
        openAssessmentInBuilder,
        addToQuestionBank,
        deleteFromQuestionBank,
        addTaskToActiveAssessment,
        addStudentResult,
        deleteStudentResult,
        loadDemoData,
        clearAllData,
        classrooms,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        assignAssessmentToClass,
        removeAssessmentFromClass,
        addStudentToClass,
        removeStudentFromClass,
        userRole,
        setUserRole,
        currentStudent,
        setCurrentStudent,
        submissions,
        submitStudentWork,
        gradeAndSendResultToStudent,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        selectedSubject,
        setSelectedSubject,
        isSubjectModalOpen,
        setIsSubjectModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
