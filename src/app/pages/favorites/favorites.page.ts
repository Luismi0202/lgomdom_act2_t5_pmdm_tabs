import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  star,
  trash,
  heart,
  helpCircle,
  trashBin
} from 'ionicons/icons';
import { FavoritesStore } from '../../core/services/favorites.store';
import { TriviaQuestion } from '../../core/models/trivia.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonBadge,
    CommonModule,
    FormsModule
  ]
})
export class FavoritesPage implements OnInit {
  favorites: TriviaQuestion[] = [];

  constructor(private favoritesStore: FavoritesStore) {
    addIcons({
      star,
      trash,
      heart,
      helpCircle,
      trashBin
    });
  }

  ngOnInit() {
    this.favoritesStore.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  removeFavorite(question: TriviaQuestion): void {
    this.favoritesStore.remove(question.id);
  }

  clearAllFavorites(): void {
    this.favoritesStore.clear();
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  }
}
