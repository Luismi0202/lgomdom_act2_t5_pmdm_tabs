import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsPage } from './stats.page';
import { Router } from '@angular/router';
import { StatsService } from '../../core/services/stats.service';
import { BehaviorSubject } from 'rxjs';
import { QuizResult, UserStats } from '../../core/models/trivia.model';

describe('StatsPage', () => {
  let component: StatsPage;
  let fixture: ComponentFixture<StatsPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStatsService: jasmine.SpyObj<StatsService>;
  let resultsSubject: BehaviorSubject<QuizResult[]>;

  const mockStats: UserStats = {
    totalQuizzes: 5,
    totalQuestions: 50,
    totalCorrect: 40,
    averageScore: 80,
    bestScore: 100,
    favoriteCategory: 'Science',
    quizzesByDifficulty: { easy: 2, medium: 2, hard: 1 }
  };

  const mockResults: QuizResult[] = [
    {
      id: 'r1',
      date: new Date(),
      category: 'Science',
      difficulty: 'easy',
      totalQuestions: 10,
      correctAnswers: 8,
      score: 80,
      questions: []
    }
  ];

  beforeEach(async () => {
    resultsSubject = new BehaviorSubject<QuizResult[]>(mockResults);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStatsService = jasmine.createSpyObj('StatsService', ['calculateStats', 'clearStats'], {
      results$: resultsSubject.asObservable()
    });
    mockStatsService.calculateStats.and.returnValue(mockStats);

    await TestBed.configureTestingModule({
      imports: [StatsPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StatsService, useValue: mockStatsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(mockStatsService.calculateStats).toHaveBeenCalled();
    expect(component.stats).toEqual(mockStats);
  });

  it('should load recent results on init', () => {
    expect(component.recentResults.length).toBe(1);
  });

  it('should navigate to detail page on viewResultDetail', () => {
    component.viewResultDetail(mockResults[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detail', 'r1']);
  });

  it('should clear all stats', () => {
    component.clearAllStats();
    expect(mockStatsService.clearStats).toHaveBeenCalled();
  });

  it('should return correct score color', () => {
    expect(component.getScoreColor(85)).toBe('success');
    expect(component.getScoreColor(60)).toBe('warning');
    expect(component.getScoreColor(30)).toBe('danger');
  });

  it('should return correct difficulty color', () => {
    expect(component.getDifficultyColor('easy')).toBe('success');
    expect(component.getDifficultyColor('medium')).toBe('warning');
    expect(component.getDifficultyColor('hard')).toBe('danger');
  });

  it('should format date correctly', () => {
    const date = new Date('2026-02-02T14:30:00');
    const formatted = component.formatDate(date);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
});
