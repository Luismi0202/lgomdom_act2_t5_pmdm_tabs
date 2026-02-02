import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonChip,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  play,
  trophy,
  star,
  flame,
  sparkles,
  rocket,
  heart
} from 'ionicons/icons';
import { ApiService } from '../../core/services/api.service';
import { SettingsService } from '../../core/services/settings.service';
import { StatsService } from '../../core/services/stats.service';
import { QuizService } from '../../core/services/quiz.service';
import { TriviaCategory, UserStats, AppSettings } from '../../core/models/trivia.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonChip,
    IonBadge,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {
  categories: TriviaCategory[] = [];
  featuredCategories: TriviaCategory[] = [];
  stats: UserStats | null = null;
  settings: AppSettings | null = null;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private settingsService: SettingsService,
    private statsService: StatsService,
    private quizService: QuizService,
    private router: Router
  ) {
    addIcons({
      play,
      trophy,
      star,
      flame,
      sparkles,
      rocket,
      heart
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadStats();
    this.loadSettings();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.featuredCategories = categories.slice(0, 6);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadStats(): void {
    this.stats = this.statsService.calculateStats();
  }

  loadSettings(): void {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  startQuickQuiz(): void {
    this.router.navigate(['/tabs/search']);
  }

  startCategoryQuiz(category: TriviaCategory): void {
    this.router.navigate(['/tabs/search'], {
      queryParams: { categoryId: category.id, categoryName: category.name }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  }
}
