import { TestBed } from '@angular/core/testing';
import { QuizService } from './quiz.service';
import { StatsService } from './stats.service';
import { TriviaQuestion } from '../models/trivia.model';

describe('QuizService', () => {
  let service: QuizService;
  let mockStatsService: jasmine.SpyObj<StatsService>;

  const mockQuestions: TriviaQuestion[] = [
    {
      id: 'q1',
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Question 1?',
      correctAnswer: 'A',
      incorrectAnswers: ['B', 'C', 'D'],
      allAnswers: ['A', 'B', 'C', 'D']
    },
    {
      id: 'q2',
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Question 2?',
      correctAnswer: 'X',
      incorrectAnswers: ['Y', 'Z', 'W'],
      allAnswers: ['X', 'Y', 'Z', 'W']
    }
  ];

  beforeEach(() => {
    mockStatsService = jasmine.createSpyObj('StatsService', ['addResult']);

    TestBed.configureTestingModule({
      providers: [
        QuizService,
        { provide: StatsService, useValue: mockStatsService }
      ]
    });
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: Start quiz
  it('should start a quiz with questions', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    const state = service.getState();
    expect(state.isActive).toBe(true);
    expect(state.questions.length).toBe(2);
    expect(state.currentIndex).toBe(0);
  });

  // Test 2: Get current question
  it('should get current question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    const question = service.getCurrentQuestion();
    expect(question?.id).toBe('q1');
  });

  // Test 3: Answer question
  it('should store answer for current question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    service.answerQuestion('A');
    const state = service.getState();
    expect(state.answers.get('q1')).toBe('A');
  });

  // Test 4: Next question
  it('should move to next question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    const hasNext = service.nextQuestion();
    expect(hasNext).toBe(true);
    expect(service.getState().currentIndex).toBe(1);
  });

  // Test 5: Previous question
  it('should move to previous question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    service.nextQuestion();
    const hasPrev = service.previousQuestion();
    expect(hasPrev).toBe(true);
    expect(service.getState().currentIndex).toBe(0);
  });

  // Test 6: Cannot go before first question
  it('should not go before first question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    const hasPrev = service.previousQuestion();
    expect(hasPrev).toBe(false);
    expect(service.getState().currentIndex).toBe(0);
  });

  // Test 7: Cannot go past last question
  it('should not go past last question', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    service.nextQuestion(); // Go to q2
    const hasNext = service.nextQuestion(); // Try to go further
    expect(hasNext).toBe(false);
    expect(service.getState().currentIndex).toBe(1);
  });

  // Test 8: Finish quiz and calculate score
  it('should finish quiz and calculate correct score', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    service.answerQuestion('A'); // Correct
    service.nextQuestion();
    service.answerQuestion('Y'); // Wrong

    const result = service.finishQuiz();
    expect(result.correctAnswers).toBe(1);
    expect(result.totalQuestions).toBe(2);
    expect(result.score).toBe(50);
    expect(mockStatsService.addResult).toHaveBeenCalled();
  });

  // Test 9: Reset quiz
  it('should reset quiz state', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    service.answerQuestion('A');
    service.resetQuiz();

    const state = service.getState();
    expect(state.isActive).toBe(false);
    expect(state.questions.length).toBe(0);
    expect(state.answers.size).toBe(0);
  });

  // Test 10: Check all questions answered
  it('should check if all questions are answered', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    expect(service.allQuestionsAnswered()).toBe(false);

    service.answerQuestion('A');
    service.nextQuestion();
    service.answerQuestion('X');

    expect(service.allQuestionsAnswered()).toBe(true);
  });

  // Test 11: Get progress
  it('should return correct progress', () => {
    service.startQuiz(mockQuestions, 'Science', 'easy');
    let progress = service.getProgress();
    expect(progress.current).toBe(1);
    expect(progress.total).toBe(2);
    expect(progress.percentage).toBe(50);

    service.nextQuestion();
    progress = service.getProgress();
    expect(progress.current).toBe(2);
    expect(progress.percentage).toBe(100);
  });
});
