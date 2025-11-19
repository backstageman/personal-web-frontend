# 封面图片上传集成说明

## 🎯 集成完成

已成功将封面图片上传功能集成到 `admin/articles/new` 页面中。

## 📋 修改的文件

### 1. `ArticleForm2Component` (主要表单组件)
**文件路径**: `src/app/components/article-form2/article-form2.component.ts`

**修改内容**:
- 导入 `CoverImageUploadComponent` 替换 `FileUploadComponent`
- 更新表单字段 `coverImage` 的默认值为 `null`
- 简化上传处理方法为 `onCoverImageChange`
- 更新提交逻辑确保封面图正确处理

### 2. HTML模板更新
**文件路径**: `src/app/components/article-form2/article-form2.component.html`

**修改内容**:
```html
<!-- 旧的文件上传组件 -->
<app-file-upload
  [imageUrl]="form.value.coverImage"
  accept="image/*"
  [maxSize]="5242880"
  placeholder="点击或拖拽上传封面图"
  (fileSelected)="onFileSelected($event)"
  (urlChanged)="onUrlChanged($event)"
  (error)="onUploadError($event)"
></app-file-upload>

<!-- 新的封面图片上传组件 -->
<app-cover-image-upload
  [coverImageKey]="form.value.coverImage"
  (coverImageChange)="onCoverImageChange($event)"
></app-cover-image-upload>
```

### 3. 样式文件更新
**文件路径**: `src/app/components/article-form2/article-form2.component.scss`

**修改内容**:
- 清理重复的样式代码
- 更新为适配 `CoverImageUploadComponent` 的样式
- 确保组件在表单网格中正确显示

## 🚀 功能特性

### 新的封面图片上传功能提供：
- ✅ **完整的上传流程**: 获取预签名URL → 上传到R2 → 返回key
- ✅ **进度显示**: 实时显示上传进度条
- ✅ **图片预览**: 支持封面图预览和悬停操作
- ✅ **操作按钮**: 更换和删除封面图
- ✅ **错误处理**: 友好的错误提示
- ✅ **响应式设计**: 移动端适配

### 数据流程：
1. 用户点击"上传封面图"或"更换"
2. 调用 `POST /media/presign-upload` 获取预签名URL
3. 通过预签名URL PUT上传到R2（支持进度）
4. 上传成功后返回图片key给表单
5. 提交表单时包含 `coverImage` 字段（key格式）
6. 前端通过 `https://cdn.charliesmp.com/${key}` 显示图片

## 🎮 使用方法

1. **启动开发服务器**:
   ```bash
   ng serve
   ```

2. **访问新建文章页面**:
   ```
   http://localhost:4200/admin/articles/new
   ```

3. **上传封面图**:
   - 点击"上传封面图"按钮
   - 选择图片文件（JPG/PNG/GIF/WebP）
   - 等待上传完成
   - 可随时更换或删除

4. **表单提交**:
   - 封面图key会自动包含在表单数据中
   - 后端会接收到 `coverImage` 字段（图片key格式）

## 🔗 技术依赖

确保后端提供以下API：
- `POST /media/presign-upload?fileName=xxx` - 获取预签名上传URL
- 返回格式: `{ presignedUrl: string, key: string }`

## 📱 集成验证

- ✅ TypeScript 编译通过
- ✅ Angular 构建成功
- ✅ 组件正确导入和注册
- ✅ 表单数据绑定正常
- ✅ 样式适配完成

现在你可以直接使用 `admin/articles/new` 页面来创建带封面图的文章了！