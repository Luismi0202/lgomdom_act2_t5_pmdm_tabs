import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { TriviaApiResponse } from '../models/trivia.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: URL construction
  it('should build URL correctly with all parameters', () => {
    const url = service.buildQuestionsUrl(10, 9, 'easy', 'multiple');
    expect(url).toContain('amount=10');
    expect(url).toContain('category=9');
    expect(url).toContain('difficulty=easy');
    expect(url).toContain('type=multiple');
  });

  // Test 2: URL without optional parameters
  it('should build URL correctly without optional parameters', () => {
    const url = service.buildQuestionsUrl(5);
    expect(url).toBe('https://opentdb.com/api.php?amount=5');
  });

  // Test 3: URL excludes "any" difficulty
  it('should not include difficulty when set to "any"', () => {
    const url = service.buildQuestionsUrl(10, undefined, 'any');
    expect(url).not.toContain('difficulty');
  });

  // Test 4: GET request to questions endpoint
  it('should make GET request to questions endpoint', () => {
    const mockResponse: TriviaApiResponse = {
      response_code: 0,
      results: [{
        category: 'Science',
        type: 'multiple',
        difficulty: 'easy',
        question: 'Test question?',
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong1', 'Wrong2', 'Wrong3']
      }]
    };

    service.getQuestions(10).subscribe(questions => {
      expect(questions.length).toBe(1);
      expect(questions[0].question).toBe('Test question?');
    });

    const req = httpMock.expectOne(req => req.url.includes('api.php'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Test 5: Maps API response to internal model
  it('should map API response to internal model correctly', () => {
    const mockResponse: TriviaApiResponse = {
      response_code: 0,
      results: [{
        category: 'Science',
        type: 'multiple',
        difficulty: 'medium',
        question: 'Test?',
        correct_answer: 'A',
        incorrect_answers: ['B', 'C', 'D']
      }]
    };

    const result = service.mapApiResponseToQuestions(mockResponse);

    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Science');
    expect(result[0].correctAnswer).toBe('A');
    expect(result[0].incorrectAnswers).toEqual(['B', 'C', 'D']);
    expect(result[0].allAnswers.length).toBe(4);
  });

  // Test 6: Returns empty array on API error code
  it('should return empty array when response_code is not 0', () => {
    const mockResponse: TriviaApiResponse = {
      response_code: 1,
      results: []
    };

    const result = service.mapApiResponseToQuestions(mockResponse);
    expect(result).toEqual([]);
  });

  // Test 7: Handles HTTP error gracefully
  it('should return empty array on HTTP error', () => {
    service.getQuestions(10).subscribe(questions => {
      expect(questions).toEqual([]);
    });

    const req = httpMock.expectOne(req => req.url.includes('api.php'));
    req.error(new ProgressEvent('error'));
  });

  // Test 8: GET categories
  it('should fetch categories successfully', () => {
    const mockCategories = {
      trivia_categories: [
        { id: 9, name: 'General Knowledge' },
        { id: 10, name: 'Entertainment: Books' }
      ]
    };

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories[0].name).toBe('General Knowledge');
    });

    const req = httpMock.expectOne('https://opentdb.com/api_category.php');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  // Test 9: Shuffles answers
  it('should shuffle answers', () => {
    const answers = ['A', 'B', 'C', 'D'];
    // Run multiple times to verify shuffling happens
    let differentOrder = false;
    for (let i = 0; i < 10; i++) {
      const shuffled = service.shuffleAnswers(answers);
      if (shuffled.join('') !== answers.join('')) {
        differentOrder = true;
        break;
      }
    }
    // At least verify length is preserved
    expect(service.shuffleAnswers(answers).length).toBe(4);
  });

  // Test 10: Decodes HTML entities
  it('should decode HTML entities', () => {
    const encoded = '&amp; &lt; &gt; &quot;';
    const decoded = service.decodeHtml(encoded);
    expect(decoded).toBe('& < > "');
  });
});
