import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyMdeWrapperComponent } from './easy-mde-wrapper.component';

describe('EasyMdeWrapperComponent', () => {
  let component: EasyMdeWrapperComponent;
  let fixture: ComponentFixture<EasyMdeWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyMdeWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyMdeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
