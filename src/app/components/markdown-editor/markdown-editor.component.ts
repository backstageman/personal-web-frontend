import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Vditor from 'vditor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-markdown-editor',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  vditor: Vditor | null = null;
  elementId = 'vditor-editor';
  private inputTimeout: any;
  private initStartTime: number = 0;
  private renderCompleteTime: number = 0;

  constructor() {}

  @ViewChild('vditorContainer') vditorContainer!: ElementRef;

  ngOnInit(): void {
    this.elementId = `vditor-editor-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngAfterViewInit(): void {
    this.initVditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.vditor && !changes['value'].firstChange) {
      const newValue = changes['value'].currentValue || '';
      if (this.vditor.getValue() !== newValue) {
        this.vditor.setValue(newValue);
      }
    }
  }

  private initVditor(): void {
    this.initStartTime = performance.now();
    console.log(`[Markdown Editor] 开始初始化编辑器...`);

    setTimeout(() => {
      try {
        this.vditor = new Vditor(this.elementId, {
          height: 400,
          mode: 'ir',
          placeholder: '请输入 Markdown 内容...',
          theme: 'classic',
          cache: {
            enable: false,
          },
          input: (value: string) => {
            if (this.inputTimeout) {
              clearTimeout(this.inputTimeout);
            }
            this.inputTimeout = setTimeout(() => {
              this.valueChange.emit(value);
            }, 300);
          },
          after: () => {
            this.renderCompleteTime = performance.now();
            const initTime = this.renderCompleteTime - this.initStartTime;
            console.log(
              `[Markdown Editor] 编辑器渲染完成，耗时: ${initTime.toFixed(2)}ms`
            );

            if (this.value) {
              this.vditor?.setValue(this.value);
            }
          },
          toolbar: [
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'quote',
            'code',
            '|',
            'undo',
            'redo',
          ],
          preview: {
            delay: 0,
          },
          cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.11.2',
          counter: {
            enable: false,
          },
          hint: {
            parse: false,
          },
          debugger: false,
        });
      } catch (error) {
        console.error('Error initializing Vditor:', error);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }

    if (this.vditor) {
      this.vditor.destroy();
      this.vditor = null;
    }
  }

  public getValue(): string {
    return this.vditor?.getValue() || '';
  }

  public setValue(value: string): void {
    this.vditor?.setValue(value);
  }

  // 性能监控方法
  public getPerformanceInfo(): { initTime: number; renderTime: number } {
    return {
      initTime: this.initStartTime,
      renderTime: this.renderCompleteTime,
    };
  }

  public getRenderDuration(): number {
    if (this.renderCompleteTime && this.initStartTime) {
      return this.renderCompleteTime - this.initStartTime;
    }
    return 0;
  }
}
