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

  /**
   * 🚨 问题修复：处理图片加载失败的情况
   * 当上传的图片加载失败时，显示默认图片
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.warn(`Image failed to load: ${img.src}, falling back to default image`);

    // 设置为默认图片
    img.src = 'assets/images/article-cover-image-default-middle.webp';

    // 移除错误监听器，避免无限循环
    img.onerror = null;
  }
}
