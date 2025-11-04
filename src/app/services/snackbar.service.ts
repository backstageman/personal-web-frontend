import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface SnackbarPosition {
  horizontal: 'start' | 'center' | 'end' | 'left' | 'right';
  vertical: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  showSuccess(
    message: string,
    duration: number = 3000,
    position: SnackbarPosition = { horizontal: 'center', vertical: 'top' }
  ): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: position.horizontal,
      verticalPosition: position.vertical,
    };
    this.snackBar.open(message, 'close', config);
  }

  showError(
    message: string,
    duration: number = 5000,
    position: SnackbarPosition = { horizontal: 'center', vertical: 'top' }
  ): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: position.horizontal,
      verticalPosition: position.vertical,
    };
    this.snackBar.open(message, 'close', config);
  }

  showInfo(
    message: string,
    duration: number = 3000,
    action: string = 'close',
    position: SnackbarPosition = { horizontal: 'center', vertical: 'top' }
  ): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: position.horizontal,
      verticalPosition: position.vertical,
    };
    this.snackBar.open(message, action, config);
  }
}
