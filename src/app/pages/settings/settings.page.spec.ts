import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { SettingsService } from '../../core/services/settings.service';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '../../core/models/trivia.model';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockPlatform: jasmine.SpyObj<Platform>;
  let settingsSubject: BehaviorSubject<AppSettings>;

  const defaultSettings: AppSettings = {
    darkMode: false,
    soundEnabled: true,
    defaultDifficulty: 'any',
    defaultQuestionCount: 10,
    username: 'Player'
  };

  beforeEach(async () => {
    settingsSubject = new BehaviorSubject<AppSettings>(defaultSettings);
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['updateSettings', 'resetToDefault'], {
      settings$: settingsSubject.asObservable()
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavController = jasmine.createSpyObj('NavController', ['back', 'navigateBack']);
    mockPlatform = jasmine.createSpyObj('Platform', ['backButton'], {
      backButton: { subscribeWithPriority: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: Router, useValue: mockRouter },
        { provide: NavController, useValue: mockNavController },
        { provide: Platform, useValue: mockPlatform }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load settings on init', () => {
    expect(component.settings).toEqual(defaultSettings);
  });

  it('should update dark mode setting', () => {
    component.onDarkModeChange({ detail: { checked: true } });
    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({ darkMode: true });
  });

  it('should update sound setting', () => {
    component.onSoundChange({ detail: { checked: false } });
    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({ soundEnabled: false });
  });

  it('should update difficulty setting', () => {
    component.onDifficultyChange({ detail: { value: 'hard' } });
    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({ defaultDifficulty: 'hard' });
  });

  it('should update question count setting', () => {
    component.onQuestionCountChange({ detail: { value: 15 } });
    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({ defaultQuestionCount: 15 });
  });

  it('should reset settings to default', () => {
    component.resetSettings();
    expect(mockSettingsService.resetToDefault).toHaveBeenCalled();
  });

  it('should navigate back to profile', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/profile']);
  });
});
