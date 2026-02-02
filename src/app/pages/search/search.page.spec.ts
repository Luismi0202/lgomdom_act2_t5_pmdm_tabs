import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchPage } from './search.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { QuizService, QuizState } from '../../core/services/quiz.service';
import { FavoritesStore } from '../../core/services/favorites.store';
import { SettingsService } from '../../core/services/settings.service';
import { of, BehaviorSubject } from 'rxjs';
import { TriviaCategory, TriviaQuestion, AppSettings } from '../../core/models/trivia.model';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockQuizService: jasmine.SpyObj<QuizService>;
  let mockFavoritesStore: jasmine.SpyObj<FavoritesStore>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let quizStateSubject: BehaviorSubject<QuizState>;

  const mockCategories: TriviaCategory[] = [
    { id: 9, name: 'General Knowledge' }
  ];

  const mockQuestions: TriviaQuestion[] = [
    {
      id: 'q1',
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Test?',
      correctAnswer: 'A',
      incorrectAnswers: ['B', 'C', 'D'],
      allAnswers: ['A', 'B', 'C', 'D']
    }
  ];

  const initialState: QuizState = {
    questions: [],
    currentIndex: 0,
    answers: new Map(),
    isActive: false,
    isCompleted: false,
    category: '',
    difficulty: ''
  };

  beforeEach(async () => {
    quizStateSubject = new BehaviorSubject<QuizState>(initialState);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockApiService = jasmine.createSpyObj('ApiService', ['getCategories', 'getQuestions']);
    mockQuizService = jasmine.createSpyObj('QuizService', [
      'startQuiz', 'getState', 'getCurrentQuestion', 'answerQuestion',
      'nextQuestion', 'previousQuestion', 'finishQuiz', 'resetQuiz',
      'allQuestionsAnswered', 'getProgress'
    ], { state$: quizStateSubject.asObservable() });
    mockFavoritesStore = jasmine.createSpyObj('FavoritesStore', ['add', 'remove', 'exists']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getSettings']);

    mockApiService.getCategories.and.returnValue(of(mockCategories));
    mockApiService.getQuestions.and.returnValue(of(mockQuestions));
    mockSettingsService.getSettings.and.returnValue({
      darkMode: false,
      soundEnabled: true,
      defaultDifficulty: 'any',
      defaultQuestionCount: 10,
      username: 'Player'
    });
    mockQuizService.getProgress.and.returnValue({ current: 1, total: 1, percentage: 100 });
    mockQuizService.allQuestionsAnswered.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }
        },
        { provide: ApiService, useValue: mockApiService },
        { provide: QuizService, useValue: mockQuizService },
        { provide: FavoritesStore, useValue: mockFavoritesStore },
        { provide: SettingsService, useValue: mockSettingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(mockApiService.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
  });

  it('should load default settings on init', () => {
    expect(mockSettingsService.getSettings).toHaveBeenCalled();
    expect(component.selectedDifficulty).toBe('any');
  });

  it('should start quiz when startQuiz is called', fakeAsync(() => {
    component.startQuiz();
    tick();
    expect(mockApiService.getQuestions).toHaveBeenCalled();
  }));

  it('should call quizService.answerQuestion on selectAnswer', () => {
    component.selectAnswer('A');
    expect(mockQuizService.answerQuestion).toHaveBeenCalledWith('A');
    expect(component.selectedAnswer).toBe('A');
  });

  it('should toggle favorite correctly', () => {
    mockFavoritesStore.exists.and.returnValue(false);
    component.toggleFavorite(mockQuestions[0]);
    expect(mockFavoritesStore.add).toHaveBeenCalledWith(mockQuestions[0]);

    mockFavoritesStore.exists.and.returnValue(true);
    component.toggleFavorite(mockQuestions[0]);
    expect(mockFavoritesStore.remove).toHaveBeenCalledWith('q1');
  });

  it('should reset quiz and return to setup view', () => {
    component.view = 'result';
    component.resetQuiz();
    expect(mockQuizService.resetQuiz).toHaveBeenCalled();
    expect(component.view).toBe('setup');
  });

  it('should return correct score color', () => {
    component.quizResult = { score: 85 } as any;
    expect(component.getScoreColor()).toBe('success');

    component.quizResult = { score: 60 } as any;
    expect(component.getScoreColor()).toBe('warning');

    component.quizResult = { score: 30 } as any;
    expect(component.getScoreColor()).toBe('danger');
  });
});
