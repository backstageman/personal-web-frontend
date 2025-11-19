import { Component, EventEmitter, Input, Output, HostListener, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnChanges {
  @Input() accept: string = 'image/*';
  @Input() maxSize: number = 5 * 1024 * 1024;
  @Input() placeholder: string = '点击选择文件或拖拽文件到此处';
  @Input() imageUrl: string | null = null;
  
  @Output() fileSelected = new EventEmitter<File>();
  @Output() urlChanged = new EventEmitter<string | null>();
  @Output() error = new EventEmitter<string>();
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  isDragging = false;
  isLoading = false;
  previewUrl: string | null = null;
  
  constructor() {
    this.previewUrl = this.imageUrl;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl']) {
      this.previewUrl = this.imageUrl;
    }
  }
  
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFile(target.files[0]);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (items) {
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
  }
  
  private handleFile(file: File): void {
    if (!this.isValidFileType(file)) {
      this.error.emit('不支持的文件类型');
      return;
    }
    
    if (file.size > this.maxSize) {
      this.error.emit(`文件大小不能超过 ${this.formatFileSize(this.maxSize)}`);
      return;
    }
    
    this.createPreview(file);
    this.fileSelected.emit(file);
  }
  
  private isValidFileType(file: File): boolean {
    if (this.accept === 'image/*') {
      return file.type.startsWith('image/');
    }
    
    const acceptedTypes = this.accept.split(',').map(type => type.trim());
    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });
  }
  
  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  onClick(): void {
    this.fileInput.nativeElement.click();
  }
  
  removeImage(): void {
    this.previewUrl = null;
    this.urlChanged.emit(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
