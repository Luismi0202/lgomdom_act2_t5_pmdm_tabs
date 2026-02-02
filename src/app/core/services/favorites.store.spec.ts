import { TestBed } from '@angular/core/testing';
import { FavoritesStore } from './favorites.store';
import { TriviaQuestion } from '../models/trivia.model';

describe('FavoritesStore', () => {
  let store: FavoritesStore;

  const mockQuestion: TriviaQuestion = {
    id: 'test-1',
    category: 'Science',
    type: 'multiple',
    difficulty: 'easy',
    question: 'Test question?',
    correctAnswer: 'Correct',
    incorrectAnswers: ['Wrong1', 'Wrong2', 'Wrong3'],
    allAnswers: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3']
  };

  const mockQuestion2: TriviaQuestion = {
    ...mockQuestion,
    id: 'test-2',
    question: 'Another question?'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [FavoritesStore]
    });
    store = TestBed.inject(FavoritesStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  // Test 1: Add item
  it('should add a question to favorites', () => {
    const result = store.add(mockQuestion);
    expect(result).toBe(true);
    expect(store.getFavorites().length).toBe(1);
    expect(store.getFavorites()[0].id).toBe('test-1');
  });

  // Test 2: Remove item
  it('should remove a question from favorites', () => {
    store.add(mockQuestion);
    const result = store.remove('test-1');
    expect(result).toBe(true);
    expect(store.getFavorites().length).toBe(0);
  });

  // Test 3: Prevent duplicates
  it('should not add duplicate questions', () => {
    store.add(mockQuestion);
    const result = store.add(mockQuestion);
    expect(result).toBe(false);
    expect(store.getFavorites().length).toBe(1);
  });

  // Test 4: Check existence
  it('should check if question exists in favorites', () => {
    store.add(mockQuestion);
    expect(store.exists('test-1')).toBe(true);
    expect(store.exists('non-existent')).toBe(false);
  });

  // Test 5: Clear all
  it('should clear all favorites', () => {
    store.add(mockQuestion);
    store.add(mockQuestion2);
    store.clear();
    expect(store.getFavorites().length).toBe(0);
  });

  // Test 6: Get count
  it('should return correct count', () => {
    expect(store.getCount()).toBe(0);
    store.add(mockQuestion);
    expect(store.getCount()).toBe(1);
    store.add(mockQuestion2);
    expect(store.getCount()).toBe(2);
  });

  // Test 7: Persistence in localStorage
  it('should persist favorites to localStorage', () => {
    store.add(mockQuestion);
    const stored = localStorage.getItem('trivia_favorites');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].id).toBe('test-1');
  });

  // Test 8: Load from localStorage on init
  it('should load favorites from localStorage on initialization', () => {
    localStorage.setItem('trivia_favorites', JSON.stringify([mockQuestion]));

    // Create new instance to trigger load
    const newStore = new FavoritesStore();
    expect(newStore.getFavorites().length).toBe(1);
  });

  // Test 9: Remove non-existent returns false
  it('should return false when removing non-existent item', () => {
    const result = store.remove('non-existent');
    expect(result).toBe(false);
  });

  // Test 10: Observable emits on changes
  it('should emit favorites through observable', (done) => {
    store.favorites$.subscribe(favorites => {
      if (favorites.length === 1) {
        expect(favorites[0].id).toBe('test-1');
        done();
      }
    });
    store.add(mockQuestion);
  });
});
