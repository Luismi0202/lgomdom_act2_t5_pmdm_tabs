import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { FavoritesStore } from '../../core/services/favorites.store';
import { BehaviorSubject } from 'rxjs';
import { TriviaQuestion } from '../../core/models/trivia.model';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;
  let mockFavoritesStore: jasmine.SpyObj<FavoritesStore>;
  let favoritesSubject: BehaviorSubject<TriviaQuestion[]>;

  const mockFavorites: TriviaQuestion[] = [
    {
      id: 'q1',
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Test question?',
      correctAnswer: 'Correct',
      incorrectAnswers: ['Wrong1', 'Wrong2', 'Wrong3'],
      allAnswers: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3']
    }
  ];

  beforeEach(async () => {
    favoritesSubject = new BehaviorSubject<TriviaQuestion[]>(mockFavorites);
    mockFavoritesStore = jasmine.createSpyObj('FavoritesStore', ['remove', 'clear'], {
      favorites$: favoritesSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        { provide: FavoritesStore, useValue: mockFavoritesStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites on init', () => {
    expect(component.favorites.length).toBe(1);
    expect(component.favorites[0].id).toBe('q1');
  });

  it('should remove favorite when removeFavorite is called', () => {
    component.removeFavorite(mockFavorites[0]);
    expect(mockFavoritesStore.remove).toHaveBeenCalledWith('q1');
  });

  it('should clear all favorites', () => {
    component.clearAllFavorites();
    expect(mockFavoritesStore.clear).toHaveBeenCalled();
  });

  it('should return correct difficulty color', () => {
    expect(component.getDifficultyColor('easy')).toBe('success');
    expect(component.getDifficultyColor('medium')).toBe('warning');
    expect(component.getDifficultyColor('hard')).toBe('danger');
    expect(component.getDifficultyColor('unknown')).toBe('medium');
  });

  it('should update favorites when observable emits', () => {
    const newFavorites = [...mockFavorites, { ...mockFavorites[0], id: 'q2' }];
    favoritesSubject.next(newFavorites);
    expect(component.favorites.length).toBe(2);
  });
});
