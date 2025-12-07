import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  private router = inject(Router);

  menuItems = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Blog', path: '/blog', exact: false },
    { label: 'Projects', path: '/projects', exact: false },
    { label: 'About Me', path: '/about', exact: true },
    { label: 'Contact Me', path: '/contact', exact: true },
  ];
}
