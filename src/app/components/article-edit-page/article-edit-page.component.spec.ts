import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditPageComponent } from './article-edit-page.component';

describe('ArticleEditPageComponent', () => {
  let component: ArticleEditPageComponent;
  let fixture: ComponentFixture<ArticleEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
