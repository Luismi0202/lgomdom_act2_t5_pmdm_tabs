import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TriviaQuestion, QuizResult, QuizQuestionResult } from '../models/trivia.model';
import { StatsService } from './stats.service';

export interface QuizState {
  questions: TriviaQuestion[];
  currentIndex: number;
  answers: Map<string, string>;
  isActive: boolean;
  isCompleted: boolean;
  category: string;
  difficulty: string;
}

const INITIAL_STATE: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: new Map(),
  isActive: false,
  isCompleted: false,
  category: '',
  difficulty: ''
};

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private stateSubject = new BehaviorSubject<QuizState>(INITIAL_STATE);
  public state$: Observable<QuizState> = this.stateSubject.asObservable();

  constructor(private statsService: StatsService) {}

  /**
   * Inicia un nuevo quiz
   */
  startQuiz(questions: TriviaQuestion[], category: string, difficulty: string): void {
    this.stateSubject.next({
      questions,
      currentIndex: 0,
      answers: new Map(),
      isActive: true,
      isCompleted: false,
      category,
      difficulty
    });
  }

  /**
   * Obtiene el estado actual
   */
  getState(): QuizState {
    return this.stateSubject.getValue();
  }

  /**
   * Obtiene la pregunta actual
   */
  getCurrentQuestion(): TriviaQuestion | null {
    const state = this.getState();
    return state.questions[state.currentIndex] || null;
  }

  /**
   * Responde la pregunta actual
   */
  answerQuestion(answer: string): void {
    const state = this.getState();
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion) return;

    const newAnswers = new Map(state.answers);
    newAnswers.set(currentQuestion.id, answer);

    this.stateSubject.next({
      ...state,
      answers: newAnswers
    });
  }

  /**
   * Avanza a la siguiente pregunta
   */
  nextQuestion(): boolean {
    const state = this.getState();

    if (state.currentIndex >= state.questions.length - 1) {
      return false;
    }

    this.stateSubject.next({
      ...state,
      currentIndex: state.currentIndex + 1
    });

    return true;
  }

  /**
   * Retrocede a la pregunta anterior
   */
  previousQuestion(): boolean {
    const state = this.getState();

    if (state.currentIndex <= 0) {
      return false;
    }

    this.stateSubject.next({
      ...state,
      currentIndex: state.currentIndex - 1
    });

    return true;
  }

  /**
   * Finaliza el quiz y calcula resultados
   */
  finishQuiz(): QuizResult {
    const state = this.getState();
    const questionResults: QuizQuestionResult[] = [];
    let correctAnswers = 0;

    state.questions.forEach(question => {
      const userAnswer = state.answers.get(question.id) || '';
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      questionResults.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      date: new Date(),
      category: state.category,
      difficulty: state.difficulty,
      totalQuestions: state.questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / state.questions.length) * 100),
      questions: questionResults
    };

    // Guardar resultado en estadísticas
    this.statsService.addResult(result);

    // Marcar quiz como completado
    this.stateSubject.next({
      ...state,
      isActive: false,
      isCompleted: true
    });

    return result;
  }

  /**
   * Reinicia el quiz
   */
  resetQuiz(): void {
    this.stateSubject.next(INITIAL_STATE);
  }

  /**
   * Verifica si todas las preguntas han sido respondidas
   */
  allQuestionsAnswered(): boolean {
    const state = this.getState();
    return state.answers.size === state.questions.length;
  }

  /**
   * Obtiene el progreso del quiz
   */
  getProgress(): { current: number; total: number; percentage: number } {
    const state = this.getState();
    const current = state.currentIndex + 1;
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return { current, total, percentage };
  }
}
