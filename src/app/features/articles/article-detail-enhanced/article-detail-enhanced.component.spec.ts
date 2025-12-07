import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailEnhancedComponent } from './article-detail-enhanced.component';

describe('ArticleDetailEnhancedComponent', () => {
  let component: ArticleDetailEnhancedComponent;
  let fixture: ComponentFixture<ArticleDetailEnhancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailEnhancedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailEnhancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
