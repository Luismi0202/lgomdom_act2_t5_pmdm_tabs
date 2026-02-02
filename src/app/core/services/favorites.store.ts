import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TriviaQuestion } from '../models/trivia.model';

const STORAGE_KEY = 'trivia_favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoritesStore {
  private favoritesSubject = new BehaviorSubject<TriviaQuestion[]>([]);
  public favorites$: Observable<TriviaQuestion[]> = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Obtiene los favoritos actuales
   */
  getFavorites(): TriviaQuestion[] {
    return this.favoritesSubject.getValue();
  }

  /**
   * Agrega una pregunta a favoritos
   */
  add(question: TriviaQuestion): boolean {
    const favorites = this.getFavorites();

    // Evita duplicados
    if (this.exists(question.id)) {
      return false;
    }

    const updatedFavorites = [...favorites, question];
    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
    return true;
  }

  /**
   * Elimina una pregunta de favoritos
   */
  remove(questionId: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(q => q.id === questionId);

    if (index === -1) {
      return false;
    }

    const updatedFavorites = favorites.filter(q => q.id !== questionId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
    return true;
  }

  /**
   * Verifica si una pregunta ya está en favoritos
   */
  exists(questionId: string): boolean {
    return this.getFavorites().some(q => q.id === questionId);
  }

  /**
   * Limpia todos los favoritos
   */
  clear(): void {
    this.favoritesSubject.next([]);
    this.saveToStorage([]);
  }

  /**
   * Obtiene el número de favoritos
   */
  getCount(): number {
    return this.getFavorites().length;
  }

  /**
   * Carga los favoritos desde localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored) as TriviaQuestion[];
        this.favoritesSubject.next(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesSubject.next([]);
    }
  }

  /**
   * Guarda los favoritos en localStorage
   */
  private saveToStorage(favorites: TriviaQuestion[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}
