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
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trophy,
  statsChart,
  checkmarkCircle,
  flame,
  star,
  time,
  chevronForward,
  trash
} from 'ionicons/icons';
import { StatsService } from '../../core/services/stats.service';
import { QuizResult, UserStats } from '../../core/models/trivia.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    CommonModule,
    FormsModule
  ]
})
export class StatsPage implements OnInit {
  stats: UserStats | null = null;
  recentResults: QuizResult[] = [];

  constructor(
    private statsService: StatsService,
    private router: Router
  ) {
    addIcons({
      trophy,
      statsChart,
      checkmarkCircle,
      flame,
      star,
      time,
      chevronForward,
      trash
    });
  }

  ngOnInit() {
    this.loadStats();
    this.statsService.results$.subscribe(results => {
      this.recentResults = results.slice(0, 10);
    });
  }

  loadStats(): void {
    this.stats = this.statsService.calculateStats();
  }

  viewResultDetail(result: QuizResult): void {
    this.router.navigate(['/detail', result.id]);
  }

  clearAllStats(): void {
    this.statsService.clearStats();
    this.loadStats();
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
