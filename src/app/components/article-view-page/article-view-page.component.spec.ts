import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleViewPageComponent } from './article-view-page.component';

describe('ArticleViewPageComponent', () => {
  let component: ArticleViewPageComponent;
  let fixture: ComponentFixture<ArticleViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
