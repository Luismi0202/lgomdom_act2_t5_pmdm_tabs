import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizResult, UserStats } from '../models/trivia.model';

const STORAGE_KEY = 'trivia_stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);
  public results$: Observable<QuizResult[]> = this.resultsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Obtiene todos los resultados
   */
  getResults(): QuizResult[] {
    return this.resultsSubject.getValue();
  }

  /**
   * Agrega un nuevo resultado de quiz
   */
  addResult(result: QuizResult): void {
    const results = this.getResults();
    const updatedResults = [result, ...results];
    this.resultsSubject.next(updatedResults);
    this.saveToStorage(updatedResults);
  }

  /**
   * Obtiene un resultado por ID
   */
  getResultById(id: string): QuizResult | undefined {
    return this.getResults().find(r => r.id === id);
  }

  /**
   * Calcula las estadísticas del usuario
   */
  calculateStats(): UserStats {
    const results = this.getResults();

    if (results.length === 0) {
      return this.getEmptyStats();
    }

    const totalQuizzes = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const bestScore = Math.max(...results.map(r => r.score));

    // Calcular categoría favorita
    const categoryCount: { [key: string]: number } = {};
    results.forEach(r => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });
    const favoriteCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Quizzes por dificultad
    const quizzesByDifficulty = {
      easy: results.filter(r => r.difficulty === 'easy').length,
      medium: results.filter(r => r.difficulty === 'medium').length,
      hard: results.filter(r => r.difficulty === 'hard').length
    };

    return {
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      averageScore: Math.round(averageScore * 100) / 100,
      bestScore,
      favoriteCategory,
      quizzesByDifficulty
    };
  }

  /**
   * Obtiene estadísticas vacías
   */
  getEmptyStats(): UserStats {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageScore: 0,
      bestScore: 0,
      favoriteCategory: 'N/A',
      quizzesByDifficulty: { easy: 0, medium: 0, hard: 0 }
    };
  }

  /**
   * Limpia todas las estadísticas
   */
  clearStats(): void {
    this.resultsSubject.next([]);
    this.saveToStorage([]);
  }

  /**
   * Carga los resultados desde localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const results = JSON.parse(stored) as QuizResult[];
        this.resultsSubject.next(results);
      }
    } catch (error) {
      console.error('Error loading stats from storage:', error);
      this.resultsSubject.next([]);
    }
  }

  /**
   * Guarda los resultados en localStorage
   */
  private saveToStorage(results: QuizResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving stats to storage:', error);
    }
  }
}
