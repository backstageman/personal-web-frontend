import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleForm3Component } from './article-form3.component';

describe('ArticleForm3Component', () => {
  let component: ArticleForm3Component;
  let fixture: ComponentFixture<ArticleForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleForm3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
