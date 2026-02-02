import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPage } from './detail.page';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { StatsService } from '../../core/services/stats.service';
import { NavController, Platform } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { QuizResult } from '../../core/models/trivia.model';

describe('DetailPage', () => {
  let component: DetailPage;
  let fixture: ComponentFixture<DetailPage>;
  let mockStatsService: jasmine.SpyObj<StatsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockPlatform: jasmine.SpyObj<Platform>;

  const mockResult: QuizResult = {
    id: 'test-result-1',
    date: new Date(),
    category: 'Science',
    difficulty: 'medium',
    totalQuestions: 5,
    correctAnswers: 4,
    score: 80,
    questions: [
      {
        question: 'Test question?',
        userAnswer: 'Correct',
        correctAnswer: 'Correct',
        isCorrect: true
      }
    ]
  };

  beforeEach(async () => {
    mockStatsService = jasmine.createSpyObj('StatsService', ['getResultById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavController = jasmine.createSpyObj('NavController', ['back', 'navigateBack']);
    mockPlatform = jasmine.createSpyObj('Platform', ['backButton'], {
      backButton: { subscribeWithPriority: jasmine.createSpy() }
    });
    mockStatsService.getResultById.and.returnValue(mockResult);

    await TestBed.configureTestingModule({
      imports: [DetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'test-result-1' }))
          }
        },
        { provide: StatsService, useValue: mockStatsService },
        { provide: Router, useValue: mockRouter },
        { provide: NavController, useValue: mockNavController },
        { provide: Platform, useValue: mockPlatform }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load result from route parameter', () => {
    expect(mockStatsService.getResultById).toHaveBeenCalledWith('test-result-1');
    expect(component.result).toEqual(mockResult);
  });

  it('should return correct score color for high score', () => {
    component.result = { ...mockResult, score: 85 };
    expect(component.getScoreColor()).toBe('success');
  });

  it('should return warning color for medium score', () => {
    component.result = { ...mockResult, score: 60 };
    expect(component.getScoreColor()).toBe('warning');
  });

  it('should return danger color for low score', () => {
    component.result = { ...mockResult, score: 30 };
    expect(component.getScoreColor()).toBe('danger');
  });

  it('should navigate back to stats on goBack', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/stats']);
  });

  it('should return correct difficulty color', () => {
    component.result = { ...mockResult, difficulty: 'easy' };
    expect(component.getDifficultyColor()).toBe('success');

    component.result = { ...mockResult, difficulty: 'hard' };
    expect(component.getDifficultyColor()).toBe('danger');
  });
});
