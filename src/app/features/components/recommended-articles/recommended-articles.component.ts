import { Component } from '@angular/core';
import { RecoArticleComponent } from '../reco-article/reco-article.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recommended-articles',
  imports: [RecoArticleComponent, RouterLink],
  templateUrl: './recommended-articles.component.html',
  styleUrl: './recommended-articles.component.scss',
})
export class RecommendedArticlesComponent {}
