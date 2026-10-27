import { Assessment, Task, StudentResult, AiTaskGenerateRequest } from '../types';

export interface ServerStatus {
  status: string;
  aiConfigured: boolean;
  model: string;
}

export async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (e) {
    return {
      status: 'offline',
      aiConfigured: false,
      model: 'gemini-3.8-flash',
    };
  }
}

export async function generateAiTasksApi(request: AiTaskGenerateRequest): Promise<{
  success: boolean;
  tasks?: Task[];
  error?: string;
  isMissingKey?: boolean;
}> {
  try {
    const res = await fetch('/api/ai/generate-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Тапсырма генерациялау сәтсіз аяқталды',
        isMissingKey: data.isMissingKey || res.status === 503,
      };
    }

    return {
      success: true,
      tasks: data.tasks || [],
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || 'Сервермен байланыс орнату мүмкін болмады',
    };
  }
}

export async function fetchServerAssessments(): Promise<Assessment[]> {
  try {
    const res = await fetch('/api/assessments');
    if (!res.ok) return [];
    const data = await res.json();
    return data.assessments || [];
  } catch (e) {
    return [];
  }
}

export async function saveAssessmentToServer(assessment: Assessment): Promise<boolean> {
  try {
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function deleteAssessmentFromServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/assessments/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function fetchServerBankTasks(): Promise<Task[]> {
  try {
    const res = await fetch('/api/bank');
    if (!res.ok) return [];
    const data = await res.json();
    return data.tasks || [];
  } catch (e) {
    return [];
  }
}

export async function saveBankTaskToServer(task: Task): Promise<boolean> {
  try {
    const res = await fetch('/api/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function deleteBankTaskFromServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/bank/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function convertDocumentApi(
  req: import('../types').ConvertDocumentRequest
): Promise<{
  success: boolean;
  result?: import('../types').ConvertedAssessmentResult;
  error?: string;
  isFallback?: boolean;
}> {
  try {
    const res = await fetch('/api/ai/convert-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    const data = await res.json();
    if (!res.ok && !data.result) {
      return {
        success: false,
        error: data.message || data.error || 'Құжатты түрлендіру сәтсіз аяқталды',
      };
    }

    return {
      success: true,
      result: data.result,
      isFallback: data.isFallback,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || 'Сервермен байланыс орнату кезінде қате орын алды',
    };
  }
}

