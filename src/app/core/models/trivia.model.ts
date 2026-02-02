// Modelo de respuesta de la API Open Trivia DB
export interface TriviaApiResponse {
  response_code: number;
  results: TriviaApiQuestion[];
}

export interface TriviaApiQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Modelo interno de la aplicación
export interface TriviaQuestion {
  id: string;
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface TriviaCategory {
  id: number;
  name: string;
}

export interface TriviaCategoriesResponse {
  trivia_categories: TriviaCategory[];
}

export interface QuizResult {
  id: string;
  date: Date;
  category: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  questions: QuizQuestionResult[];
}

export interface QuizQuestionResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  bestScore: number;
  favoriteCategory: string;
  quizzesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  defaultDifficulty: 'easy' | 'medium' | 'hard' | 'any';
  defaultQuestionCount: number;
  username: string;
}
