import { Component } from '@angular/core';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { HeroComponent } from '../components/hero/hero.component';
import { RecommendedArticlesComponent } from '../components/recommended-articles/recommended-articles.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NavBarComponent,
    HeroComponent,
    RecommendedArticlesComponent,
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
