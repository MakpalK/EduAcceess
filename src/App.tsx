import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { AssessmentBuilder } from './components/builder/AssessmentBuilder';
import { AiTaskGenerator } from './components/generator/AiTaskGenerator';
import { QuestionBank } from './components/bank/QuestionBank';
import { Monitoring } from './components/monitoring/Monitoring';
import { MyAssessments } from './components/my-assessments/MyAssessments';
import { SettingsView } from './components/settings/SettingsView';
import { ClassroomsView } from './components/classrooms/ClassroomsView';
import { TeacherGradingView } from './components/grading/TeacherGradingView';
import { StudentPortal } from './components/student/StudentPortal';
import { SubjectSelectModal } from './components/common/SubjectSelectModal';
import { DocumentConverter } from './components/converter/DocumentConverter';
import { FormativeBuilder } from './components/formative/FormativeBuilder';

const MainContent: React.FC = () => {
  const { currentPage, userRole, isSubjectModalOpen, setIsSubjectModalOpen } = useApp();

  const renderCurrentPage = () => {
    // If student mode is active, display the student portal
    if (userRole === 'student') {
      return <StudentPortal />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'builder-qb':
        return <FormativeBuilder />;
      case 'converter':
        return <DocumentConverter />;
      case 'classrooms':
        return <ClassroomsView />;
      case 'grading':
        return <TeacherGradingView />;
      case 'builder-bjb':
        return <AssessmentBuilder type="БЖБ" />;
      case 'builder-tzhb':
        return <AssessmentBuilder type="ТЖБ" />;
      case 'ai-generator':
        return <AiTaskGenerator />;
      case 'question-bank':
        return <QuestionBank />;
      case 'monitoring':
        return <Monitoring />;
      case 'my-assessments':
        return <MyAssessments />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
        <Footer />
      </div>
      <Toast />
      <SubjectSelectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
