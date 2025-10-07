import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { RecommendedArticlesComponent } from '../components/recommended-articles/recommended-articles.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, RecommendedArticlesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
