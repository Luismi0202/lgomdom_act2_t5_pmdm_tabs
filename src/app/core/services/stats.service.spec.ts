import { TestBed } from '@angular/core/testing';
import { StatsService } from './stats.service';
import { QuizResult } from '../models/trivia.model';

describe('StatsService', () => {
  let service: StatsService;

  const mockResult: QuizResult = {
    id: 'result-1',
    date: new Date(),
    category: 'Science',
    difficulty: 'medium',
    totalQuestions: 10,
    correctAnswers: 8,
    score: 80,
    questions: []
  };

  const mockResult2: QuizResult = {
    ...mockResult,
    id: 'result-2',
    category: 'History',
    difficulty: 'hard',
    correctAnswers: 5,
    score: 50
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [StatsService]
    });
    service = TestBed.inject(StatsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: Add result
  it('should add a quiz result', () => {
    service.addResult(mockResult);
    expect(service.getResults().length).toBe(1);
  });

  // Test 2: Get result by ID
  it('should get result by ID', () => {
    service.addResult(mockResult);
    const found = service.getResultById('result-1');
    expect(found).toBeTruthy();
    expect(found?.category).toBe('Science');
  });

  // Test 3: Calculate stats - total quizzes
  it('should calculate total quizzes correctly', () => {
    service.addResult(mockResult);
    service.addResult(mockResult2);
    const stats = service.calculateStats();
    expect(stats.totalQuizzes).toBe(2);
  });

  // Test 4: Calculate stats - average score
  it('should calculate average score correctly', () => {
    service.addResult(mockResult);
    service.addResult(mockResult2);
    const stats = service.calculateStats();
    // (8 + 5) / (10 + 10) * 100 = 65
    expect(stats.averageScore).toBe(65);
  });

  // Test 5: Calculate stats - best score
  it('should calculate best score correctly', () => {
    service.addResult(mockResult);
    service.addResult(mockResult2);
    const stats = service.calculateStats();
    expect(stats.bestScore).toBe(80);
  });

  // Test 6: Calculate stats - favorite category
  it('should identify favorite category', () => {
    service.addResult(mockResult);
    service.addResult({ ...mockResult, id: 'r2' });
    service.addResult(mockResult2);
    const stats = service.calculateStats();
    expect(stats.favoriteCategory).toBe('Science');
  });

  // Test 7: Empty stats
  it('should return empty stats when no results', () => {
    const stats = service.calculateStats();
    expect(stats.totalQuizzes).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.bestScore).toBe(0);
  });

  // Test 8: Clear stats
  it('should clear all stats', () => {
    service.addResult(mockResult);
    service.clearStats();
    expect(service.getResults().length).toBe(0);
  });

  // Test 9: Quizzes by difficulty
  it('should count quizzes by difficulty', () => {
    service.addResult(mockResult);
    service.addResult(mockResult2);
    const stats = service.calculateStats();
    expect(stats.quizzesByDifficulty.medium).toBe(1);
    expect(stats.quizzesByDifficulty.hard).toBe(1);
    expect(stats.quizzesByDifficulty.easy).toBe(0);
  });

  // Test 10: Persistence
  it('should persist results to localStorage', () => {
    service.addResult(mockResult);
    const stored = localStorage.getItem('trivia_stats');
    expect(stored).toBeTruthy();
  });
});
