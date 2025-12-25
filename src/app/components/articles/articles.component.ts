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
import { ArticlesService } from '../../services/articles.service';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snackbar.service';
import { BatchUpdatePayload } from '../../shared/interfaces/api-response.interface';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatPaginator,
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
    MatChip,
    NgIf,
    NgFor,
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
  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'coverImage',
    'slug',
    'tags',
    'viewCount',
    'isPublished',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Article>([]);
  totalArticles = 0;
  page = 1;
  limit = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // SelectionModel for managing row selection state
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadArticles() {
    this.articleService.getArticles(this.page, this.limit).subscribe({
      next: (response) => {
        // 获取文章数组数据，支持标准响应格式
        let articlesData: Article[] = [];

        if (response?.data && Array.isArray(response.data)) {
          // 标准格式: { data: [...], total, page, limit }
          articlesData = response.data;
          this.totalArticles = response.total;
        } else {
          // 如果响应格式不符合预期，使用空数组
          articlesData = [];
          this.totalArticles = 0;
        }

        this.dataSource.data = articlesData;
      },
      error: (error) => {
        // console.error('Error loading articles:', error);
      },
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
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
      data: {
        title: 'Delete Article',
        content: `Are you sure you want to delete article with ID: ${id}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.articleService.deleteArticle(id).subscribe({
          next: () => {
            this.loadArticles();
          },
          error: (err) => {
            // console.error('Error deleting article:', err);
            this.snackBarService.showInfo(
              'Failed to delete article. Please try again later.'
            );
          },
        });
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.loadArticles();
  }

  onReset() {
    this.filterForm.reset();
    this.onSearch();
  }

  /** Whether all rows are selected */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Toggle all rows. If all are selected, deselect all. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** Get the checkbox label for a row */
  checkboxLabel(row?: Article): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
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
          this.snackBarService.showSuccess(
            `Successfully published ${response.successfulCount} articles, failed ${response.failedCount} articles.`
          );
          this.loadArticles();
          this.selection.clear();
        },
        error: (err) => {
          // console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `Batch publish articles failed, please try again later. reason: ${
              err.error?.message || ''
            }`
          );
        },
      });
    } else {
      this.snackBarService.showInfo('Please select articles to publish first.');
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
          this.snackBarService.showSuccess(
            `Successfully unpublished ${response.successfulCount} articles, failed ${response.failedCount} articles.`
          );
          this.loadArticles();
          this.selection.clear();
        },
        error: (err) => {
          // console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `Batch unpublish articles failed, please try again later. reason: ${
              err.error?.message || ''
            }`
          );
        },
      });
    } else {
      this.snackBarService.showInfo(
        'Please select articles to unpublish first.'
      );
    }
  }

  deleteSelected(): void {
    const selectedArticles = this.selection.selected;
    if (selectedArticles.length > 0) {
      const selectedIds = selectedArticles.map((article) => article.id);
      const payload: BatchUpdatePayload = {
        ids: selectedIds,
        action: 'delete',
      };
      this.articleService.batchUpdateArticles(payload).subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(
            `Successfully deleted ${response.successfulCount} articles, failed ${response.failedCount} articles.`
          );
          this.loadArticles();
          this.selection.clear();
        },
        error: (err) => {
          // console.error('Error in batch update:', err);
          this.snackBarService.showError(
            `Batch delete articles failed, please try again later. reason: ${
              err.error?.message || ''
            }`
          );
        },
      });
    } else {
      this.snackBarService.showInfo('Please select articles to delete first.');
    }
  }
}
