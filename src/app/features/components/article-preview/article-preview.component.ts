import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-preview',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss',
})
export class ArticlePreviewComponent implements OnChanges, AfterViewChecked {
  /*   @Input() title!: string;
  @Input() author!: string;
  @Input() date!: string;
  @Input() coverImage?: string; */
  @Input() content!: string; // 传入的 Markdown 文本
  // @Input() article!: Article;

  private needsHighlight = false;
  // htmlContent: Promise<string> | string = '';
  // htmlContent: string = '';
  html: SafeHtml = '';
  @ViewChild('contentContainer', { static: false })
  contentContainer?: ElementRef<HTMLElement>;

  // 为事件委托保存绑定后的处理函数，方便移除监听
  private boundCopyHandler = this.onCopyButtonClick.bind(this);
  private copyListenerAttached = false;

  constructor(private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {
    // 使用 marked-highlight 扩展（官方推荐）
    marked.use(
      // 可以同时传入多个 extension/options，这里先挂载高亮扩展
      markedHighlight({
        // 可选：给 <code> 的 class 前缀（highlight.js 的样式依赖 class 名称）
        langPrefix: 'hljs language-',
        // 可选：当没有语言时给 code 标签添加的 class
        emptyLangClass: 'hljs',
        async: false,
        // highlight 函数：将 code 转为 HTML（可以同步或返回 Promise）
        highlight(code: string, lang: string) {
          /* const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          const result = hljs.highlight(code, { language }).value;

          // 给每一行加 <span>
          return result
            .split('\n')
            .map((line) => `<span>${line || ' '}</span>`)
            .join('\n'); */
          /*    // highlight.js v11+ 的用法
          return hljs.highlight(code, { language }).value; */

          try {
            // 优先使用指定语言（且已注册）
            if (lang && hljs.getLanguage(lang)) {
              return wrapLines(hljs.highlight(code, { language: lang }).value);
            }
            // 否则尝试自动检测
            const auto = hljs.highlightAuto(code);
            return wrapLines(auto.value);
          } catch (err) {
            // 出错则返回转义后的原文（避免抛异常）
            return wrapLines(escapeHtml(code));
          }
        },
      })
    );

    // 其它标志位也可以通过 marked.use 一并设置
    marked.use({
      gfm: true,
      breaks: true,
    });
  }

  ngOnInit(): void {
    // console.log('ngOnInit content:', this.content);
  }

  /*  ngOnChanges(): void {
    // 普通同步解析
    const raw = marked.parse(this.content || '');
    // 如果你的 highlight 是 async（返回 Promise），需要 await marked.parse(...) 并把 async: true 传给 marked-highlight
    // Angular 会默认清理 innerHTML，这里明确告诉 Angular 这是我们信任的 HTML
    this.html = this.sanitizer.bypassSecurityTrustHtml(raw as string);
  } */

  ngOnChanges(changes: SimpleChanges): void {
    /* console.log(
      'ngOnChanges triggered:',
      changes,
      this.content,
      this.content.length
    ); */
    if ('content' in changes) {
      let raw = marked.parse(this.content || '') as string;
      // 给每个 <pre><code>...</code></pre> 包一层 wrapper，并注入复制按钮 HTML
      // 用更健壮的正则，匹配带属性或带空白的 pre/code
      raw = raw.replace(
        /<pre\b[^>]*>\s*<code\b[^>]*>[\s\S]*?<\/code>\s*<\/pre>/g,
        (match) =>
          `<div class="code-block-wrapper">
             <div class="code-block-actions">
               <button class="copy-code-btn" type="button" aria-label="复制代码">复制</button>
             </div>
             ${match}
           </div>`
      );
      // console.log('parsed raw:', raw);
      this.html = this.sanitizer.bypassSecurityTrustHtml(raw);
    }
  }

  ngAfterViewChecked() {
    if (this.needsHighlight) {
      this.needsHighlight = false;
    }
    // 只注册一次事件委托监听器（委托到 content 容器）
    if (!this.copyListenerAttached && this.contentContainer?.nativeElement) {
      this.contentContainer.nativeElement.addEventListener(
        'click',
        this.boundCopyHandler
      );
      this.copyListenerAttached = true;
    }
  }

  ngOnDestroy() {
    if (this.copyListenerAttached && this.contentContainer?.nativeElement) {
      this.contentContainer.nativeElement.removeEventListener(
        'click',
        this.boundCopyHandler
      );
      this.copyListenerAttached = false;
    }
  }

  /**
   * 事件委托处理函数：当用户点击 .copy-code-btn 时，找到该按钮对应的 <pre><code> 并复制其文本内容
   */
  private async onCopyButtonClick(ev: Event) {
    const target = ev.target as HTMLElement | null;
    if (!target) return;

    // 如果点击的不是按钮本身，但是在按钮内部（图标等），也要处理
    const button = target.closest('.copy-code-btn') as HTMLElement | null;
    if (!button) return;

    const wrapper = button.closest('.code-block-wrapper');
    if (!wrapper) return;

    const codeEl = wrapper.querySelector('pre code') as HTMLElement;
    if (!codeEl) {
      this.snackBar.open('未找到代码内容', '关闭', { duration: 2000 });
      return;
    }

    const text = codeEl.innerText ?? '';

    // 优先使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        this.snackBar.open('已复制代码到剪贴板', '关闭', { duration: 2000 });
      } catch (err) {
        // fallback
        const ok = fallbackCopyTextToClipboard(text);
        if (ok) {
          this.snackBar.open('已复制代码到剪贴板（备用方法）', '关闭', {
            duration: 2000,
          });
        } else {
          this.snackBar.open('复制失败，请手动复制', '关闭', {
            duration: 3000,
          });
        }
      }
    } else {
      // 旧浏览器 fallback
      const ok = fallbackCopyTextToClipboard(text);
      if (ok) {
        this.snackBar.open('已复制代码到剪贴板（备用）', '关闭', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('复制失败，请手动复制', '关闭', { duration: 3000 });
      }
    }
  }
}

/* 帮助函数：把 highlight 生成的 HTML 按行包裹，保留内部 hljs 的 <span> 结构 */
function wrapLines(html: string) {
  return html
    .split(/\r?\n/)
    .map((line) => `<span class="code-line">${line || '&nbsp;'}</span>`)
    .join('\n');
}

/* 简单 HTML 转义（在发生异常时使用） */
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* 备用复制（用于 clipboard API 不可用时） */
function fallbackCopyTextToClipboard(text: string) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // 避免页面跳动
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('fallback 复制失败：', err);
    return false;
  }
}
