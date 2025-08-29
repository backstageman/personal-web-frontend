import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EasyMDE from 'easymde';

@Component({
  selector: 'app-easy-mde-wrapper',
  imports: [CommonModule],
  standalone: true,
  // templateUrl: './easy-mde-wrapper.component.html',
  template: `<textarea #mde></textarea>`,
  styleUrl: './easy-mde-wrapper.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EasyMdeWrapperComponent),
    },
  ],
})
export class EasyMdeWrapperComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild('mde', { static: true }) textarea!: ElementRef;
  private easyMde!: EasyMDE;
  private onChange!: (value: string) => void;
  private onTouched!: () => void;

  ngAfterViewInit(): void {
    this.easyMde = new EasyMDE({
      element: this.textarea.nativeElement,
      spellChecker: false,
      hideIcons: ['side-by-side', 'fullscreen', 'guide'],
      showIcons: ['code', 'table'],
      previewImagesInEditor: true,
    });
    this.easyMde.codemirror.on('change', () => {
      if (this.onChange) {
        this.onChange(this.easyMde.value());
      }
    });
  }

  writeValue(value: string): void {
    if (this.easyMde) {
      this.easyMde.value(value || '');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /* setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  } */
}
