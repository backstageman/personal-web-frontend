import { I } from '@angular/cdk/keycodes';
import { Component, inject, Inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

const DEFAULT_DIALOG_DATA: ConfirmDialogData = {
  title: '确认操作',
  content: '你确定要执行此操作吗？',
  confirmText: '确认',
  cancelText: '取消',
};

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButton],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  public data: ConfirmDialogData =
    inject(MAT_DIALOG_DATA, {
      optional: true,
    }) ?? DEFAULT_DIALOG_DATA;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
