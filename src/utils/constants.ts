// Question Status Types
export enum QuestionStatus {
  NOT_VISITED = 'not-visited',
  VISITED = 'visited',
  ANSWERED = 'answered',
  MARKED = 'marked',
  ANSWERED_MARKED = 'answered-marked',
}

// Question Status Labels
export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  [QuestionStatus.NOT_VISITED]: 'Not Visited',
  [QuestionStatus.VISITED]: 'Not Answered',
  [QuestionStatus.ANSWERED]: 'Answered',
  [QuestionStatus.MARKED]: 'Marked for Review',
  [QuestionStatus.ANSWERED_MARKED]: 'Answered & Marked for Review',
};

// Question Status Colors
export const QUESTION_STATUS_COLORS: Record<QuestionStatus, string> = {
  [QuestionStatus.NOT_VISITED]: 'question-status-not-visited',
  [QuestionStatus.VISITED]: 'question-status-visited',
  [QuestionStatus.ANSWERED]: 'question-status-answered',
  [QuestionStatus.MARKED]: 'question-status-marked',
  [QuestionStatus.ANSWERED_MARKED]: 'question-status-answered-marked',
};

// Option Labels
export const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// Test Status
export enum TestStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
}

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
}

// Routes
export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CREATE_TEST: '/admin/create-test',
  ADMIN_MANAGE_TESTS: '/admin/manage-tests',
  ADMIN_EDIT_TEST: '/admin/edit-test',
  ADMIN_PUBLISH_TEST: '/admin/publish-test',
  
  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_TEST_LIST: '/student/tests',
  STUDENT_CBT_TEST: '/student/test',
};

// Sidebar Menu Items
export const ADMIN_MENU_ITEMS = [
  { title: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'LayoutDashboard' },
  { title: 'Create Test', path: ROUTES.ADMIN_CREATE_TEST, icon: 'FilePlus' },
  { title: 'Manage Tests', path: ROUTES.ADMIN_MANAGE_TESTS, icon: 'FolderOpen' },
  { title: 'Students', path: '/admin/students', icon: 'Users' },
  { title: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

export const STUDENT_MENU_ITEMS = [
  { title: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: 'LayoutDashboard' },
  { title: 'Available Tests', path: ROUTES.STUDENT_TEST_LIST, icon: 'FileText' },
  { title: 'My Results', path: '/student/results', icon: 'BarChart3' },
  { title: 'Settings', path: '/student/settings', icon: 'Settings' },
];
