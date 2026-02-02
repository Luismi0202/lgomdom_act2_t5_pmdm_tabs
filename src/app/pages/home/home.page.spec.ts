import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SettingsService } from '../../core/services/settings.service';
import { StatsService } from '../../core/services/stats.service';
import { QuizService } from '../../core/services/quiz.service';
import { of, BehaviorSubject } from 'rxjs';
import { AppSettings, TriviaCategory, UserStats } from '../../core/models/trivia.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockStatsService: jasmine.SpyObj<StatsService>;

  const mockCategories: TriviaCategory[] = [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' }
  ];

  const mockStats: UserStats = {
    totalQuizzes: 5,
    totalQuestions: 50,
    totalCorrect: 40,
    averageScore: 80,
    bestScore: 100,
    favoriteCategory: 'Science',
    quizzesByDifficulty: { easy: 2, medium: 2, hard: 1 }
  };

  const mockSettings: AppSettings = {
    darkMode: false,
    soundEnabled: true,
    defaultDifficulty: 'any',
    defaultQuestionCount: 10,
    username: 'TestPlayer'
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockApiService = jasmine.createSpyObj('ApiService', ['getCategories']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getSettings'], {
      settings$: new BehaviorSubject<AppSettings>(mockSettings)
    });
    mockStatsService = jasmine.createSpyObj('StatsService', ['calculateStats']);

    mockApiService.getCategories.and.returnValue(of(mockCategories));
    mockStatsService.calculateStats.and.returnValue(mockStats);

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ApiService, useValue: mockApiService },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: QuizService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockApiService.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('should load stats on init', () => {
    expect(mockStatsService.calculateStats).toHaveBeenCalled();
    expect(component.stats).toEqual(mockStats);
  });

  it('should navigate to search on startQuickQuiz', () => {
    component.startQuickQuiz();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/search']);
  });

  it('should navigate to search with category params', () => {
    const category = { id: 9, name: 'General Knowledge' };
    component.startCategoryQuiz(category);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/search'], {
      queryParams: { categoryId: 9, categoryName: 'General Knowledge' }
    });
  });

  it('should return correct greeting based on time', () => {
    const greeting = component.getGreeting();
    expect(greeting).toMatch(/Buenos días|Buenas tardes|Buenas noches/);
  });

  it('should display featured categories (max 6)', () => {
    expect(component.featuredCategories.length).toBeLessThanOrEqual(6);
  });
});
