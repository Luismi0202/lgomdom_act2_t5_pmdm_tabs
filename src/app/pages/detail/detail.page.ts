import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonButton,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  closeCircle,
  arrowBack,
  trophy,
  time,
  helpCircle,
  statsChart
} from 'ionicons/icons';
import { StatsService } from '../../core/services/stats.service';
import { QuizResult } from '../../core/models/trivia.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonButton,
    IonChip,
    CommonModule,
    FormsModule
  ]
})
export class DetailPage implements OnInit {
  result: QuizResult | null = null;
  resultId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private statsService: StatsService
  ) {
    addIcons({
      checkmarkCircle,
      closeCircle,
      arrowBack,
      trophy,
      time,
      helpCircle,
      statsChart
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.resultId = params.get('id') || '';
      if (this.resultId) {
        this.result = this.statsService.getResultById(this.resultId) || null;
      }
    });
  }

  getScoreColor(): string {
    if (!this.result) return 'medium';
    if (this.result.score >= 80) return 'success';
    if (this.result.score >= 50) return 'warning';
    return 'danger';
  }

  getDifficultyColor(): string {
    if (!this.result) return 'medium';
    switch (this.result.difficulty) {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/tabs/stats']);
  }
}
