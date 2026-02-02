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
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAvatar,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  settings,
  trophy,
  star,
  chevronForward,
  moon,
  sunny,
  informationCircle
} from 'ionicons/icons';
import { SettingsService } from '../../core/services/settings.service';
import { StatsService } from '../../core/services/stats.service';
import { AppSettings, UserStats } from '../../core/models/trivia.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonAvatar,
    IonChip,
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit {
  settings: AppSettings | null = null;
  stats: UserStats | null = null;

  constructor(
    private settingsService: SettingsService,
    private statsService: StatsService,
    private router: Router
  ) {
    addIcons({
      person,
      settings,
      trophy,
      star,
      chevronForward,
      moon,
      sunny,
      informationCircle
    });
  }

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
    this.stats = this.statsService.calculateStats();
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  getLevel(): string {
    if (!this.stats) return 'Novato';
    if (this.stats.totalQuizzes >= 50) return 'Maestro';
    if (this.stats.totalQuizzes >= 20) return 'Experto';
    if (this.stats.totalQuizzes >= 10) return 'Avanzado';
    if (this.stats.totalQuizzes >= 5) return 'Intermedio';
    return 'Novato';
  }

  getLevelColor(): string {
    const level = this.getLevel();
    switch (level) {
      case 'Maestro': return 'danger';
      case 'Experto': return 'warning';
      case 'Avanzado': return 'success';
      case 'Intermedio': return 'primary';
      default: return 'medium';
    }
  }
}
