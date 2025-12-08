import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadService } from '../../services/upload.service';
import { AuthService } from '../../core/auth/auth.service';
import Vditor from 'vditor';
import { CommonModule } from '@angular/common';
import { ArticleUploadType } from '../../shared/models/upload-type.model';

@Component({
  selector: 'app-markdown-editor',
  imports: [CommonModule, MatSnackBarModule],
  standalone: true,
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  vditor: Vditor | null = null;
  elementId = 'vditor-editor';
  private inputTimeout: any;
  private initStartTime: number = 0;
  private renderCompleteTime: number = 0;

  constructor(
    private uploadService: UploadService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('vditorContainer') vditorContainer!: ElementRef;

  ngOnInit(): void {
    this.elementId = `vditor-editor-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngAfterViewInit(): void {
    this.initVditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.vditor && !changes['value'].firstChange) {
      const newValue = changes['value'].currentValue || '';
      if (this.vditor.getValue() !== newValue) {
        this.vditor.setValue(newValue);
      }
    }
  }

  private initVditor(): void {
    this.initStartTime = performance.now();
    // console.log(`[Markdown Editor] 开始初始化编辑器...`);

    setTimeout(() => {
      try {
        this.vditor = new Vditor(this.elementId, {
          height: 400,
          mode: 'ir',
          placeholder: '请输入 Markdown 内容...',
          theme: 'classic',
          cache: {
            enable: false,
          },
          input: (value: string) => {
            if (this.inputTimeout) {
              clearTimeout(this.inputTimeout);
            }
            this.inputTimeout = setTimeout(() => {
              this.valueChange.emit(value);
            }, 300);
          },
          after: () => {
            this.renderCompleteTime = performance.now();
            const initTime = this.renderCompleteTime - this.initStartTime;
            // console.log(
            //   `[Markdown Editor] 编辑器渲染完成，耗时: ${initTime.toFixed(2)}ms`
            // );

            if (this.value) {
              this.vditor?.setValue(this.value);
            }
          },
          toolbar: [
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'quote',
            'code',
            '|',
            'upload',
            '|',
            'undo',
            'redo',
          ],
          preview: {
            delay: 0,
          },
          upload: {
            accept: 'image/jpg, image/jpeg, image/png, image/gif, image/webp',
            handler: (files: File[]) => {
              this.handleUpload(files);
              return null; // 返回 null 阻止默认上传行为
            },
            multiple: false,
            filename: (name) =>
              name
                .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
                .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
                .replace('/\\s/g', ''),
          },
          cdn: '/assets/vditor',
          counter: {
            enable: false,
          },
          hint: {
            parse: false,
          },
          debugger: false,
        });
      } catch (error) {
        // console.error('Error initializing Vditor:', error);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }

    if (this.vditor) {
      this.vditor.destroy();
      this.vditor = null;
    }
  }

  public getValue(): string {
    return this.vditor?.getValue() || '';
  }

  public setValue(value: string): void {
    this.vditor?.setValue(value);
  }

  // 性能监控方法
  public getPerformanceInfo(): { initTime: number; renderTime: number } {
    return {
      initTime: this.initStartTime,
      renderTime: this.renderCompleteTime,
    };
  }

  public getRenderDuration(): number {
    if (this.renderCompleteTime && this.initStartTime) {
      return this.renderCompleteTime - this.initStartTime;
    }
    return 0;
  }

  private handleUpload(files: File[]): void {
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. 检查登录状态
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('请先登录后再上传图片', '关闭', { duration: 3000 });
      return;
    }

    // 2. 验证文件类型
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      this.snackBar.open('不支持的文件类型', '关闭', { duration: 3000 });
      return;
    }

    // 3. 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('图片大小不能超过 10MB', '关闭', { duration: 3000 });
      return;
    }

    // 4. 上传
    const fileName = this.uploadService.extractFileName(file);

    this.snackBar.open('正在上传图片...', '', { duration: 2000 });

    this.uploadService
      .streamUploadFile(fileName, file.type, ArticleUploadType.Content, file)
      .subscribe({
        next: ({ response }) => {
          if (response) {
            const imageUrl = response.publicUrl;
            const markdownImage = `![${file.name}](${imageUrl})`;

            // 插入到编辑器
            this.vditor?.insertValue(markdownImage);

            this.snackBar.open('上传成功', '关闭', {
              duration: 2000,
              panelClass: ['success-snackbar'],
            });
          }
        },
        error: (err) => {
          // console.error('Upload failed', err);
          this.snackBar.open('上传失败，请重试', '关闭', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }
}
