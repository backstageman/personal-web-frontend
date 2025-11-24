import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface StreamUploadResponse {
  fileKey: string; // UUID
  publicUrl: string; // Full CDN URL
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string; // UUID
  publicUrl: string; // Full CDN URL
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly apiUrl = environment.apiUrl;
  private readonly cdnBaseUrl = 'https://cdn.charliesmp.com';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * 检查用户是否已登录
   * @returns 是否登录
   */
  isUserLoggedIn(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      console.warn('UploadService: User is not logged in, upload may fail');
    }
    return isLoggedIn;
  }

  /**
   * 获取当前用户token
   * @returns access token
   */
  getUserToken(): string {
    return this.authService.getAccessToken();
  }

  /**
   * 流式上传文件到后端
   * @param fileName 文件名
   * @param contentType MIME类型
   * @param file 文件对象
   * @returns 上传响应和进度Observable
   */
  streamUploadFile(
    fileName: string,
    contentType: string,
    category: string,
    file: File
  ): Observable<{
    response: StreamUploadResponse | null;
    progress: UploadProgress;
  }> {
    return new Observable<{
      response: StreamUploadResponse | null;
      progress: UploadProgress;
    }>((observer) => {
      // 构建查询参数
      const params = new URLSearchParams({
        filename: fileName,
        contentType: contentType,
        category,
      });

      const uploadUrl = `${this.apiUrl}/media-assets/upload?${params}`;

      // 创建FormData，但后端需要原始流，所以直接发送文件
      const headers = new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        Authorization: `Bearer ${this.getUserToken()}`,
        // 移除Content-Length header，让浏览器自动计算
      });

      const req = new HttpRequest('POST', uploadUrl, file, {
        headers,
        reportProgress: true,
        responseType: 'json',
      });

      this.http.request(req).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress: UploadProgress = {
              loaded: event.loaded || 0,
              total: event.total || file.size,
              percentage: Math.round(
                ((event.loaded || 0) * 100) / (event.total || file.size)
              ),
            };
            observer.next({ response: null, progress });
          } else if (event.type === HttpEventType.Response) {
            const response = event.body as StreamUploadResponse;
            observer.next({
              response,
              progress: {
                loaded: file.size,
                total: file.size,
                percentage: 100,
              },
            });
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Error in stream upload:', error);
          observer.error(new Error('Stream upload failed'));
        },
      });
    });
  }

  /**
   * 获取预签名上传URL
   * @param fileName 文件名
   * @param contentType MIME类型
   * @returns 预签名上传响应
   */
  getPresignedUploadUrl(
    fileName: string,
    contentType: string
  ): Observable<PresignedUploadResponse> {
    // 移除授权头部，因为后端使用 AuthType.None
    const request$ = this.http.post<PresignedUploadResponse>(
      `${this.apiUrl}/media/presign-upload`,
      {
        filename: fileName,
        contentType: contentType,
      }
    );

    return request$.pipe(
      catchError((error) => {
        console.error('Error getting presigned upload URL:', error);
        return throwError(
          () => new Error('Failed to get presigned upload URL')
        );
      })
    );
  }

  /**
   * 通过预签名URL上传文件到R2
   * @param uploadUrl 预签名上传URL
   * @param file 要上传的文件
   * @returns 上传进度Observable
   */
  uploadToR2(uploadUrl: string, file: File): Observable<UploadProgress> {
    return new Observable<UploadProgress>((observer) => {
      const req = new HttpRequest('PUT', uploadUrl, file, {
        reportProgress: true,
        withCredentials: false, // ⬅ 关键！避免CORS预检请求的问题
      });

      this.http.request(req).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress: UploadProgress = {
              loaded: event.loaded || 0,
              total: event.total || file.size,
              percentage: Math.round(
                ((event.loaded || 0) * 100) / (event.total || file.size)
              ),
            };
            observer.next(progress);
          } else if (event.type === HttpEventType.Response) {
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Error uploading file to R2:', error);
          observer.error(new Error('Failed to upload file'));
        },
      });
    });
  }

  /**
   * 根据key生成CDN访问URL
   * @param key 文件key（可能是UUID或完整路径）
   * @returns CDN访问URL
   */
  getCdnUrl(key: string): string {
    // 流式上传返回的key已经是完整路径（如：uploads/2025-01-19/filename.jpg）
    // 直接与CDN基础URL拼接即可
    return `${this.cdnBaseUrl}/${key}`;
  }

  /**
   * 从文件路径提取文件名
   * @param file 文件对象
   * @returns 符合后端要求的文件名
   */
  extractFileName(file: File): string {
    // 提取文件扩展名
    const extension = file.name.substring(file.name.lastIndexOf('.'));
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));

    // 清理基础文件名，只保留字母、数字、点、连字符和下划线
    const cleanBaseName = baseName
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 50); // 限制长度避免过长

    // 生成唯一标识符，使用时间戳的16进制和随机数
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);

    // 构建符合要求的文件名：清理后的基础名-时间戳-随机数.扩展名
    const filename = cleanBaseName
      ? `${cleanBaseName}-${timestamp}-${random}${extension}`
      : `${timestamp}-${random}${extension}`;

    return filename;
  }

  /**
   * 验证上传完成
   * 注意：根据后端代码，实际上不需要这个验证步骤
   * 后端直接返回 fileKey 作为 UUID，上传完成后即可使用
   * @param mediaId 媒体ID
   * @param fileSize 文件大小
   * @returns 验证响应
   */
  verifyUpload(mediaId: string, fileSize: number): Observable<any> {
    // 根据后端实现，实际上不需要验证步骤
    // 直接返回成功响应，使用后端返回的fileKey
    const response = {
      key: mediaId, // 使用后端返回的fileKey
      mediaId: mediaId,
      verified: true,
    };
    return of(response);
  }
}
