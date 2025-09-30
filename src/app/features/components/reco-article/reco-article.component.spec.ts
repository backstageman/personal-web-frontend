import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoArticleComponent } from './reco-article.component';

describe('RecoArticleComponent', () => {
  let component: RecoArticleComponent;
  let fixture: ComponentFixture<RecoArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
