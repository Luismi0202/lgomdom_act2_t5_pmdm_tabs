import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { AppSettings } from '../models/trivia.model';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: Default settings
  it('should have default settings', () => {
    const settings = service.getSettings();
    expect(settings.darkMode).toBe(false);
    expect(settings.soundEnabled).toBe(true);
    expect(settings.defaultDifficulty).toBe('any');
    expect(settings.defaultQuestionCount).toBe(10);
    expect(settings.username).toBe('Player');
  });

  // Test 2: Update settings
  it('should update settings partially', () => {
    service.updateSettings({ darkMode: true });
    expect(service.getSettings().darkMode).toBe(true);
    expect(service.getSettings().soundEnabled).toBe(true); // unchanged
  });

  // Test 3: Get specific setting
  it('should get specific setting value', () => {
    expect(service.getSetting('username')).toBe('Player');
    service.updateSettings({ username: 'TestUser' });
    expect(service.getSetting('username')).toBe('TestUser');
  });

  // Test 4: Reset to default
  it('should reset settings to default', () => {
    service.updateSettings({ darkMode: true, username: 'Changed' });
    service.resetToDefault();
    expect(service.getSettings().darkMode).toBe(false);
    expect(service.getSettings().username).toBe('Player');
  });

  // Test 5: Apply dark mode
  it('should apply dark mode to body', () => {
    service.applyDarkMode(true);
    expect(document.body.classList.contains('dark')).toBe(true);
    service.applyDarkMode(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  // Test 6: Persistence
  it('should persist settings to localStorage', () => {
    service.updateSettings({ username: 'Persisted' });
    const stored = localStorage.getItem('trivia_settings');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).username).toBe('Persisted');
  });

  // Test 7: Load from localStorage
  it('should load settings from localStorage on init', () => {
    const savedSettings: AppSettings = {
      darkMode: true,
      soundEnabled: false,
      defaultDifficulty: 'hard',
      defaultQuestionCount: 15,
      username: 'Loaded'
    };
    localStorage.setItem('trivia_settings', JSON.stringify(savedSettings));

    const newService = new SettingsService();
    expect(newService.getSettings().username).toBe('Loaded');
    expect(newService.getSettings().darkMode).toBe(true);
  });

  // Test 8: Observable emits changes
  it('should emit settings through observable', (done) => {
    let emitCount = 0;
    service.settings$.subscribe(settings => {
      emitCount++;
      if (emitCount === 2) {
        expect(settings.username).toBe('Observable');
        done();
      }
    });
    service.updateSettings({ username: 'Observable' });
  });
});
