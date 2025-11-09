import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArticlePublic } from '../../../models/article-public.model';

@Component({
  selector: 'app-article-item',
  imports: [RouterLink],
  templateUrl: './article-item.component.html',
  styleUrl: './article-item.component.scss',
})
export class ArticleItemComponent {
  @Input() article!: ArticlePublic;
  private router = inject(Router);

  goPreview(id: number) {
    this.router.navigate([`/blog`, id], {
      state: {
        article: this.article,
      },
    });
  }
}
