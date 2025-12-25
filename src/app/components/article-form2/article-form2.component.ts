import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticlesService } from '../../services/articles.service';
import { Article } from '../../models/article.model';
import { Subscription } from 'rxjs';
import { CoverImageUploadComponent } from '../cover-image-upload/cover-image-upload.component';
import { MarkdownEditorComponent } from '../markdown-editor/markdown-editor.component';
import { ViewChild } from '@angular/core';

type PageMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-article-form2',
  imports: [
    NgIf,
    DatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatChipsModule,
    ReactiveFormsModule,
    CoverImageUploadComponent,
    MarkdownEditorComponent,
  ],
  standalone: true,
  templateUrl: './article-form2.component.html',
  styleUrl: './article-form2.component.scss',
})
export class ArticleForm2Component implements OnInit {
  @Input() mode: PageMode = 'create';
  @Input() article: Article | null = null;
  @Output() submitForm = new EventEmitter<Partial<Article>>();
  @Output() cancel = new EventEmitter<Event>();

  loading = false;
  form!: FormGroup;
  private sub = new Subscription();
  @ViewChild(MarkdownEditorComponent) markdownEditor!: MarkdownEditorComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private api: ArticlesService,
    private sb: MatSnackBar
  ) { }

  ngOnInit(): void {
    const pageLoadStartTime = performance.now();
    // console.log(`[ArticleForm2] 页面组件开始初始化...`);

    this.form = this.fb.group({
      id: [{ value: this.article?.id || 0, disabled: true }],
      title: [this.article?.title || '', Validators.required],
      content: [this.article?.content || '', Validators.required],
      slug: [this.article?.slug || ''],
      coverImage: [this.article?.coverImage || null],
      tags: [this.article?.tags?.join(', ') || []],
      isPublished: [this.article?.isPublished ?? false],
      isDeleted: [this.article?.isDeleted ?? false],
      viewCount: [this.article?.viewCount ?? 0],
      createdAt: [this.article?.createdAt ?? null],
      updatedAt: [this.article?.updatedAt ?? null],
    });

    this.form.get('viewCount')?.disable();

    if (this.mode === 'view') {
      this.form.disable();
    }

    if (this.mode === 'create') {
      this.form.removeControl('isDeleted');
      this.form.removeControl('createdAt');
      this.form.removeControl('updatedAt');
      this.form.removeControl('authorId');
    }

    // 页面组件初始化完成
    setTimeout(() => {
      const pageInitTime = performance.now() - pageLoadStartTime;
      // console.log(`[ArticleForm2] 页面组件初始化完成，耗时: ${pageInitTime.toFixed(2)}ms`);

      // 监控 Markdown 编辑器性能
      setTimeout(() => {
        if (this.markdownEditor) {
          const perfInfo = this.markdownEditor.getPerformanceInfo();
          const renderDuration = this.markdownEditor.getRenderDuration();
          // console.log(`[ArticleForm2] Markdown 编辑器性能信息:`, perfInfo);
          // console.log(`[ArticleForm2] Markdown 编辑器渲染耗时: ${renderDuration.toFixed(2)}ms`);
        }
      }, 2000); // 等待编辑器可能完成初始化
    }, 0);
  }

  onCoverImageChange(coverImageKey: string | null) {
    // Normalizing the value: if it's an empty string, treat it as null
    const finalValue = coverImageKey === '' ? null : coverImageKey;
    // console.log('ArticleForm2: onCoverImageChange called with:', finalValue);
    this.form.patchValue({ coverImage: finalValue });
    this.form.markAsDirty(); // Ensure form is marked as dirty so user knows changes happened
  }

  onSubmit() {
    if (this.form.valid && this.mode !== 'view') {
      const value = { ...this.form.getRawValue() };
      if (this.mode === 'create') {
        delete value.id;
        delete value.viewCount;
      } else if (this.mode === 'edit') {
        delete value.createdAt;
        delete value.updatedAt;
        delete value.authorId;
        delete value.isDeleted;
        delete value.viewCount;
      }
      value.tags =
        value.tags && value.tags.length > 0
          ? value.tags.split(',').map((t: string) => t.trim())
          : [];

      // 确保封面图片字段正确处理
      value.coverImage = value.coverImage || null;

      this.submitForm.emit(value);
    }
  }

  goList(event?: Event) {
    // 防止事件冒泡
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/admin/articles']);
  }
}
