import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectPublic } from '../../../../models/project-public.model';

@Component({
  selector: 'app-project-list-item',
  standalone: true,
  imports: [CommonModule, DatePipe, UpperCasePipe],
  templateUrl: './project-list-item.component.html',
  styleUrl: './project-list-item.component.scss',
})
export class ProjectListItemComponent {
  @Input() project!: ProjectPublic;
  private router = inject(Router);

  // 默认图片路径
  readonly defaultProjectImage =
    '/assets/images/article-cover-image-default-middle.webp';
  readonly defaultAuthorAvatar = '/assets/images/default-avatar.png';

  /**
   * 处理项目图片加载失败的情况
   * 当上传的项目图片加载失败时，显示默认图片
   */
  onProjectImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // console.warn(
    //   `Project image failed to load: ${img.src}, falling back to default image`
    // );

    // 设置为默认图片
    img.src = this.defaultProjectImage;

    // 移除错误监听器，避免无限循环
    img.onerror = null;
  }

  /**
   * 处理作者头像加载失败的情况
   */
  onAuthorImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // console.warn(
    //   `Author avatar failed to load: ${img.src}, falling back to default avatar`
    // );

    // 设置为默认头像
    img.src = this.defaultAuthorAvatar;

    // 移除错误监听器，避免无限循环
    img.onerror = null;
  }

  /**
   * 导航到项目详情页
   */
  goToProjectDetail(event: Event): void {
    event.preventDefault();
    if (this.project && this.project.id) {
      this.router.navigate(['/projects/article', this.project.id]);
    }
  }
}
