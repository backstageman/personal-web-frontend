import { NgClass, NgStyle } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg
      class="icon"
      aria-hidden="true"
      [ngStyle]="style"
      [ngClass]="computedClass"
    >
      <use [attr.xlink:href]="symbolUrl"></use>
    </svg>
  `,
  imports: [NgStyle, NgClass],
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input() name!: string;
  @Input() style: any = {};
  @Input() className: string = '';

  @HostBinding('class')
  hostClass: string = '';

  get symbolUrl(): string {
    return `#icon-${this.name}`;
  }

  get computedClass(): string {
    return !this.className
      ? this.hostClass
      : `${this.hostClass} ${this.className}`.trim();
  }
}
