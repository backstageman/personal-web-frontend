import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticlePublic } from '../../../models/article-public.model';

@Component({
  selector: 'app-article-item',
  imports: [RouterLink],
  templateUrl: './article-item.component.html',
  styleUrl: './article-item.component.scss',
})
export class ArticleItemComponent {
  @Input() article!: ArticlePublic;
}
