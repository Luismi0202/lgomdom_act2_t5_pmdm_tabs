import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from '../models/trivia.model';

const STORAGE_KEY = 'trivia_settings';

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  soundEnabled: true,
  defaultDifficulty: 'any',
  defaultQuestionCount: 10,
  username: 'Player'
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<AppSettings>(DEFAULT_SETTINGS);
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Obtiene la configuración actual
   */
  getSettings(): AppSettings {
    return this.settingsSubject.getValue();
  }

  /**
   * Actualiza la configuración
   */
  updateSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(updatedSettings);
    this.saveToStorage(updatedSettings);

    // Aplicar modo oscuro si cambió
    if (settings.darkMode !== undefined) {
      this.applyDarkMode(settings.darkMode);
    }
  }

  /**
   * Obtiene un valor específico de configuración
   */
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.getSettings()[key];
  }

  /**
   * Restablece la configuración por defecto
   */
  resetToDefault(): void {
    this.settingsSubject.next(DEFAULT_SETTINGS);
    this.saveToStorage(DEFAULT_SETTINGS);
    this.applyDarkMode(DEFAULT_SETTINGS.darkMode);
  }

  /**
   * Aplica el modo oscuro al documento
   */
  applyDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark', enabled);
  }

  /**
   * Carga la configuración desde localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored) as AppSettings;
        const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
        this.settingsSubject.next(mergedSettings);
        this.applyDarkMode(mergedSettings.darkMode);
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      this.settingsSubject.next(DEFAULT_SETTINGS);
    }
  }

  /**
   * Guarda la configuración en localStorage
   */
  private saveToStorage(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  }
}
