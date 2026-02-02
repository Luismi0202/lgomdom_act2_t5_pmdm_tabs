import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { StatsService } from '../../core/services/stats.service';
import { BehaviorSubject } from 'rxjs';
import { AppSettings, UserStats } from '../../core/models/trivia.model';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockStatsService: jasmine.SpyObj<StatsService>;
  let settingsSubject: BehaviorSubject<AppSettings>;

  const mockSettings: AppSettings = {
    darkMode: false,
    soundEnabled: true,
    defaultDifficulty: 'any',
    defaultQuestionCount: 10,
    username: 'TestPlayer'
  };

  const mockStats: UserStats = {
    totalQuizzes: 5,
    totalQuestions: 50,
    totalCorrect: 40,
    averageScore: 80,
    bestScore: 100,
    favoriteCategory: 'Science',
    quizzesByDifficulty: { easy: 2, medium: 2, hard: 1 }
  };

  beforeEach(async () => {
    settingsSubject = new BehaviorSubject<AppSettings>(mockSettings);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getSettings'], {
      settings$: settingsSubject.asObservable()
    });
    mockStatsService = jasmine.createSpyObj('StatsService', ['calculateStats']);
    mockStatsService.calculateStats.and.returnValue(mockStats);

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: StatsService, useValue: mockStatsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load settings on init', () => {
    expect(component.settings).toEqual(mockSettings);
  });

  it('should load stats on init', () => {
    expect(mockStatsService.calculateStats).toHaveBeenCalled();
    expect(component.stats).toEqual(mockStats);
  });

  it('should navigate to settings on goToSettings', () => {
    component.goToSettings();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should return correct level based on quizzes', () => {
    component.stats = { ...mockStats, totalQuizzes: 0 };
    expect(component.getLevel()).toBe('Novato');

    component.stats = { ...mockStats, totalQuizzes: 5 };
    expect(component.getLevel()).toBe('Intermedio');

    component.stats = { ...mockStats, totalQuizzes: 10 };
    expect(component.getLevel()).toBe('Avanzado');

    component.stats = { ...mockStats, totalQuizzes: 20 };
    expect(component.getLevel()).toBe('Experto');

    component.stats = { ...mockStats, totalQuizzes: 50 };
    expect(component.getLevel()).toBe('Maestro');
  });

  it('should return correct level color', () => {
    component.stats = { ...mockStats, totalQuizzes: 50 };
    expect(component.getLevelColor()).toBe('danger');

    component.stats = { ...mockStats, totalQuizzes: 20 };
    expect(component.getLevelColor()).toBe('warning');

    component.stats = { ...mockStats, totalQuizzes: 10 };
    expect(component.getLevelColor()).toBe('success');
  });
});
