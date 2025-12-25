import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoverImageSkeletonComponent } from '../cover-image-skeleton/cover-image-skeleton.component';

import {
  UploadService,
  UploadProgress,
  StreamUploadResponse,
} from '../../services/upload.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ArticleUploadType } from '../../shared/models/upload-type.model';

@Component({
  selector: 'app-cover-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    CoverImageSkeletonComponent,
  ],
  templateUrl: './cover-image-upload.component.html',
  styleUrls: ['./cover-image-upload.component.scss'],
})
export class CoverImageUploadComponent implements OnChanges {
  @Input() coverImageKey: string | null = null;
  @Output() coverImageChange = new EventEmitter<string | null>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropZone') dropZone!: ElementRef<HTMLElement>;
  @ViewChild('imagePreview') imagePreviewTemplate!: TemplateRef<any>;

  isUploading = false;
  uploadProgress: UploadProgress | null = null;
  imageError = false;
  isDragging = false;
  isImageLoaded = false;
  private isFileSelecting = false;
  private currentPublicUrl: string | null = null;

  constructor(
    private uploadService: UploadService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  /**
   * 当输入属性变化时重置错误状态
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coverImageKey']) {
      this.imageError = false;
      this.isImageLoaded = false;
    }
  }

  /**
   * 获取封面图的CDN URL
   */
  get coverImageUrl(): string | null {
    // 优先使用存储的publicUrl
    if (this.currentPublicUrl) {
      return this.currentPublicUrl;
    }
    // 如果没有publicUrl，尝试从coverImageKey构建
    return this.coverImageKey
      ? this.uploadService.getCdnUrl(this.coverImageKey)
      : null;
  }

  /**
   * 触发文件选择
   */
  selectFile(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileSelecting = true;
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    }, 0);
  }

  /**
   * 处理文件选择
   */
  onFileSelected(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLInputElement;

    const file = target.files?.[0];

    if (!file) {
      // 用户没有选择文件（点击了取消），不做任何操作，留在当前页面
      // 重置文件输入值，确保下次change事件能正确触发
      target.value = '';
      this.isFileSelecting = false;
      // 阻止事件冒泡到父组件，防止触发表单的取消操作
      event.stopImmediatePropagation();
      return;
    }

    this.handleFile(file);
    // 重置文件输入值
    target.value = '';
    this.isFileSelecting = false;
  }

  /**
   * 上传图片 - 使用流式上传
   */
  private uploadImage(file: File): void {
    this.isUploading = true;
    this.isImageLoaded = false;
    this.uploadProgress = { loaded: 0, total: file.size, percentage: 0 };

    const fileName = this.uploadService.extractFileName(file);

    // 恢复使用流式上传
    this.uploadService
      .streamUploadFile(fileName, file.type, ArticleUploadType.Cover, file)
      .subscribe({
        next: ({ response, progress }) => {
          // 更新上传进度
          this.uploadProgress = progress;

          // 如果收到响应，说明上传完成
          if (response) {
            // 存储publicUrl用于显示
            this.currentPublicUrl = response.publicUrl;

            // 上传完成，使用后端返回的fileKey
            this.coverImageKey = response.fileKey; // 立即更新coverImageKey
            this.coverImageChange.emit(response.fileKey);

            // 强制触发变化检测以确保UI更新
            setTimeout(() => {
              this.isUploading = false;
              this.uploadProgress = null;
              this.cdr.detectChanges();
            }, 0);

            this.snackBar.open('图片上传成功', '关闭', {
              duration: 2000,
              panelClass: ['success-snackbar'],
            });
          }
        },
        error: (error) => {
          // console.error('Stream upload failed:', error);
          this.isUploading = false;
          this.uploadProgress = null;
          this.snackBar.open('图片上传失败，请重试', '关闭', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * 删除封面图
   */
  removeCoverImage(): void {
    this.currentPublicUrl = null;
    this.coverImageChange.emit(null);
    this.isImageLoaded = false;
    this.snackBar.open('封面图已删除', '关闭', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  }

  /**
   * 查看大图
   */
  viewImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.coverImageUrl) {
      this.dialog.open(this.imagePreviewTemplate, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        data: { url: this.coverImageUrl }
      });
    }
  }

  /**
   * 验证是否为有效的图片文件
   */
  private isValidImageFile(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return validTypes.includes(file.type);
  }

  /**
   * 处理图片成功加载
   */
  onImageLoad(event: Event): void {
    this.imageError = false;
    this.isImageLoaded = true;
  }

  /**
   * 处理图片加载错误
   */
  onImageError(event: Event): void {
    this.imageError = true;
    this.isImageLoaded = false;

    // 延迟重置错误状态，允许用户重试
    setTimeout(() => {
      this.imageError = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  /**
   * 拖拽开始
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  /**
   * 拖拽离开
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  /**
   * 文件放置
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  /**
   * 剪贴板粘贴事件
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          this.handleFile(file);
          event.preventDefault();
          break;
        }
      }
    }
  }

  /**
   * 检查用户是否已登录
   */
  private checkUserLogin(): boolean {
    // 确保认证状态已初始化（如果需要的话）
    if (!this.authService['authChecked']?.value) {
      this.authService.initAuthState();
    }

    // 检查登录状态（AuthService会自动处理开发模式的localStorage恢复）
    const isLoggedIn = this.authService.isLoggedIn();
    // console.log(
    //   'CoverImageUpload: Authentication check - isLoggedIn:',
    //   isLoggedIn,
    //   'devMode:',
    //   environment.enableDevMode
    // );

    if (!isLoggedIn) {
      // console.log('CoverImageUpload: User not logged in, showing login prompt');
      this.showLoginPrompt();
      return false;
    }

    // console.log('CoverImageUpload: User is logged in, proceeding with upload');
    return true;
  }

  /**
   * 显示登录提示
   */
  private showLoginPrompt(): void {
    this.snackBar
      .open('请先登录后再上传图片', '去登录', {
        duration: 5000,
      })
      .onAction()
      .subscribe(() => {
        // 用户点击"去登录"按钮时跳转到登录页
        this.router.navigate(['/login']);
      });
  }

  /**
   * 统一的文件处理方法
   */
  private handleFile(file: File): void {
    // 首先检查用户是否已登录
    if (!this.checkUserLogin()) {
      return;
    }

    // 验证文件类型
    if (!this.isValidImageFile(file)) {
      this.snackBar.open(
        '请选择有效的图片文件（JPG、PNG、GIF、WebP）',
        '关闭',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('图片文件大小不能超过10MB', '关闭', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.uploadImage(file);
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
