import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Article } from '../../models/article.model';
import { ArticlesService } from '../../service/articles.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { cleanQueryParams, convertDatesToISO } from '../../utils/util';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../service/snackbar.service';
import { BatchUpdatePayload } from '../../shared/interfaces/api-response.interface';

@Component({
  selector: 'app-articles',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormField,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    MatOption,
    MatSelect,
    MatDatepicker,
    MatDatepickerToggle,
    MatNativeDateModule,
    MatDatepickerModule,
    MatLabel,
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent implements OnInit {
  private articleService = inject(ArticlesService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private snackBarService = inject(SnackBarService);

  filterForm!: FormGroup;
  checked = false;
  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'content',
    'coverImage',
    'slug',
    'tags',
    'viewCount',
    'isPublished',
    'createdAt',
    'updatedAt',
    /* 
    author: {id: 9, email: 'test@123.com'}
  */
    // 'author',
    // 'authorId',
    // 'author.email',
    'actions',
  ];
  // dataSource = new MatTableDataSource<Article>([]);
  dataSource: Article[] = [];
  totalArticles = 0;
  page = 1;
  limit = 10;
  /*   dataSource 数据类型
  new MatTableDataSource<any>([
    { title: '这是一个表格，有分页1。3', name: '文章标题1' },
    { title: '任务2', name: '文章标题2' },
    { title: '任务3', name: '文章标题3' },
  ]);*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // SelectionModel 用于管理行的选择状态
  selection = new SelectionModel<Article>(true, []);

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      content: [''],
      slug: [''],
      tags: [''],
      viewCount: [null],
      isPublished: [null],
      authorId: [''],
      createdAtStart: [null],
      createdAtEnd: [null],
      updatedAtStart: [null],
      updatedAtEnd: [null],
    });

    this.loadArticles();
  }

  loadArticles() {
    if (this.filterForm && this.filterForm.value) {
      const searchParams = cleanQueryParams(this.filterForm.value);
      const payload = convertDatesToISO(searchParams, [
        'createdAtStart',
        'createdAtEnd',
        'updatedAtStart',
        'updatedAtEnd',
      ] as const);
      console.log('搜索参数 》》', payload);
      this.articleService
        .getArticles(this.page, this.limit, payload)
        .subscribe((response) => {
          console.log('data from server', response);
          this.dataSource = response.data;
          this.totalArticles = response.total;
        });
    } else {
      this.articleService
        .getArticles(this.page, this.limit)
        .subscribe((response) => {
          console.log('data from server', response);
          this.dataSource = response.data;
          this.totalArticles = response.total;
        });
    }
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1; // MatPaginator 的 pageIndex 从 0 开始
    this.limit = event.pageSize;
    this.loadArticles();
  }

  newArticle() {
    this.router.navigate(['/admin/articles/new']);
  }

  viewArticle(id: number) {
    this.router.navigate(['/admin/articles/view', id]);
  }

  viewArticleDetail(id: number): void {
    this.router.navigate(['/admin/articles/detail', id]);
  }

  editArticle(id: number) {
    this.router.navigate(['/admin/articles/edit', id]);
  }

  deleteArticle(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '250ms',
      data: {
        title: '删除文章',
        content: `确定要删除ID为:${id}的这篇文章么？`,
        confirmText: '删除',
        cancelText: '取消',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.articleService.deleteArticle(id).subscribe({
          next: () => {
            console.log('Article deleted successfully');
            this.loadArticles(); // 刷新文章列表
          },
          error: (err) => {
            console.error('Error deleting article:', err);
            this.snackBarService.showInfo('删除文章失败，请稍后重试。');
          },
          complete: () => {
            console.log('Delete operation completed');
          },
        });
      }
    });
  }

  onSearch() {
    console.log('搜索表单', this.filterForm.value);
    this.page = 1;
    this.loadArticles();
  }

  onReset() {
    this.filterForm.reset();
    this.onSearch();
  }

  /** 是否所有行都被选中 */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** 选择所有行。如果已全选则取消全选。 */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }

  /** 获取复选框的标签 */
  checkboxLabel(row?: Article): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  publishSelected(): void {
    const selectedArticles = this.selection.selected;
    if (selectedArticles.length > 0) {
      const selectedIds = selectedArticles.map((article) => article.id);
      const payload: BatchUpdatePayload = {
        ids: selectedIds,
        action: 'publish',
      };
      this.articleService.batchUpdateArticles(payload).subscribe({
        next: (response) => {
          console.log('Batch update response:', response);
          this.snackBarService.showSuccess(
            `成功发布 ${response.successfulCount} 篇文章，失败 ${response.failedCount} 篇文章。`
          );
          this.loadArticles(); // 刷新文章列表
          this.selection.clear(); // 清空选择
        },
        error: (err) => {
          console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `批量发布文章失败，请稍后重试。
            reason: ${err.error.message || ''}`
          );
        },
        complete: () => {
          console.log('Batch update operation completed');
        },
      });
    } else {
      this.snackBarService.showInfo('请先选择要发布的文章');
    }
  }

  unpublishSelected(): void {
    const selectedArticles = this.selection.selected;
    if (selectedArticles.length > 0) {
      const selectedIds = selectedArticles.map((article) => article.id);
      const payload: BatchUpdatePayload = {
        ids: selectedIds,
        action: 'unpublish',
      };
      this.articleService.batchUpdateArticles(payload).subscribe({
        next: (response) => {
          console.log('Batch update response:', response);
          this.snackBarService.showSuccess(
            `成功下架 ${response.successfulCount} 篇文章，失败 ${response.failedCount} 篇文章。`
          );
          this.loadArticles(); // 刷新文章列表
          this.selection.clear(); // 清空选择
        },
        error: (err) => {
          console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `批量下架文章失败，请稍后重试。reason: ${err.error.message || ''}`
          );
        },
        complete: () => {
          console.log('Batch update operation completed');
        },
      });
    } else {
      this.snackBarService.showInfo('请先选择要下架的文章');
    }
  }

  deleteSelected(): void {
    const selectedArticles = this.selection.selected;
    if (selectedArticles.length > 0) {
      const selectedIds = selectedArticles.map((article) => article.id);
      const payload: BatchUpdatePayload = {
        ids: selectedIds,
        action: 'unpublish',
      };
      this.articleService.batchUpdateArticles(payload).subscribe({
        next: (response) => {
          console.log('Batch update response:', response);
          this.snackBarService.showSuccess(
            `成功删除 ${response.successfulCount} 篇文章，失败 ${response.failedCount} 篇文章。`
          );
          this.loadArticles(); // 刷新文章列表
          this.selection.clear(); // 清空选择
        },
        error: (err) => {
          console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `批量删除文章失败，请稍后重试。reason: ${err.error.message || ''}`
          );
        },
        complete: () => {
          console.log('Batch update operation completed');
        },
      });
    } else {
      this.snackBarService.showInfo('请先选择要删除的文章');
    }
  }
}
