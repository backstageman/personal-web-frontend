import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import hljs from 'highlight.js';
// import { AuthService } from './services/auth.service';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnInit {
  title = `Charlie's media platform`;
  private authService = inject(AuthService);

  ngOnInit(): void {
    // console.log('AppComponent ngOnInit');
    this.authService.initAuthState();
  }

  ngAfterViewInit() {
    document.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
    const blocks = document.querySelectorAll('pre code');
    if ((window as any).__debugOnce) return;
    (window as any).__debugOnce = true; // 只打印一次
  }
}
