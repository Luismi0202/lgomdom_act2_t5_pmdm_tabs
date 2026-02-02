import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRange,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  moon,
  volumeHigh,
  speedometer,
  help,
  person,
  refreshCircle,
  checkmarkCircle,
  arrowBack
} from 'ionicons/icons';
import { SettingsService } from '../../core/services/settings.service';
import { AppSettings } from '../../core/models/trivia.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRange,
    IonNote,
    CommonModule,
    FormsModule
  ]
})
export class SettingsPage implements OnInit {
  settings: AppSettings = {
    darkMode: false,
    soundEnabled: true,
    defaultDifficulty: 'any',
    defaultQuestionCount: 10,
    username: 'Player'
  };

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {
    addIcons({
      moon,
      volumeHigh,
      speedometer,
      help,
      person,
      refreshCircle,
      checkmarkCircle,
      arrowBack
    });
  }

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = { ...settings };
    });
  }

  onDarkModeChange(event: any): void {
    this.settingsService.updateSettings({ darkMode: event.detail.checked });
  }

  onSoundChange(event: any): void {
    this.settingsService.updateSettings({ soundEnabled: event.detail.checked });
  }

  onDifficultyChange(event: any): void {
    this.settingsService.updateSettings({ defaultDifficulty: event.detail.value });
  }

  onQuestionCountChange(event: any): void {
    this.settingsService.updateSettings({ defaultQuestionCount: event.detail.value });
  }

  onUsernameChange(event: any): void {
    const username = event.detail.value?.trim();
    if (username) {
      this.settingsService.updateSettings({ username });
    }
  }

  resetSettings(): void {
    this.settingsService.resetToDefault();
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
