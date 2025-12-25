import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { UploadProgress } from '../../services/upload.service';

@Component({
    selector: 'app-cover-image-skeleton',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatIconModule],
    templateUrl: './cover-image-skeleton.component.html',
    styleUrls: ['./cover-image-skeleton.component.scss']
})
export class CoverImageSkeletonComponent {
    @Input() isUploading = false;
    @Input() uploadProgress: UploadProgress | null = null;

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
