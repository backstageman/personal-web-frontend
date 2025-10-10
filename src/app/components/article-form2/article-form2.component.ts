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
import { EasyMdeWrapperComponent } from '../easy-mde-wrapper/easy-mde-wrapper.component';

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
  ],
  standalone: true,
  templateUrl: './article-form2.component.html',
  styleUrl: './article-form2.component.scss',
})
export class ArticleForm2Component implements OnInit {
  @Input() mode: PageMode = 'create';
  @Input() article: Article | null = null;
  @Output() submitForm = new EventEmitter<Partial<Article>>();
  @Output() cancel = new EventEmitter<void>();

  // private easyMDE?: EasyMDE;
  loading = false;
  form!: FormGroup;
  /*  form!: FormGroup<{
    id: FormControl<number | null>;
    title: FormControl<string | null>;
    content: FormControl<string | null>;
    slug: FormControl<string | null>;
    coverImage: FormControl<string | null>;
    tags: FormControl<string[] | null>;
    isPublished: FormControl<boolean | null>;
    isDeleted: FormControl<boolean | null>;
    viewCount: FormControl<number | null>;
    createdAt: FormControl<Date | null>;
    updatedAt: FormControl<Date | null>;
    authorId: FormControl<number | null>;
  }>; */

  private sub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private api: ArticlesService,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.mode = (this.route.snapshot.data['mode'] ?? 'new') as PageMode;
    // const idParam = this.route.snapshot.paramMap.get('id');
    // this.id = idParam ? +idParam : undefined;

    // this.form = this.fb.nonNullable.group({
    //   id: this.fb.control<number | null>(null),
    //   title: this.fb.nonNullable.control('', {
    //     validators: [Validators.required, Validators.maxLength(255)],
    //   }),
    //   content: this.fb.nonNullable.control('', {
    //     validators: [Validators.required, Validators.minLength(1)],
    //   }),
    //   slug: this.fb.control<string | null>(null),
    //   coverImage: this.fb.control<string | null>(null),
    //   tags: this.fb.control<string[] | null>([]),
    //   isPublished: this.fb.nonNullable.control(false),
    //   isDeleted: this.fb.nonNullable.control(false),
    //   viewCount: this.fb.control<number | null>(0),
    //   createdAt: this.fb.control<Date | null>(null),
    //   updatedAt: this.fb.control<Date | null>(null),
    //   authorId: this.fb.control<number | null>(null), // 选填：可接入作者选择控件
    // });

    this.form = this.fb.group({
      id: [{ value: this.article?.id || 0, disabled: true }],
      title: [this.article?.title || '', Validators.required],
      content: [this.article?.content || '', Validators.required],
      slug: [this.article?.slug || ''],
      coverImage: [this.article?.coverImage || ''],
      tags: [this.article?.tags?.join(', ') || []],
      isPublished: [this.article?.isPublished ?? false],
      isDeleted: [this.article?.isDeleted ?? false],
      viewCount: [this.article?.viewCount ?? 0],
      createdAt: [this.article?.createdAt ?? null],
      updatedAt: [this.article?.updatedAt ?? null],
      // authorId: [this.article?.authorId ?? null],
    });

    this.form.get('viewCount')?.disable();

    if (this.mode === 'view') {
      // 查看时禁用所有表单项
      this.form.disable();
    }

    if (this.mode === 'create') {
      // this.form.removeControl('id'); // 新建时不需要 id
      this.form.removeControl('isDeleted');
      // this.form.removeControl('viewCount');
      this.form.removeControl('createdAt');
      this.form.removeControl('updatedAt');
      this.form.removeControl('authorId');
    }

    // 标题自动生成 slug（用户也可手工改）
    /* this.sub.add(
      this.form.controls.title.valueChanges.subscribe((t) => {
        if (this.mode === 'new') {
          this.form.controls.slug.setValue(this.slugify(t));
        }
      })
    ); */

    // 编辑/查看时加载详情
    /*   if (this.mode !== 'new' && this.id) {
      this.loading = true;
      this.sub.add(
        this.api.getArticleById(this.id).subscribe({
          next: (a) => {
            this.form.patchValue({
              id: a.id,
              title: a.title,
              slug: a.slug ?? null,
              content: a.content,
              coverImage: a.coverImage ?? null,
              tags: a.tags ?? [],
              isPublished: a.isPublished,
              isDeleted: a.isDeleted,
              viewCount: a.viewCount ?? 0,
              createdAt: a.createdAt ? new Date(a.createdAt) : null,
              updatedAt: a.updatedAt ? new Date(a.updatedAt) : null,
              authorId: a.author?.id ?? null,
            });
            if (this.mode === 'view') this.form.disable();
          },
          error: () => this.sb.open('加载文章失败', '关闭', { duration: 2500 }),
          complete: () => (this.loading = false),
        })
      );
    } */

    // if (this.mode === 'view') this.form.disable();
  }

  /*  ngOnDestroy(): void {
    this.sub.unsubscribe();
  } */

  /* goBack() {
    this.loc.back();
  } */

  /* save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sb.open('请完善表单后再提交', '知道了', { duration: 2000 });
      return;
    }
    const dto = this.toDto();

    if (this.mode === 'new') {
      this.api.createArticle(dto).subscribe({
        next: () => {
          this.sb.open('创建成功', '关闭', { duration: 1500 });
          this.router.navigate(['/admin/articles']);
        },
        error: () => this.sb.open('创建失败', '关闭', { duration: 2500 }),
      });
    } else if (this.mode === 'edit' && this.id) {
      this.api.updateArticle(this.id, dto).subscribe({
        next: () => {
          this.sb.open('更新成功', '关闭', { duration: 1500 });
          this.router.navigate(['/admin/articles']);
        },
        error: () => this.sb.open('更新失败', '关闭', { duration: 2500 }),
      });
    }
  } */

  /*  cancel() {
    this.router.navigate(['/admin/articles']);
  } */

  // —— tags chips —— //
  /*  addTagFromInput(input: HTMLInputElement) {
    const v = (input.value || '').trim();
    if (!v) return;
    const tags = this.form.value.tags ?? [];
    if (!tags.includes(v)) this.form.controls.tags.setValue([...tags, v]);
    input.value = '';
  } */
  /*   removeTag(tag: string) {
    const tags = (this.form.value.tags ?? []).filter((t) => t !== tag);
    this.form.controls.tags.setValue(tags);
  } */

  // —— helpers —— //
  /*  private slugify(s: string): string {
    return (s || '')
      .toLowerCase()
      .trim()
      .replace(/[\u4e00-\u9fa5]/g, '') // 这里简单移除中文；如需中文转拼音可后续接 lib
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  } */

  /* private toDto(): Partial<Article> {
    const v = this.form.getRawValue();
    return {
      title: v.title,
      content: v.content,
      slug: v.slug || undefined,
      coverImage: v.coverImage || undefined,
      tags: v.tags || [],
      isPublished: v.isPublished,
      isDeleted: v.isDeleted,
      authorId: v.authorId || undefined,
    };
  } */

  /* get title() {
    return this.form.controls.title;
  } */
  /* get content() {
    return this.form.controls.content;
  } */

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
      this.submitForm.emit(value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
