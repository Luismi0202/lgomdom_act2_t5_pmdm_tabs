import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonChip,
  IonRadio,
  IonRadioGroup,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  search,
  play,
  checkmarkCircle,
  closeCircle,
  arrowForward,
  arrowBack,
  star,
  starOutline,
  trophy,
  refresh
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { QuizService, QuizState } from '../../core/services/quiz.service';
import { FavoritesStore } from '../../core/services/favorites.store';
import { SettingsService } from '../../core/services/settings.service';
import { TriviaCategory, TriviaQuestion, QuizResult } from '../../core/models/trivia.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonChip,
    IonRadio,
    IonRadioGroup,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule
  ]
})
export class SearchPage implements OnInit, OnDestroy {
  categories: TriviaCategory[] = [];
  selectedCategory: number | null = null;
  selectedDifficulty: string = 'any';
  questionCount: number = 10;

  quizState: QuizState | null = null;
  currentQuestion: TriviaQuestion | null = null;
  selectedAnswer: string = '';
  quizResult: QuizResult | null = null;

  isLoading = false;
  isLoadingQuestions = false;
  view: 'setup' | 'quiz' | 'result' = 'setup';

  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private quizService: QuizService,
    private favoritesStore: FavoritesStore,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({
      search,
      play,
      checkmarkCircle,
      closeCircle,
      arrowForward,
      arrowBack,
      star,
      starOutline,
      trophy,
      refresh
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadDefaultSettings();
    this.checkRouteParams();

    const stateSub = this.quizService.state$.subscribe(state => {
      this.quizState = state;
      if (state.isActive) {
        this.currentQuestion = this.quizService.getCurrentQuestion();
      }
    });
    this.subscriptions.push(stateSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCategories(): void {
    this.isLoading = true;
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadDefaultSettings(): void {
    const settings = this.settingsService.getSettings();
    this.selectedDifficulty = settings.defaultDifficulty;
    this.questionCount = settings.defaultQuestionCount;
  }

  checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategory = parseInt(params['categoryId'], 10);
      }
    });
  }

  startQuiz(): void {
    this.isLoadingQuestions = true;
    const categoryName = this.categories.find(c => c.id === this.selectedCategory)?.name || 'General';
    const difficulty = this.selectedDifficulty === 'any' ? '' : this.selectedDifficulty;

    this.apiService.getQuestions(
      this.questionCount,
      this.selectedCategory || undefined,
      difficulty
    ).subscribe({
      next: (questions) => {
        if (questions.length > 0) {
          this.quizService.startQuiz(questions, categoryName, this.selectedDifficulty);
          this.view = 'quiz';
          this.currentQuestion = this.quizService.getCurrentQuestion();
        }
        this.isLoadingQuestions = false;
      },
      error: () => {
        this.isLoadingQuestions = false;
      }
    });
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
    this.quizService.answerQuestion(answer);
  }

  nextQuestion(): void {
    const hasNext = this.quizService.nextQuestion();
    if (hasNext) {
      this.currentQuestion = this.quizService.getCurrentQuestion();
      this.selectedAnswer = this.quizState?.answers.get(this.currentQuestion?.id || '') || '';
    }
  }

  previousQuestion(): void {
    const hasPrev = this.quizService.previousQuestion();
    if (hasPrev) {
      this.currentQuestion = this.quizService.getCurrentQuestion();
      this.selectedAnswer = this.quizState?.answers.get(this.currentQuestion?.id || '') || '';
    }
  }

  finishQuiz(): void {
    this.quizResult = this.quizService.finishQuiz();
    this.view = 'result';
  }

  toggleFavorite(question: TriviaQuestion): void {
    if (this.isFavorite(question)) {
      this.favoritesStore.remove(question.id);
    } else {
      this.favoritesStore.add(question);
    }
  }

  isFavorite(question: TriviaQuestion): boolean {
    return this.favoritesStore.exists(question.id);
  }

  resetQuiz(): void {
    this.quizService.resetQuiz();
    this.view = 'setup';
    this.selectedAnswer = '';
    this.quizResult = null;
  }

  viewResultDetail(): void {
    if (this.quizResult) {
      this.router.navigate(['/detail', this.quizResult.id]);
    }
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return this.quizService.getProgress();
  }

  getScoreColor(): string {
    if (!this.quizResult) return 'medium';
    if (this.quizResult.score >= 80) return 'success';
    if (this.quizResult.score >= 50) return 'warning';
    return 'danger';
  }

  isAnswerSelected(answer: string): boolean {
    return this.selectedAnswer === answer;
  }

  canFinish(): boolean {
    return this.quizService.allQuestionsAnswered();
  }
}
