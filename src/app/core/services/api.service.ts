import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  TriviaApiResponse,
  TriviaQuestion,
  TriviaCategory,
  TriviaCategoriesResponse
} from '../models/trivia.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'https://opentdb.com';

  constructor(private http: HttpClient) {}

  /**
   * Construye la URL para obtener preguntas de trivia
   */
  buildQuestionsUrl(
    amount: number = 10,
    category?: number,
    difficulty?: string,
    type?: string
  ): string {
    let url = `${this.BASE_URL}/api.php?amount=${amount}`;

    if (category) {
      url += `&category=${category}`;
    }
    if (difficulty && difficulty !== 'any') {
      url += `&difficulty=${difficulty}`;
    }
    if (type) {
      url += `&type=${type}`;
    }

    return url;
  }

  /**
   * Obtiene preguntas de trivia de la API
   */
  getQuestions(
    amount: number = 10,
    category?: number,
    difficulty?: string,
    type?: string
  ): Observable<TriviaQuestion[]> {
    const url = this.buildQuestionsUrl(amount, category, difficulty, type);

    return this.http.get<TriviaApiResponse>(url).pipe(
      map(response => this.mapApiResponseToQuestions(response)),
      catchError(error => {
        console.error('Error fetching questions:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene las categorías disponibles
   */
  getCategories(): Observable<TriviaCategory[]> {
    return this.http.get<TriviaCategoriesResponse>(`${this.BASE_URL}/api_category.php`).pipe(
      map(response => response.trivia_categories),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Mapea la respuesta de la API al modelo interno
   */
  mapApiResponseToQuestions(response: TriviaApiResponse): TriviaQuestion[] {
    if (response.response_code !== 0) {
      return [];
    }

    return response.results.map((apiQuestion, index) => {
      const allAnswers = this.shuffleAnswers([
        apiQuestion.correct_answer,
        ...apiQuestion.incorrect_answers
      ]);

      return {
        id: `q-${Date.now()}-${index}`,
        category: this.decodeHtml(apiQuestion.category),
        type: apiQuestion.type,
        difficulty: apiQuestion.difficulty,
        question: this.decodeHtml(apiQuestion.question),
        correctAnswer: this.decodeHtml(apiQuestion.correct_answer),
        incorrectAnswers: apiQuestion.incorrect_answers.map(a => this.decodeHtml(a)),
        allAnswers: allAnswers.map(a => this.decodeHtml(a))
      };
    });
  }

  /**
   * Decodifica entidades HTML
   */
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  /**
   * Mezcla las respuestas de forma aleatoria
   */
  shuffleAnswers(answers: string[]): string[] {
    const shuffled = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
